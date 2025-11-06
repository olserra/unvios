# Rate Limiting Implementation Guide

## Priority: CRITICAL - Implement ASAP

Rate limiting is the most critical missing security control. This guide provides step-by-step instructions for implementation.

---

## Option 1: Upstash Rate Limit (Recommended for Vercel)

### Installation

```bash
pnpm add @upstash/ratelimit @upstash/redis
```

### Setup Upstash Redis

1. Create account at https://upstash.com
2. Create a Redis database (free tier available)
3. Copy connection details to `.env`:

```env
UPSTASH_REDIS_REST_URL=https://your-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token-here
```

### Create Rate Limit Utility

**File:** `lib/ratelimit.ts`

```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Authentication endpoints - stricter limits
export const authRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "15 m"), // 5 requests per 15 minutes
  analytics: true,
  prefix: "@upstash/ratelimit/auth",
});

// LLM chat - moderate limits (costly operation)
export const chatRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(20, "1 m"), // 20 requests per minute
  analytics: true,
  prefix: "@upstash/ratelimit/chat",
});

// Memory creation - higher limits
export const memoryRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "1 h"), // 100 requests per hour
  analytics: true,
  prefix: "@upstash/ratelimit/memory",
});

// General API - default limits
export const apiRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, "1 m"), // 60 requests per minute
  analytics: true,
  prefix: "@upstash/ratelimit/api",
});

/**
 * Helper to check rate limit and return appropriate response
 */
export async function checkRateLimit(
  identifier: string,
  limiter: Ratelimit
): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
} | null> {
  try {
    const { success, limit, remaining, reset } = await limiter.limit(
      identifier
    );
    return { success, limit, remaining, reset };
  } catch (error) {
    console.error("Rate limit check failed:", error);
    // Fail open - allow request if rate limiting service is down
    return null;
  }
}
```

### Update Authentication Routes

**File:** `app/api/auth/login/route.ts`

```typescript
import { authRateLimit, checkRateLimit } from "@/lib/ratelimit";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // Get IP address for rate limiting
  const ip = req.ip ?? req.headers.get("x-forwarded-for") ?? "anonymous";

  // Check rate limit
  const rateLimitResult = await checkRateLimit(
    `auth:login:${ip}`,
    authRateLimit
  );

  if (rateLimitResult && !rateLimitResult.success) {
    return NextResponse.json(
      {
        error: "Too many login attempts. Please try again later.",
        retryAfter: rateLimitResult.reset,
      },
      {
        status: 429,
        headers: {
          "X-RateLimit-Limit": rateLimitResult.limit.toString(),
          "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
          "X-RateLimit-Reset": rateLimitResult.reset.toString(),
          "Retry-After": Math.ceil(
            (rateLimitResult.reset - Date.now()) / 1000
          ).toString(),
        },
      }
    );
  }

  // Add rate limit headers to successful responses too
  const headers: Record<string, string> = {};
  if (rateLimitResult) {
    headers["X-RateLimit-Limit"] = rateLimitResult.limit.toString();
    headers["X-RateLimit-Remaining"] = rateLimitResult.remaining.toString();
    headers["X-RateLimit-Reset"] = rateLimitResult.reset.toString();
  }

  // ... rest of login logic
  const form = await req.formData();
  // ... existing code
}
```

**File:** `app/api/auth/signup/route.ts`

```typescript
import { authRateLimit, checkRateLimit } from "@/lib/ratelimit";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const ip = req.ip ?? req.headers.get("x-forwarded-for") ?? "anonymous";

  // Stricter limit for signup (3 per hour)
  const rateLimitResult = await checkRateLimit(
    `auth:signup:${ip}`,
    authRateLimit
  );

  if (rateLimitResult && !rateLimitResult.success) {
    return NextResponse.json(
      {
        error: "Too many signup attempts. Please try again later.",
        retryAfter: rateLimitResult.reset,
      },
      { status: 429 }
    );
  }

  // ... rest of signup logic
}
```

