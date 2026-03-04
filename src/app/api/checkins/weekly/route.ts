import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedCoach } from "@/lib/auth";

// GET /api/checkins/weekly — Get all check-ins for current week
export async function GET(request: NextRequest) {
    const { coachId, supabase, error } = await getAuthenticatedCoach();
    if (error) return error;

    const { searchParams } = new URL(request.url);
    const weekParam = searchParams.get("week"); // optional: YYYY-MM-DD

    // Calculate week range
    const now = new Date();
    let weekStart: Date;
    if (weekParam) {
        weekStart = new Date(weekParam);
    } else {
        // Current week starting Sunday
        const day = now.getDay();
        weekStart = new Date(now);
        weekStart.setDate(now.getDate() - day);
    }
    weekStart.setHours(0, 0, 0, 0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const { data, error: dbError } = await supabase!
        .from("checkins")
        .select("*, clients(full_name, whatsapp_number)")
        .eq("coach_id", coachId!)
        .gte("check_date", weekStart.toISOString().split("T")[0])
        .lte("check_date", weekEnd.toISOString().split("T")[0])
        .order("check_date", { ascending: false });

    if (dbError) {
        return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json(data);
}
