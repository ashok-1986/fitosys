import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
    // Basic auth check for cron
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
        logger.error({ event: "cron_failure", reason: "missing_env_vars" }, "Missing Supabase env vars for retention cron");
        return NextResponse.json({ error: "Configuration error" }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Calculate 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const cutoffDate = thirtyDaysAgo.toISOString();

    // Delete logs older than 30 days
    const { data, error, count } = await supabase
        .from("whatsapp_log")
        .delete({ count: "exact" })
        .lt("sent_at", cutoffDate);

    if (error) {
        logger.error({ event: "retention_failure", reason: error.message }, "Failed to delete old WhatsApp logs");
        return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    logger.info({
        event: "retention_success",
        type: "whatsapp_log_cleanup",
        deleted_count: count ?? 0,
        cutoff_date: cutoffDate
    }, `Successfully deleted ${count ?? 0} WhatsApp logs older than 30 days`);

    return NextResponse.json({ success: true, deleted_count: count ?? 0 });
}