### Update LLM Chat Route

**File:** `app/api/llm/chat/route.ts`

Add at the beginning of the POST function:

```typescript
import { chatRateLimit, checkRateLimit } from "@/lib/ratelimit";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session)
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    const user = await getUser();
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 401 });

    // Rate limit by user ID
    const rateLimitResult = await checkRateLimit(
      `chat:${user.id}`,
      chatRateLimit
    );

    if (rateLimitResult && !rateLimitResult.success) {
      return NextResponse.json(
        {
          error: "Too many chat requests. Please slow down.",
          retryAfter: rateLimitResult.reset
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": rateLimitResult.limit.toString(),
            "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
            "X-RateLimit-Reset": rateLimitResult.reset.toString(),
          }
        }
      );
    }

    // ... rest of chat logic
  }
}
```

### Update Memory Creation Route

**File:** `app/api/memories/route.ts`

Add at the beginning of the POST function:

```typescript
import { memoryRateLimit, checkRateLimit } from "@/lib/ratelimit";

export async function POST(req: Request) {
  try {
    const user = await getUser();
    if (!user)
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });

    // Rate limit by user ID
    const rateLimitResult = await checkRateLimit(
      `memory:create:${user.id}`,
      memoryRateLimit
    );

    if (rateLimitResult && !rateLimitResult.success) {
      return NextResponse.json(
        {
          error: "Too many memories created. Please slow down.",
          retryAfter: rateLimitResult.reset
        },
        { status: 429 }
      );
    }

    // ... rest of memory creation logic
  }
}
```

---

## Option 2: In-Memory Rate Limiting (Simple, No External Service)

If you prefer not to use an external service, you can implement simple in-memory rate limiting:

### Create Rate Limit Utility

**File:** `lib/ratelimit-simple.ts`

```typescript
import { LRUCache } from "lru-cache";

type RateLimitOptions = {
  interval: number; // milliseconds
  uniqueTokenPerInterval: number;
  maxRequests: number;
};

export class SimpleRateLimit {
  private cache: LRUCache<string, number[]>;
  private maxRequests: number;
  private interval: number;

  constructor(options: RateLimitOptions) {
    this.maxRequests = options.maxRequests;
    this.interval = options.interval;
    this.cache = new LRUCache({
      max: options.uniqueTokenPerInterval,
      ttl: options.interval,
    });
  }

  async limit(
    identifier: string
  ): Promise<{ success: boolean; reset: number }> {
    const now = Date.now();
    const timestamps = this.cache.get(identifier) || [];

    // Remove expired timestamps
    const validTimestamps = timestamps.filter(
      (timestamp) => now - timestamp < this.interval
    );

    if (validTimestamps.length >= this.maxRequests) {
      const oldestTimestamp = validTimestamps[0];
      const reset = oldestTimestamp + this.interval;
      return { success: false, reset };
    }

    validTimestamps.push(now);
    this.cache.set(identifier, validTimestamps);

    return {
      success: true,
      reset: now + this.interval,
    };
  }
}

// Create limiters
export const authLimiter = new SimpleRateLimit({
  interval: 15 * 60 * 1000, // 15 minutes
  uniqueTokenPerInterval: 500,
  maxRequests: 5,
});

export const chatLimiter = new SimpleRateLimit({
  interval: 60 * 1000, // 1 minute
  uniqueTokenPerInterval: 500,
  maxRequests: 20,
});

export const memoryLimiter = new SimpleRateLimit({
  interval: 60 * 60 * 1000, // 1 hour
  uniqueTokenPerInterval: 500,
  maxRequests: 100,
});
```

Install LRU Cache:

```bash
pnpm add lru-cache
```

Usage is similar to Option 1, but note:

