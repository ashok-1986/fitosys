import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { globalRateLimit } from "@/lib/middleware-rate-limit";

export async function middleware(request: NextRequest) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
        console.error("[middleware] CRITICAL: Supabase env vars missing");
        if (request.nextUrl.pathname.startsWith("/dashboard")) {
            const url = request.nextUrl.clone();
            url.pathname = "/login";
            return NextResponse.redirect(url);
        }
        return NextResponse.next();
    }

    // Apply global rate limiting to all /api routes (except those excluded in matcher)
    if (request.nextUrl.pathname.startsWith("/api") && globalRateLimit) {
        const ip = request.headers.get("x-forwarded-for") ?? "unknown";
        const { success } = await globalRateLimit.limit(ip);
        if (!success) {
            console.warn(`[middleware] Global API rate limit exceeded for IP: ${ip}`);
            return NextResponse.json(
                { error: "Too many requests" },
                { status: 429 }
            );
        }
    }

    let supabaseResponse = NextResponse.next({ request });

    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
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
    });

    const {
        data: { user },
    } = await supabase.auth.getUser();

    // Protected routes
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

    if (user && ["/", "/login", "/signup"].includes(request.nextUrl.pathname)) {
        const url = request.nextUrl.clone();
        url.pathname = "/dashboard";
        return NextResponse.redirect(url);
    }

    // Inject pathname for layout
    supabaseResponse.headers.set("x-pathname", request.nextUrl.pathname);

    return supabaseResponse;
}

export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|api/v1/public|api/v1/webhook|api/webhook|api/cron).*)",
    ],
};