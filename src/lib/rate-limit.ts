import { NextRequest, NextResponse } from "next/server";

// Simple in-memory rate limiter for serverless environments
// Resets on cold start (acceptable for MVP)
const rateLimitMap = new Map<
    string,
    { count: number; resetAt: number }
>();

const WINDOW_MS = 60 * 1000; // 1 minute window

interface RateLimitConfig {
    maxRequests: number; // max requests per window
    windowMs?: number; // window duration in ms (default: 60s)
}

/**
 * Check rate limit for a given key (IP or userId).
 * Returns { allowed: boolean, remaining: number, retryAfterMs?: number }
 */
export function checkRateLimit(
    key: string,
    config: RateLimitConfig
): {
    allowed: boolean;
    remaining: number;
    retryAfterMs?: number;
} {
    const window = config.windowMs || WINDOW_MS;
    const now = Date.now();

    const entry = rateLimitMap.get(key);

    if (!entry || now > entry.resetAt) {
        // New window
        rateLimitMap.set(key, { count: 1, resetAt: now + window });
        return { allowed: true, remaining: config.maxRequests - 1 };
    }

    if (entry.count >= config.maxRequests) {
        return {
            allowed: false,
            remaining: 0,
            retryAfterMs: entry.resetAt - now,
        };
    }

    entry.count++;
    return { allowed: true, remaining: config.maxRequests - entry.count };
}

/**
 * Return a 429 Too Many Requests response.
 */
export function rateLimitResponse(retryAfterMs?: number): NextResponse {
    return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        {
            status: 429,
            headers: retryAfterMs
                ? {
                    "Retry-After": Math.ceil(
                        retryAfterMs / 1000
                    ).toString(),
                }
                : undefined,
        }
    );
}

/**
 * Get the client IP from request headers.
 */
export function getClientIP(request: NextRequest): string {
    return (
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("x-real-ip") ||
        "unknown"
    );
}

// Periodically clean up expired entries (every 5 minutes)
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitMap) {
        if (now > entry.resetAt) {
            rateLimitMap.delete(key);
        }
    }
}, 5 * 60 * 1000);
