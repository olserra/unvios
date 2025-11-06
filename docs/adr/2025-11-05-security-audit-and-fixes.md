# Security Audit and Vulnerability Fixes

**Date**: 2025-11-05
**Status**: Proposed
**Decision Makers**: Development Team

## Context

A comprehensive security audit was conducted on the Unvios application, focusing on API routes, authentication mechanisms, database queries, and input validation. This document outlines critical and medium-severity vulnerabilities discovered, along with recommended fixes.

## Critical Vulnerabilities Found

### 1. **IDOR (Insecure Direct Object Reference) in Memory Endpoints**

**Location**: `app/api/memories/[id]/route.ts`

**Issue**: The `PUT` and `DELETE` endpoints for individual memories do not verify that the memory belongs to the authenticated user before modification/deletion.

**Current Code**:

```typescript
export async function PUT(req: NextRequest, { params }: any) {
  const user = await getUser();
  if (!user)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

  const { id: idParam } = await params;
  const id = Number(idParam);

  // Updates memory without checking if memory.userId === user.id
  const [updated] = await db
    .update(memories)
    .set({ content, category, tags })
    .where(eq(memories.id, id))
    .returning();
}
```

**Impact**: Any authenticated user can modify or delete another user's memories by guessing/enumerating memory IDs.

**Severity**: CRITICAL

**Fix Required**: Add user ownership validation before updates/deletes.

---

### 2. **Missing Rate Limiting on All API Routes**

**Location**: All API routes (`app/api/**/*.ts`)

**Issue**: No rate limiting implemented on any API endpoint.

**Impact**:

- Brute force attacks on `/api/auth/login` and `/api/auth/signup`
- DoS attacks on `/api/llm/chat` (expensive LLM calls)
- Resource exhaustion on memory creation endpoints
- API abuse and cost inflation

**Severity**: CRITICAL

**Fix Required**: Implement rate limiting middleware, especially for:

- Authentication endpoints (max 5 attempts per 15 minutes)
- LLM chat endpoint (max 20 requests per minute per user)
- Memory creation (max 100 per hour per user)

---

### 3. **SQL Injection Risk in Vector Search**

**Location**: `lib/db/queries.ts` (line 48-56) and `app/api/llm/chat/route.ts` (line 320)

**Issue**: Vector arrays are concatenated into SQL strings instead of using proper parameterization.

**Current Code**:

```typescript
const vecStr = "[" + vec.join(",") + "]";
await client.unsafe(
  `UPDATE memories SET embedding = $1::vector WHERE id = $2`,
  [vecStr, inserted[0].id]
);
```

**Impact**: While `vec` is currently controlled, if the embedding service is compromised or returns malicious data, SQL injection is possible.

**Severity**: HIGH

**Fix Required**: Validate vector array contains only numbers before concatenation:

```typescript
if (!vec.every((n) => typeof n === "number" && isFinite(n))) {
  throw new Error("Invalid vector data");
}
```

---

### 4. **Weak Password Requirements**

**Location**: `app/(login)/actions.ts`

**Issue**: Password validation only checks minimum length of 8 characters, no complexity requirements.

**Current Code**:

```typescript
password: z.string().min(8).max(100);
```

**Impact**: Users can create weak passwords like "12345678" or "aaaaaaaa".

**Severity**: MEDIUM-HIGH

**Fix Required**: Add password complexity validation:

```typescript
password: z.string()
  .min(8)
  .max(100)
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
    "Password must contain at least one uppercase letter, one lowercase letter, and one number"
  );
```

---

### 5. **Missing CSRF Protection**

**Location**: All API routes accepting POST/PUT/DELETE

**Issue**: No CSRF token validation on state-changing operations.

**Current State**: Cookie has `sameSite: "lax"` which provides partial protection, but not complete.

**Impact**: While `sameSite: lax` prevents most CSRF attacks, stricter protection is recommended for sensitive operations.

**Severity**: MEDIUM

**Fix Required**: Consider upgrading to `sameSite: "strict"` or implement CSRF tokens for sensitive operations.

---

### 6. **Missing Security Headers**

**Location**: `next.config.ts` and `vercel.json`

**Issue**: No security headers configured (CSP, X-Frame-Options, etc.).

