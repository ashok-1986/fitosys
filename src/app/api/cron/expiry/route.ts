import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// POST /api/cron/expiry — Daily enrollment expiry handler
// Moves expired enrollments to inactive, updates client status, flags for churn logging
export async function POST(request: NextRequest) {
    // Verify cron secret
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Use service role client to bypass RLS
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!supabaseUrl || !serviceKey) {
        return NextResponse.json(
            { error: "Supabase not configured" },
            { status: 500 }
        );
    }

    const supabase = createClient(supabaseUrl, serviceKey);
    const today = new Date().toISOString().split("T")[0];

    // Find expired enrollments: end_date < today AND status = 'active'
    const { data: expiredEnrollments, error: queryError } = await supabase
        .from("enrollments")
        .select("id, client_id, coach_id, end_date, program_id")
        .eq("status", "active")
        .lt("end_date", today);

    if (queryError) {
        console.error("Failed to query expired enrollments:", queryError);
        return NextResponse.json(
            { error: queryError.message },
            { status: 500 }
        );
    }

    if (!expiredEnrollments || expiredEnrollments.length === 0) {
        return NextResponse.json({
            message: "No expired enrollments found",
            expired: 0,
        });
    }

    let expiredCount = 0;

    for (const enrollment of expiredEnrollments) {
        // Check if a payment was made in the last 3 days (grace period)
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

        const { data: recentPayment } = await supabase
            .from("payments")
            .select("id")
            .eq("client_id", enrollment.client_id)
            .eq("coach_id", enrollment.coach_id)
            .gte("paid_at", threeDaysAgo.toISOString())
            .maybeSingle();

        if (recentPayment) {
            // Grace period — payment exists within 3 days, skip
            continue;
        }

        // Expire the enrollment
        const { error: updateError } = await supabase
            .from("enrollments")
            .update({
                status: "expired",
                churn_reason: "pending_input", // Flag for coach to fill in
            })
            .eq("id", enrollment.id);

        if (updateError) {
            console.error(
                `Failed to expire enrollment ${enrollment.id}:`,
                updateError
            );
            continue;
        }

        // Check if client has any other active enrollments
        const { data: otherActive } = await supabase
            .from("enrollments")
            .select("id")
            .eq("client_id", enrollment.client_id)
            .eq("status", "active")
            .neq("id", enrollment.id)
            .maybeSingle();

        // If no other active enrollments, set client to inactive
        if (!otherActive) {
            await supabase
                .from("clients")
                .update({ status: "inactive" })
                .eq("id", enrollment.client_id);
        }

        expiredCount++;
    }

    return NextResponse.json({
        message: `Expired ${expiredCount} enrollments`,
        expired: expiredCount,
        checked: expiredEnrollments.length,
    });
}
