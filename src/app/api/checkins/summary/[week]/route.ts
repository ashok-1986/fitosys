import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedCoach } from "@/lib/auth";

// GET /api/checkins/summary/:week — Get AI summary for a given week
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ week: string }> }
) {
    const { coachId, supabase, error } = await getAuthenticatedCoach();
    if (error) return error;

    const { week } = await params; // YYYY-MM-DD format (week start date)

    const weekStart = new Date(week);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const { data, error: dbError } = await supabase!
        .from("ai_summaries")
        .select("*")
        .eq("coach_id", coachId!)
        .gte("week_start_date", weekStart.toISOString().split("T")[0])
        .lte("week_end_date", weekEnd.toISOString().split("T")[0])
        .order("generated_at", { ascending: false })
        .limit(1)
        .maybeSingle();

    if (dbError) {
        return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    if (!data) {
        return NextResponse.json(
            { error: "No summary found for this week" },
            { status: 404 }
        );
    }

    return NextResponse.json(data);
}
