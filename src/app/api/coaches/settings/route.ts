import { NextResponse } from "next/server";
import { getAuthenticatedCoach } from "@/lib/auth";

// PUT /api/coaches/settings — Update check-in day, time, timezone
export async function PUT(request: Request) {
    const { coachId, supabase, error } = await getAuthenticatedCoach();
    if (error) return error;

    const body = await request.json();
    const allowed = ["checkin_day", "checkin_time", "timezone"];
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() };
    for (const key of allowed) {
        if (key in body) updates[key] = body[key];
    }

    const { data, error: dbError } = await supabase!
        .from("coaches")
        .update(updates)
        .eq("id", coachId!)
        .select()
        .single();

    if (dbError) {
        return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json(data);
}