**Impact**:

- XSS attacks not mitigated
- Clickjacking possible
- No MIME-type sniffing protection

**Severity**: MEDIUM-HIGH

**Fix Required**: Add security headers in `next.config.ts`:

```typescript
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        {
          key: 'X-Frame-Options',
          value: 'DENY',
        },
        {
          key: 'X-Content-Type-Options',
          value: 'nosniff',
        },
        {
          key: 'Referrer-Policy',
          value: 'strict-origin-when-cross-origin',
        },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=()',
        },
        {
          key: 'Content-Security-Policy',
          value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:;",
        },
      ],
    },
  ];
}
```

---

### 7. **Missing Input Validation on JSON Payloads**

**Location**: Multiple API routes

**Issue**: Request bodies are parsed but not validated against schemas before use.

**Examples**:

- `app/api/memories/route.ts` - No validation on `content`, `category`, `tags`
- `app/api/llm/chat/route.ts` - No validation on `message` length or content

**Impact**:

- Potential for extremely large payloads causing DoS
- Injection of unexpected data types
- Database errors from invalid data

**Severity**: MEDIUM

**Fix Required**: Add Zod schema validation for all request bodies:

```typescript
const createMemorySchema = z.object({
  content: z.string().min(1).max(10000),
  category: z.string().min(1).max(100).optional(),
  tags: z.array(z.string().max(50)).max(10).optional(),
});

const body = await req.json();
const validated = createMemorySchema.parse(body);
```

---

### 8. **Unvalidated Redirect in Login Flow**

**Location**: `app/(login)/actions.ts`

**Issue**: The `redirectTo` parameter from formData is used without validation.

**Current Code**:

```typescript
const redirectTo = formData.get("redirect") as string | null;
if (redirectTo === "checkout") {
  return { error: "Checkout is disabled after migration." };
}
redirect("/dashboard");
```

**Impact**: While currently hardcoded to `/dashboard`, the code structure suggests redirects were previously dynamic, which is an open redirect vulnerability.

**Severity**: LOW (currently mitigated but dangerous pattern)

**Fix Required**: If dynamic redirects are needed, validate against allowlist:

```typescript
const allowedRedirects = ["/dashboard", "/chat", "/memories"];
const redirectTo = formData.get("redirect") as string | null;
const destination =
  redirectTo && allowedRedirects.includes(redirectTo)
    ? redirectTo
    : "/dashboard";
redirect(destination);
```

---

### 9. **Sensitive Data in Error Messages**

**Location**: Multiple API routes

**Issue**: Error messages may leak sensitive information.

**Examples**:

```typescript
return NextResponse.json(
  { error: err.message || "Failed to create memory" },
  { status: 500 }
);
```

**Impact**: Database errors, stack traces, or internal errors could leak system information to attackers.

**Severity**: LOW-MEDIUM

**Fix Required**: Sanitize error messages in production:

```typescript
const errorMessage =
  process.env.NODE_ENV === "production"
    ? "Failed to create memory"
    : err.message || "Failed to create memory";
return NextResponse.json({ error: errorMessage }, { status: 500 });
```

---

### 10. **Missing HTTP-Only Flag Validation**

**Location**: `lib/auth/session.ts`

**Issue**: While `httpOnly: true` is set, there's no verification that cookies are actually being sent with this flag.

**Current Code**:

```typescript
(await cookies()).set("session", encryptedSession, {
  expires: expiresInOneDay,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
});
```

**Impact**: If misconfigured, XSS could steal session tokens.

**Severity**: LOW (currently correct but worth monitoring)

**Fix Required**: Add runtime assertion in development:

```typescript
if (process.env.NODE_ENV === "development") {
  console.assert(
    process.env.NODE_ENV !== "production" || process.env.HTTPS === "true",
    "Session cookies must use secure flag in production"
  );
}
```

---

### 11. **XSS Risk in Blog Rendering**

**Location**: `app/blog/[slug]/page.tsx` and `app/blog/[slug]/ClientFallback.tsx`

**Issue**: Using `dangerouslySetInnerHTML` without DOMPurify or similar sanitization.

**Current Code**:

```tsx
dangerouslySetInnerHTML={{ __html: withItalic }}
```

