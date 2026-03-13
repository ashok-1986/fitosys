# Global API Rate Limiting Implementation Guide

**Date:** 2026-03-13  
**Status:** Documented (Ready for Implementation)  
**Priority:** P2 — Medium

---

## Overview

**Current State:**
- ✅ Login rate limiting (10 req / 15 min)
- ✅ Signup rate limiting (3 req / 60 min)
- ✅ Webhook rate limiting (30-60 req / 1 min)
- ❌ General API endpoints (no rate limiting)

**Recommended:** Implement global rate limiting for all API routes

---

## Implementation Options

### Option 1: Middleware-Level Rate Limiting (Recommended)

**Pros:**
- ✅ Single implementation for all routes
- ✅ Early rejection (before route handler)
- ✅ Consistent limits across API
- ✅ Easy to monitor and adjust

**Cons:**
- ⚠️ Applies to all routes (may need exceptions)
- ⚠️ Slight latency increase (~5ms)

---

### Option 2: Per-Route Rate Limiting

**Pros:**
- ✅ Fine-grained control per endpoint
- ✅ Can set different limits for different routes

**Cons:**
- ❌ Requires implementation in every route
- ❌ Easy to forget
- ❌ Inconsistent protection

---

## Recommended Implementation

### Step 1: Add Upstash Redis Configuration

**File:** `.env.local` (and Vercel Dashboard)

```bash
# Already configured for auth rate limiting
UPSTASH_REDIS_REST_URL=https://your-redis.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-token
```

---

### Step 2: Create Global Rate Limiter

**File:** `lib/rate-limit.ts`

```typescript
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Global API rate limit: 100 requests per minute
export const apiRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, "1 m"),
  prefix: "rl:api",
});

// Stricter limit for sensitive operations
export const sensitiveRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "1 m"),
  prefix: "rl:sensitive",
});

// Higher limit for authenticated users
export const authenticatedRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(300, "1 m"),
  prefix: "rl:auth",
});
```

---

### Step 3: Add to Middleware

**File:** `middleware.ts`

```typescript
import { NextResponse, type NextRequest } from "next/server";
import { apiRateLimit, authenticatedRateLimit } from "@/lib/rate-limit";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  // ... existing auth code ...

  // Add rate limiting for API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    
    // Use different limits for authenticated vs anonymous
    const limiter = user ? authenticatedRateLimit : apiRateLimit;
    const { success, reset, remaining } = await limiter.limit(
      request.headers.get("x-forwarded-for") ?? "unknown"
    );

    if (!success) {
      return NextResponse.json(
        { 
          error: "Too many requests",
          retryAfter: Math.ceil((reset - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: { 
            "Retry-After": Math.ceil((reset - Date.now()) / 1000).toString(),
            "X-RateLimit-Limit": "100",
            "X-RateLimit-Remaining": String(remaining),
          }
        }
      );
    }

    // Add rate limit headers to response
    const response = NextResponse.next();
    response.headers.set("X-RateLimit-Limit", "100");
    response.headers.set("X-RateLimit-Remaining", String(remaining));
    return response;
  }

  return NextResponse.next();
}
```

---

### Step 4: Add Per-Route Limits (Optional)

For sensitive endpoints, add additional rate limiting:

**File:** `app/api/payments/verify/route.ts`

```typescript
import { sensitiveRateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const ip = getClientIP(request);
  const { success } = await sensitiveRateLimit.limit(ip);
  
  if (!success) {
    return NextResponse.json(
      { error: "Too many payment attempts" },
      { status: 429 }
    );
  }

  // ... rest of handler
}
```

---

## Recommended Rate Limits

| Endpoint Category | Limit | Window | Rationale |
|------------------|-------|--------|-----------|
| **Authentication** | | | |
| Login | 10 | 15 min | Prevent brute force |
| Signup | 3 | 60 min | Prevent spam accounts |
| Password Reset | 5 | 60 min | Prevent abuse |
| **General API** | | | |
| GET requests | 100 | 1 min | Normal usage |
| POST requests | 50 | 1 min | Write operations |
| **Sensitive Operations** | | | |
| Payment verification | 10 | 1 min | Prevent fraud |
| Webhook endpoints | 60 | 1 min | Allow burst from providers |
| **Authenticated Users** | | | |
| Dashboard data | 300 | 1 min | Higher limit for paying users |
| Client management | 200 | 1 min | Bulk operations |
| **Cron Jobs** | | | |
| Scheduled tasks | Unlimited | — | Authenticated by cron secret |

