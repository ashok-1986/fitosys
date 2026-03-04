import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const code = searchParams.get("code");
    const next = searchParams.get("next") ?? "/dashboard";

    if (code) {
        const supabase = await createClient();
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (!error && data.user) {
            // Check if coach profile exists
            const { data: coachProfile } = await supabase
                .from("coaches")
                .select("id")
                .eq("id", data.user.id)
                .single();

            // If it's a completely new signup via Google, create the coach record
            if (!coachProfile) {
                const fullName =
                    data.user.user_metadata.full_name ||
                    data.user.email?.split("@")[0] ||
                    "Coach";

                const slugBase = fullName
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, "-")
                    .replace(/^-|-$/g, "");

                // Add short id to ensure generic names don't collide
                const slug = `${slugBase}-${Math.random().toString(36).substring(2, 6)}`;

                const { error: insertError } = await supabase.from("coaches").insert({
                    id: data.user.id,
                    email: data.user.email!,
                    full_name: fullName,
                    whatsapp_number: "PENDING_SETUP", // Empty placeholder since OAuth doesn't give phone
                    country_code: "IN",
                    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                    coaching_type: ["fitness"],
                    plan: "trial",
                    checkin_day: 0,
                    checkin_time: "19:00",
                    slug,
                    status: "active",
                });

                if (insertError) {
                    console.error("[OAuth Callback] Failed to create coach profile:", insertError);
                }
            }

            const forwardedHost = request.headers.get("x-forwarded-host");
            const isLocalEnv = process.env.NODE_ENV === "development";

            if (isLocalEnv) {
                // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
                return NextResponse.redirect(`${origin}${next}`);
            } else if (forwardedHost) {
                return NextResponse.redirect(`https://${forwardedHost}${next}`);
            } else {
                return NextResponse.redirect(`${origin}${next}`);
            }
        } else {
            console.error("[OAuth Callback] Error exchanging code:", error?.message);
        }
    }

    // return the user to an error page with some instructions
    return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
}
