# Rate Limiting Implementation

Date: 2025-11-09

Status: Proposed

## Context

Rate limiting is the most critical missing security control in the Unvios application. Without rate limiting, the application is vulnerable to:

- **Brute force attacks** on authentication endpoints (`/api/auth/login`, `/api/auth/signup`)
- **Denial of Service (DoS)** attacks through excessive API calls
- **Cost exhaustion** from unlimited LLM API calls
- **Resource abuse** through memory creation spam

Current state: No rate limiting is implemented on any API endpoints. This represents a CRITICAL security vulnerability that must be addressed immediately.

## Decision

Implement rate limiting using **Upstash Rate Limit** with Redis as the backend storage. This solution is chosen for Vercel deployments and provides distributed rate limiting across serverless functions.

**Files to be created/modified:**

1. **Create** `lib/ratelimit.ts` - Rate limiting utility with pre-configured limiters
2. **Modify** `app/api/auth/login/route.ts` - Add rate limiting (5 requests per 15 minutes per IP)
3. **Modify** `app/api/auth/signup/route.ts` - Add rate limiting (3 requests per hour per IP)
4. **Modify** `app/api/llm/chat/route.ts` - Add rate limiting (20 requests per minute per user)
5. **Modify** `app/api/memories/route.ts` - Add rate limiting (100 requests per hour per user)
6. **Update** `.env` - Add Upstash Redis credentials

**Rate limit configuration:**

| Endpoint               | Limit | Window | Identifier |
| ---------------------- | ----- | ------ | ---------- |
| `/api/auth/login`      | 5     | 15 min | IP address |
| `/api/auth/signup`     | 3     | 1 hour | IP address |
| `/api/llm/chat`        | 20    | 1 min  | User ID    |
| `/api/memories` (POST) | 100   | 1 hour | User ID    |

## Rationale

### Why Upstash Rate Limit?

**Advantages:**

- **Distributed state**: Works across Vercel's serverless functions
- **Low latency**: Edge-optimized Redis with <10ms response times
- **Analytics built-in**: Track rate limit violations automatically
- **Generous free tier**: 10,000 commands/day included
- **Fail-open design**: If Redis is unavailable, requests proceed (availability over strict security)
- **Developer-friendly**: Simple SDK with TypeScript support

**Alternatives considered and rejected:**

1. **In-memory rate limiting (LRU Cache)**

   - ❌ Does not work across serverless instances
   - ❌ Resets on every deployment
   - ❌ Limited scalability
   - ✅ Would be acceptable for single-server deployments

2. **express-rate-limit**

   - ❌ Designed for Express.js, not Next.js
   - ❌ Requires custom server setup
   - ❌ Not compatible with Vercel serverless

3. **Vercel Edge Config**

   - ❌ Read-only at runtime
   - ❌ Cannot store dynamic rate limit counters
   - ❌ Not designed for this use case

4. **Custom Redis implementation**
   - ❌ More complex to implement correctly
   - ❌ No built-in analytics
   - ✅ Would work but reinvents the wheel

### Security considerations

- **IP-based limiting** for authentication prevents distributed brute force
- **User-based limiting** for authenticated endpoints prevents single-user abuse
- **Fail-open strategy** ensures availability even if Redis is down
- **Rate limit headers** inform clients about their limits (`X-RateLimit-*`)
- **Graceful error messages** guide users on retry timing

### Cost analysis

- **Free tier**: 10,000 commands/day (sufficient for ~500 daily active users)
- **Paid tier**: $0.20 per 100,000 commands (~$5-10/month for 1,000 active users)
- **LLM cost protection**: Preventing abuse saves significantly more than rate limiting costs

## Migration / Rollback

### Implementation steps

1. **Setup Upstash Redis**

   ```bash
   # Create account at https://upstash.com
   # Create Redis database (free tier)
   # Copy credentials to .env
   ```

