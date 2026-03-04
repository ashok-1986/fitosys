import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedCoach } from "@/lib/auth";

// GET /api/enrollments — List active enrollments with client and program data
export async function GET(request: NextRequest) {
    const { coachId, supabase, error } = await getAuthenticatedCoach();
    if (error) return error;

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "active";

    let query = supabase!
        .from("enrollments")
        .select("*, clients(full_name, email, whatsapp_number), programs(name, duration_weeks)")
        .eq("coach_id", coachId!)
        .order("end_date", { ascending: true });

    if (status !== "all") {
        query = query.eq("status", status);
    }

    const { data, error: dbError } = await query;

    if (dbError) {
        return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json(data);
}
