import { NextRequest, NextResponse } from "next/server";
import { logRequest } from "@/lib/loggerHelpers";

// POST /api/cron/process-deletions — Process expired account deletions
// Runs daily at midnight UTC to permanently delete accounts past their 30-day grace period
export async function POST(request: NextRequest) {
    logRequest(request, "POST /api/cron/process-deletions");

    // Verify CRON secret
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { createServiceClient } = await import("@/lib/supabase/server");
    const supabase = await createServiceClient();

    try {
        // Call the database function to process expired deletions
        const { data, error } = await supabase.rpc("process_expired_deletions");

        if (error) {
            console.error("[Cron/Deletions] Database function error:", error);
            return NextResponse.json(
                { error: "Failed to process deletions" },
                { status: 500 }
            );
        }

        const deletedCount = data?.length || 0;

        // Log each deletion
        if (data && data.length > 0) {
            console.log(
                `[Cron/Deletions] Permanently deleted ${deletedCount} accounts:`,
                data.map((d: any) => d.deleted_email).join(", ")
            );

            // Log to audit table (optional - for compliance tracking)
            for (const deletion of data) {
                try {
                    await supabase.from("deletion_audit_log").insert({
                        coach_id: deletion.deleted_coach_id,
                        email: deletion.deleted_email,
                        deleted_at: new Date().toISOString(),
                        reason: "DPDP 2023 - 30-day grace period expired",
                    });
                } catch {
                    // Table may not exist yet - non-critical
                }
            }
        }

        console.log(`[Cron/Deletions] Complete: ${deletedCount} accounts deleted`);

        return NextResponse.json({
            success: true,
            deleted_count: deletedCount,
        });
    } catch (error) {
        console.error("[Cron/Deletions] Processing error:", error);
        return NextResponse.json(
            { error: "Failed to process deletions" },
            { status: 500 }
        );
    }
}
