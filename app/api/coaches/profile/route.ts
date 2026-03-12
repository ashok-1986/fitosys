import { NextResponse } from "next/server";
import { getAuthenticatedCoach } from "@/lib/auth";

// GET /api/coaches/profile — Get current coach profile
export async function GET() {
    const { coachId, supabase, error } = await getAuthenticatedCoach();
    if (error) return error;

    const { data, error: dbError } = await supabase!
        .from("coaches")
        .select("*")
        .eq("id", coachId!)
        .single();

    if (dbError) {
        return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

// PUT /api/coaches/profile — Update coach profile
export async function PUT(request: Request) {
    const { coachId, supabase, error } = await getAuthenticatedCoach();
    if (error) return error;

    const body = await request.json();
    const allowed = [
        "full_name",
        "email",
        "whatsapp_number",
        "country_code",
        "timezone",
        "coaching_type",
        "business_name",
        "gst_number",
        "billing_address",
        "checkin_day",
        "checkin_time",
    ];
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