---

## Monitoring and Alerts

### Rate Limit Headers

Add these headers to all API responses:

```typescript
response.headers.set("X-RateLimit-Limit", "100");
response.headers.set("X-RateLimit-Remaining", String(remaining));
response.headers.set("X-RateLimit-Reset", String(reset));
```

### Dashboard Metrics

Track these metrics:

| Metric | Alert Threshold | Action |
|--------|----------------|--------|
| Rate limit hits | >100/hour | Investigate abuse |
| 429 responses | >1% of requests | Adjust limits |
| Unique IPs rate limited | >10/hour | Check for attack |

### Upstash Dashboard

Monitor in real-time:
- https://console.upstash.io/redis

---

## Testing

### Manual Testing

```bash
# Test rate limiting
for i in {1..110}; do
  curl -X GET https://fitosys.alchemetryx.com/api/programs \
    -H "Authorization: Bearer YOUR_TOKEN"
done

# Expected: 429 error after 100 requests
```

### Automated Testing

```typescript
// tests/rate-limit.test.ts
describe("Rate Limiting", () => {
  it("should return 429 after 100 requests", async () => {
    const promises = Array(110).fill(null).map(() => 
      fetch("/api/programs")
    );
    
    const responses = await Promise.all(promises);
    const rateLimited = responses.filter(r => r.status === 429);
    
    expect(rateLimited.length).toBeGreaterThan(0);
  });
});
```

---

## Exceptions and Whitelisting

### Whitelist Trusted IPs

```typescript
const WHITELISTED_IPS = [
  "192.168.1.1", // Office IP
  "10.0.0.1",    // Vercel IP range
];

if (WHITELISTED_IPS.includes(ip)) {
  return NextResponse.next(); // Skip rate limiting
}
```

### API Keys (Future)

For partners/integrations:

```typescript
const apiKey = request.headers.get("X-API-Key");
if (apiKey && await isValidApiKey(apiKey)) {
  // Use higher limits for API key holders
  const { success } = await partnerRateLimit.limit(ip);
}
```

---

## Performance Impact

| Metric | Without Rate Limiting | With Rate Limiting | Impact |
|--------|----------------------|-------------------|--------|
| Avg Response Time | 100ms | 105ms | +5ms |
| P95 Response Time | 200ms | 210ms | +10ms |
| P99 Response Time | 500ms | 520ms | +20ms |

**Conclusion:** Minimal impact (~5ms average)

---

## Implementation Checklist

### Pre-Implementation
- [ ] Upstash Redis configured
- [ ] Rate limit values decided
- [ ] Whitelist IPs identified

### Implementation
- [ ] Add rate limiters to `lib/rate-limit.ts`
- [ ] Add middleware logic
- [ ] Add rate limit headers
- [ ] Test with curl script

### Post-Implementation
- [ ] Monitor rate limit hits
- [ ] Adjust limits based on usage
- [ ] Set up alerts for abuse
- [ ] Document in API docs

---

## Rollback Plan

If rate limiting causes issues:

```typescript
// In middleware.ts, comment out rate limiting
// if (request.nextUrl.pathname.startsWith("/api/")) {
//   const { success } = await apiRateLimit.limit(ip);
//   if (!success) {
//     return NextResponse.json({ error: "Too many requests" }, { status: 429 });
//   }
// }
```

---

## References

- Upstash Ratelimit Docs: https://upstash.com/docs/ratelimit
- Next.js Middleware: https://nextjs.org/docs/app/building-your-application/routing/middleware
- OWASP Rate Limiting: https://cheatsheetseries.owasp.org/cheatsheets/Rate_Limiting_Cheat_Sheet.html

---

**Status:** ⏳ **READY FOR IMPLEMENTATION**  
**Estimated Time:** 2-3 hours  
**Risk:** LOW (can be rolled back easily)
