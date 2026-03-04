import { NextResponse } from "next/server";
import { getAuthenticatedCoach } from "@/lib/auth";

// GET /api/enrollments/expiring — Enrollments expiring in next 7 days
export async function GET() {
    const { coachId, supabase, error } = await getAuthenticatedCoach();
    if (error) return error;

    const today = new Date().toISOString().split("T")[0];
    const weekFromNow = new Date(
        Date.now() + 7 * 24 * 60 * 60 * 1000
    ).toISOString().split("T")[0];

    const { data, error: dbError } = await supabase!
        .from("enrollments")
        .select("*, clients(full_name, whatsapp_number), programs(name, duration_weeks, price, currency)")
        .eq("coach_id", coachId!)
        .eq("status", "active")
        .gte("end_date", today)
        .lte("end_date", weekFromNow)
        .order("end_date", { ascending: true });

    if (dbError) {
        return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json(data);
}
