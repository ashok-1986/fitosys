import { NextRequest, NextResponse } from "next/server";
import { apiRateLimit, authenticatedRateLimit } from "./rate-limit";

export async function withRateLimit(
    request: NextRequest,
    isAuthenticated: boolean,
    handler: () => Promise<NextResponse>
): Promise<NextResponse> {
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor?.split(",")[0].trim() ?? "127.0.0.1";
    const limiter = isAuthenticated ? authenticatedRateLimit : apiRateLimit;
    const { success, limit, remaining, reset } = await limiter.limit(ip);

    if (!success) {
        const retryAfter = Math.ceil((reset - Date.now()) / 1000);
        return NextResponse.json(
            { error: "Too many requests" },
            {
                status: 429,
                headers: {
                    "Retry-After": String(retryAfter),
                    "X-RateLimit-Limit": String(limit),
                    "X-RateLimit-Remaining": String(remaining),
                },
            }
        );
    }

    return handler();
}
