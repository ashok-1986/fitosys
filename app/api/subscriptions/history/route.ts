import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedCoach } from "@/lib/auth";

// GET /api/subscriptions/history — Get all past subscription records for coach
export async function GET(request: NextRequest) {
    const { coachId, supabase, error } = await getAuthenticatedCoach();
    if (error) return error;

    try {
        const { data: subscriptions, error: subError } = await supabase
            .from("subscriptions")
            .select("id, plan, billing_cycle, amount_inr, status, started_at, current_period_start, current_period_end, cancelled_at, cancel_reason")
            .eq("coach_id", coachId)
            .order("created_at", { ascending: false });

        if (subError) {
            return NextResponse.json(
                { error: "Failed to fetch subscription history" },
                { status: 500 }
            );
        }

        return NextResponse.json({ subscriptions: subscriptions || [] });
    } catch (error) {
        console.error("[Subscriptions API] History error:", error);
        return NextResponse.json(
            { error: "Failed to fetch subscription history" },
            { status: 500 }
        );
    }
}
