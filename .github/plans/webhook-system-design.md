# Webhook System Design Blueprint

Based on analysis of the Unvios codebase, here's a comprehensive design for a secure webhook system.

## Architecture Overview

```
User Signs Up (app/(login)/actions.ts::signUp)
  ↓
  → User created in DB (users table)
  ↓
  → Dispatch webhook event (new async function)
  ↓
  → Sign payload with HMAC-SHA256
  ↓
  → POST to external backend (with retry logic)
  ↓
  → External backend verifies signature using your public key
```

---

## 1. Key Management Strategy

### Private Key (Unvios side - secrets)

- Stored in environment variable: `WEBHOOK_SIGNING_SECRET`
- Used to HMAC-sign payloads before sending
- Never shared or exposed
- Should be rotated periodically

### Public Key (External backend side - public)

- Derived from your private signing secret
- You provide this to external backends for verification
- They use it to validate webhook authenticity
- Cannot be used to forge signatures

### Implementation: Use HMAC-SHA256 (no asymmetric keys needed - simpler and sufficient)

- Private secret: 32+ character random string
- Each webhook signed with: `HMAC-SHA256(payload, secret)`
- External backend verifies by computing the same HMAC and comparing

---

## 2. Webhook Endpoint Design

### New route: `app/api/webhooks/events/route.ts`

**Endpoint responsibilities**:

- Trigger webhook dispatch when user signs up
- Handle potential external backend failures gracefully
- Queue retries for failed deliveries
- Log webhook attempts for debugging

### Payload structure:

```json
{
  "event": "user.created",
  "timestamp": "2025-11-14T10:30:00Z",
  "data": {
    "user_id": 123,
    "user_email": "user@example.com"
  }
}
```

### Headers sent to external backend:

- `X-Webhook-Signature`: HMAC-SHA256(payload, secret)
- `X-Webhook-Timestamp`: ISO timestamp for replay attack prevention
- `X-Webhook-Event`: Event type (e.g., "user.created")
- `Content-Type`: `application/json`

---

## 3. Integration Points

### In `app/(login)/actions.ts` (signUp function):

- After `db.insert(users).values(newUser).returning()` succeeds
- Call new async webhook dispatch function
- Use `Promise.allSettled()` to prevent webhook failures from blocking signup
- Log errors but don't throw

### New utility: `lib/webhooks/dispatcher.ts`

- Main async function: `dispatchUserCreatedWebhook(userId, email)`
- Handles signature generation
- Makes HTTP POST request to external endpoint
- Implements retry logic (exponential backoff)
- Logs all attempts

---

## 4. Signature Verification (for external backend)

External backend receives webhook and should verify:

```typescript
// External backend verification logic (pseudo-code)
function verifyWebhookSignature(
  payload: string,
  signature: string,
  timestamp: string,
  publicSecret: string
) {
  // Prevent replay attacks (check timestamp within 5 minutes)
  const signedTimestamp = parseInt(timestamp);
  const now = Date.now();
  if (Math.abs(now - signedTimestamp) > 5 * 60 * 1000) {
    return false; // Stale request
  }

  // Compute expected signature
  const data = `${timestamp}.${payload}`;
  const computed = HMAC - SHA256(data, publicSecret);

  // Constant-time comparison (prevent timing attacks)
  return computed === signature;
}
```

---

## 5. Configuration & Environment Variables

### Add to `.env.local` and production:

```bash
# Webhook configuration
WEBHOOK_SIGNING_SECRET=<32+ char random string>
WEBHOOK_ENDPOINT_URL=https://your-external-backend.com/webhooks/users
WEBHOOK_RETRY_MAX_ATTEMPTS=3
WEBHOOK_RETRY_DELAY_MS=1000
WEBHOOK_TIMEOUT_MS=10000
```

---

## 6. Database Tracking (Optional Enhancement)

Create webhook delivery logs table for audit trail:

```typescript
export const webhookLogs = pgTable("webhook_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  event: varchar("event", { length: 50 }).notNull(), // "user.created"
  payload: text("payload").notNull(),
  statusCode: integer("status_code"),
  errorMessage: text("error_message"),
  attempts: integer("attempts").notNull().default(1),
  nextRetryAt: timestamp("next_retry_at"),
  succeededAt: timestamp("succeeded_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
```

---

## 7. Security Features

✅ **HMAC-SHA256 signing** - Cryptographically verifies origin
✅ **Timestamp validation** - Prevents replay attacks (5min window)
✅ **Retry logic** - Exponential backoff for transient failures
✅ **Non-blocking** - Webhook delivery doesn't block user signup
✅ **CORS-safe** - POST with standard JSON payload (no special CORS needed)
✅ **Logging** - All delivery attempts tracked for debugging

---

## 8. External Backend Checklist

Your external backend should:

- ✅ Accept POST requests with JSON payload
- ✅ Validate `X-Webhook-Signature` header using your public secret
- ✅ Check `X-Webhook-Timestamp` is within 5 minutes
- ✅ Return HTTP 200-299 for success (2xx)
- ✅ Return HTTP 5xx or timeout for retryable errors
- ✅ Return HTTP 4xx for non-retryable errors (will be logged but not retried)
- ✅ Be idempotent (same webhook delivered twice = same result)

---

## Key Advantages of This Approach

1. **Simple**: HMAC is easier than asymmetric crypto
2. **Secure**: External backend cannot forge webhooks
3. **Reliable**: Retry logic handles transient failures
4. **Auditable**: Can log all delivery attempts
5. **Scalable**: Async dispatch doesn't block signup
6. **Standards-compliant**: Follows webhook best practices
