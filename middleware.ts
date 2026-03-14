import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { apiRateLimit, authenticatedRateLimit } from "@/lib/rate-limit";

export async function middleware(request: NextRequest) {
    // Guard: block access if Supabase env vars are not configured
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseAnonKey) {
        console.error("[middleware] CRITICAL: Supabase env vars missing — blocking access");
        if (request.nextUrl.pathname.startsWith("/dashboard")) {
            const url = request.nextUrl.clone();
            url.pathname = "/login";
            return NextResponse.redirect(url);
        }
        return NextResponse.next();
    }

    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(
        supabaseUrl,
        supabaseAnonKey,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll();
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value }) =>
                        request.cookies.set(name, value)
                    );
                    supabaseResponse = NextResponse.next({ request });
                    cookiesToSet.forEach(({ name, value, options }) =>
                        supabaseResponse.cookies.set(name, value, options)
                    );
                },
            },
        }
    );

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Add rate limiting for API routes
    if (request.nextUrl.pathname.startsWith("/api/")) {
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
                "X-RateLimit-Limit": user ? "300" : "100",
                "X-RateLimit-Remaining": String(remaining),
            }
            }
        );
        }

        // Add rate limit headers to response
        const response = NextResponse.next();
        response.headers.set("X-RateLimit-Limit", user ? "300" : "100");
        response.headers.set("X-RateLimit-Remaining", String(remaining));
        return response;
    }


    // Protected routes — redirect to login if unauthenticated
    const protectedPaths = [
        "/dashboard",
        "/clients",
        "/programs",
        "/pulse",
        "/payments",
        "/settings",
    ];
    const isProtected = protectedPaths.some((p) =>
        request.nextUrl.pathname.startsWith(p)
    );

    if (isProtected && !user) {
        const url = request.nextUrl.clone();
        url.pathname = "/login";
        return NextResponse.redirect(url);
    }

    // Redirect authenticated users away from auth pages
    if (user && ["/login", "/signup"].includes(request.nextUrl.pathname)) {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
    }

    return supabaseResponse;
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|api/v1/public|api/v1/webhook).*)",
    ],
};