**Impact**: If blog content is user-controlled or sourced from untrusted sources, XSS is possible.

**Severity**: MEDIUM (depends on content source)

**Fix Required**: Sanitize HTML before rendering:

```typescript
import DOMPurify from 'isomorphic-dompurify';

const sanitized = DOMPurify.sanitize(withItalic);
dangerouslySetInnerHTML={{ __html: sanitized }}
```

---

### 12. **Missing Session Expiration Check on Protected Routes**

**Location**: `lib/db/queries.ts`

**Issue**: Session expiration is checked in `getUser()`, but this needs to be consistently called on all protected routes.

**Current State**: Most routes call `getUser()` or `getSession()`, but consistency should be verified.

**Impact**: Expired sessions might gain access if not properly checked.

**Severity**: LOW (currently mitigated in most places)

**Fix Required**: Create a middleware to enforce session validation on all `/api/*` routes except public ones.

---

## Medium Severity Issues

### 13. **No Input Sanitization for LLM Prompts**

**Location**: `app/api/llm/chat/route.ts`

**Issue**: User input is directly passed to LLM without sanitization.

**Impact**: Prompt injection attacks could manipulate the LLM to ignore system instructions or leak other users' data.

**Severity**: MEDIUM

**Fix Required**: Implement prompt sanitization and context isolation.

---

### 14. **Missing API Response Size Limits**

**Location**: All API routes

**Issue**: No limits on response payload sizes.

**Impact**: Large memory dumps could cause DoS.

**Severity**: LOW-MEDIUM

**Fix Required**: Implement pagination on list endpoints and size limits on exports.

---

### 15. **No Logging of Security Events**

**Location**: Throughout application

**Issue**: Failed login attempts, IDOR attempts, etc. are not logged for security monitoring.

**Impact**: Impossible to detect ongoing attacks or audit security incidents.

**Severity**: MEDIUM

**Fix Required**: Implement security event logging:

- Failed login attempts
- Invalid token usage
- Unauthorized access attempts
- Unusual API usage patterns

---

## Recommended Implementation Priority

### Phase 1 (Immediate - Critical)

1. Fix IDOR vulnerability in memory endpoints
2. Implement rate limiting on authentication endpoints
3. Add security headers
4. Validate vector data before SQL operations

### Phase 2 (Short-term - High Priority)

5. Strengthen password requirements
6. Add input validation schemas for all API routes
7. Sanitize blog HTML rendering
8. Implement security event logging

### Phase 3 (Medium-term - Medium Priority)

9. Enhance CSRF protection
10. Add prompt injection protection for LLM
11. Implement API response size limits
12. Add monitoring and alerting for security events

## Migration Plan

### Step 1: IDOR Fix (Immediate)

- Update `app/api/memories/[id]/route.ts` to verify ownership
- Add integration tests for authorization

### Step 2: Rate Limiting (1-2 days)

- Install rate limiting library (e.g., `@upstash/ratelimit` or `express-rate-limit`)
- Add rate limiting middleware
- Configure limits per endpoint type
- Add rate limit headers to responses

### Step 3: Security Headers (1 day)

- Update `next.config.ts` with security headers
- Test CSP doesn't break functionality
- Adjust CSP as needed for third-party integrations

### Step 4: Input Validation (2-3 days)

- Create Zod schemas for all API request bodies
- Add validation middleware
- Update error handling

## Rollback Plan

Each change should be:

1. Feature-flagged where possible
2. Deployed to staging first
3. Monitored for errors
4. Rolled back if breaking changes detected

## Success Metrics

- Zero IDOR vulnerabilities in security scan
- Rate limiting active on all authentication endpoints
- All security headers present and valid (verified by securityheaders.com)
- 100% of API routes have input validation
- Security event logging captures all authentication failures

## Next Steps

1. Review and approve this ADR
2. Create GitHub issues for each vulnerability
3. Assign priorities and owners
4. Begin implementation in phases
5. Schedule follow-up security audit after Phase 2 completion

---

**Note**: This audit focused on application-layer security. Infrastructure security (network, firewall, DNS, etc.) and dependency vulnerabilities (npm audit) should be reviewed separately.
