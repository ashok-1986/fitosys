import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export async function GET(request: Request) {
    // Basic auth check for cron
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // In a real system, we might query a "secrets_metadata" table to check when keys were last rotated.
    // For this MVP, we simply emit a structured log that Axiom can use to trigger a Slack/email alert
    // whenever this cron runs (e.g. scheduled every 90 days in vercel.json).

    logger.info({
        event: "security_reminder",
        type: "key_rotation",
        action_required: true,
        keys_to_rotate: [
            "ENCRYPTION_KEY",
            "SUPABASE_JWT_SECRET",
            "RAZORPAY_WEBHOOK_SECRET"
        ],
        priority: "high"
    }, "CRITICAL REMINDER: 90-day rotation required for core security secrets. Please rotate keys in Vercel and Supabase dashboards.");

    return NextResponse.json({ success: true, message: "Security rotation reminder logged" });
}