2. **Install dependencies**

   ```bash
   pnpm add @upstash/ratelimit @upstash/redis
   ```

3. **Create rate limiting utility** (`lib/ratelimit.ts`)

   - Configure four rate limiters (auth, chat, memory, general API)
   - Implement `checkRateLimit` helper function
   - Add proper error handling and logging

4. **Update API routes** (see Decision section for files)

   - Add rate limit check at start of handler
   - Return 429 status with retry information
   - Include rate limit headers in all responses

5. **Environment variables**
   ```env
   UPSTASH_REDIS_REST_URL=https://your-url.upstash.io
   UPSTASH_REDIS_REST_TOKEN=your-token-here
   ```

### Rollout strategy

**Phase 1: Monitoring Mode (Week 1)**

- Implement rate limiting but log violations without blocking
- Monitor for false positives
- Adjust limits based on real usage patterns

**Phase 2: Soft Limits (Week 2)**

- Enable blocking for extreme violations (10x over limit)
- Keep generous limits
- Monitor user feedback

**Phase 3: Production Limits (Week 3+)**

- Apply recommended limits
- Monitor continuously
- Fine-tune based on operational data

### Rollback procedure

If rate limiting causes issues:

1. **Quick rollback**: Set environment variable `DISABLE_RATE_LIMIT=1` and check in rate limit functions
2. **Code rollback**: Remove rate limit checks from API routes (simple reversal)
3. **Monitoring**: Track metrics before/after to identify legitimate vs abuse traffic

## How to verify

### Automated testing

Create `scripts/test-rate-limit.ts`:

```typescript
async function testAuthRateLimit() {
  for (let i = 0; i < 7; i++) {
    const response = await fetch("http://localhost:3000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        email: "test@example.com",
        password: "wrongpassword",
      }),
    });
    console.log(`Attempt ${i + 1}: ${response.status}`);
  }
}
```

**Expected results:**

- Attempts 1-5: Status 400 (invalid credentials)
- Attempt 6: Status 429 (rate limited)
- Response includes headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

### Manual testing

1. **Login endpoint**: Try 6 login attempts from same IP - 6th should be blocked
2. **Chat endpoint**: Send 21 messages rapidly - 21st should be blocked
3. **Memory creation**: Create 101 memories in quick succession - 101st should be blocked
4. **Headers verification**: Check that all responses include rate limit headers

### Monitoring

- Track rate limit violations in application logs
- Monitor Upstash dashboard for command usage
- Set up alerts for unusual rate limit patterns
- Track user complaints about false positives

## Next steps

### Immediate (after implementation)

1. ✅ Deploy to staging environment
2. ✅ Run automated tests
3. ✅ Monitor for 1 week in logging mode
4. ✅ Analyze logs and adjust limits if needed

### Short-term (2-4 weeks)

5. ✅ Enable blocking in production
6. ✅ Add user-facing documentation about rate limits
7. ✅ Implement monitoring/alerting for rate limit violations
8. ✅ Add rate limit bypass for premium users (if applicable)

### Medium-term (1-3 months)

9. Consider implementing per-tier rate limits (free vs paid users)
10. Add rate limit dashboard for users to see their usage
11. Implement exponential backoff recommendations in error messages
12. Review and adjust limits based on 30 days of operational data

### Future enhancements

- **Adaptive rate limiting**: Automatically adjust limits based on system load
- **User reputation**: Lower limits for new accounts, higher for established users
- **Geographic rate limiting**: Different limits for different regions based on abuse patterns
- **Rate limit quotas**: Monthly/daily quotas in addition to per-minute limits

---

**References:**

- [Upstash Rate Limit Documentation](https://upstash.com/docs/redis/sdks/ratelimit/overview)
- [OWASP Rate Limiting Best Practices](https://owasp.org/www-community/controls/Blocking_Brute_Force_Attacks)
- [Rate Limiting Strategies](https://cloud.google.com/architecture/rate-limiting-strategies-techniques)
