import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// 5 requests per 10 minutes — intake form
export const intakeRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "10 m"),
  prefix: "rl:intake",
});

// 10 requests per 15 minutes — login
export const loginRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "15 m"),
  prefix: "rl:login",
});

// 3 requests per 60 minutes — signup
export const signupRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(3, "60 m"),
  prefix: "rl:signup",
});

// 30 requests per 1 minute — razorpay webhook
export const razorpayWebhookRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(30, "1 m"),
  prefix: "rl:razorpay",
});

// 60 requests per 1 minute — whatsapp webhook
export const whatsappWebhookRateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(60, "1 m"),
  prefix: "rl:whatsapp",
});

// Generic helpers for routes
import { NextRequest, NextResponse } from "next/server";

export function getClientIP(req: NextRequest): string {
  // trust x-forwarded-for header when present, otherwise fallback
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    // @ts-ignore
    req.ip ||
    "unknown"
  );
}

export async function checkRateLimit(
  key: string,
  options: { maxRequests: number } = { maxRequests: 60 }
): Promise<{ allowed: boolean; retryAfterMs: number }> {
  const limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(options.maxRequests, "1 m"),
  });
  const { success, reset } = await limiter.limit(key);
  return { allowed: success, retryAfterMs: reset ?? 0 };
}

export function rateLimitResponse(retryAfterMs: number) {
  return NextResponse.json(
    { error: "Too many requests" },
    {
      status: 429,
      headers: { "Retry-After": Math.ceil(retryAfterMs / 1000).toString() },
    }
  );
}

