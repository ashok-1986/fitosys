import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Only create Redis client if token exists (so build doesn't fail if missing)
const redis = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN 
  ? new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    })
  : null;

// Global backstop rate limit: 100 requests per 10 seconds per IP
export const globalRateLimit = redis 
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(100, "10 s"),
      analytics: true,
      prefix: "@upstash/ratelimit/global",
    })
  : null;