- ⚠️ Rate limits are per-instance (won't work across serverless functions)
- ⚠️ Resets on deployment
- ⚠️ Memory usage grows with number of unique users
- ✅ No external dependencies
- ✅ Free
- ✅ Simple setup

---

## Testing Rate Limits

### Manual Testing Script

**File:** `scripts/test-rate-limit.ts`

```typescript
// Test authentication rate limit
async function testAuthRateLimit() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  console.log("Testing auth rate limit...");

  for (let i = 0; i < 7; i++) {
    const response = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        email: "test@example.com",
        password: "wrongpassword",
      }),
    });

    console.log(`Attempt ${i + 1}:`, response.status);

    if (response.status === 429) {
      const data = await response.json();
      console.log("Rate limited:", data);
      break;
    }
  }
}

testAuthRateLimit();
```

Run with:

```bash
npx tsx scripts/test-rate-limit.ts
```

### Expected Results

1. First 5 login attempts: 400 (invalid credentials)
2. 6th attempt: 429 (rate limited)
3. Response includes:
   - `X-RateLimit-Limit` header
   - `X-RateLimit-Remaining` header
   - `X-RateLimit-Reset` header
   - `Retry-After` header

---

## Monitoring & Alerting

### Log Rate Limit Events

```typescript
// In your rate limit check
if (!rateLimitResult.success) {
  console.warn("Rate limit exceeded", {
    identifier,
    endpoint: req.url,
    ip: req.ip,
    timestamp: new Date().toISOString(),
  });

  // Optional: Send to monitoring service
  // await sendToMonitoring({ ... });
}
```

### Metrics to Track

1. Number of rate limit violations per endpoint
2. Most rate-limited IPs/users
3. Peak request times
4. False positive rate (legitimate users being blocked)

---

## Rollout Strategy

### Phase 1: Monitoring Mode (Week 1)

- Implement rate limiting
- Log violations but don't block
- Monitor for false positives
- Adjust limits as needed

### Phase 2: Soft Limits (Week 2)

- Start blocking extreme violations
- Keep generous limits
- Monitor user complaints
- Fine-tune based on real usage

### Phase 3: Production Limits (Week 3+)

- Apply recommended limits
- Monitor continuously
- Provide user feedback for rate-limited requests
- Consider implementing rate limit bypass for premium users

---

## Configuration Recommendations

### Current Recommended Limits:

| Endpoint               | Limit | Window | Identifier |
| ---------------------- | ----- | ------ | ---------- |
| `/api/auth/login`      | 5     | 15 min | IP address |
| `/api/auth/signup`     | 3     | 1 hour | IP address |
| `/api/llm/chat`        | 20    | 1 min  | User ID    |
| `/api/memories` (POST) | 100   | 1 hour | User ID    |
| `/api/memories` (GET)  | 200   | 1 hour | User ID    |
| `/api/memories/[id]`   | 60    | 1 min  | User ID    |

### Adjust Based On:

- Actual user patterns
- LLM API costs
- Server capacity
- Business requirements

---

## Cost Considerations

### Upstash Pricing (as of 2025):

- Free tier: 10,000 commands/day
- Pay-as-you-go: $0.20 per 100,000 commands
- Expected cost for 1,000 active users: ~$5-10/month

### In-Memory Pricing:

- $0 (uses existing server resources)
- May increase serverless function memory/CPU costs slightly

---

## Next Steps After Implementation

1. ✅ Deploy rate limiting
2. ✅ Monitor for 1 week in logging mode
3. ✅ Analyze logs and adjust limits
4. ✅ Enable blocking
5. ✅ Add user-facing error messages
6. ✅ Consider premium tier with higher limits
7. ✅ Set up monitoring/alerting
8. ✅ Document rate limits in API documentation

---

For questions or issues, refer to:

- [Upstash Rate Limit Docs](https://upstash.com/docs/redis/sdks/ratelimit/overview)
- [Rate Limiting Best Practices](https://cloud.google.com/architecture/rate-limiting-strategies-techniques)
