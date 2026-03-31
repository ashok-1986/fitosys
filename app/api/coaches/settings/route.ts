import { NextResponse } from "next/server";
import { getAuthenticatedCoach } from "@/lib/auth";

export async function GET(request: Request) {
    const { coachId, supabase, error } = await getAuthenticatedCoach();
    if (error) return error;

    const { data, error: dbError } = await supabase!
        .from("coaches")
        .select(`id, full_name, whatsapp_number, country_code, timezone, coaching_type, checkin_day, checkin_time, slug, status, upi_id, payment_instructions, accepted_payment_methods, city`)
        .eq("id", coachId!)
        .single();

    if (dbError || !data) {
        return NextResponse.json({ error: dbError?.message || "Not found" }, { status: 404 });
    }

    return NextResponse.json(data);
}

export async function PUT(request: Request) {
    const { coachId, supabase, error } = await getAuthenticatedCoach();
    if (error) return error;

    const body = await request.json();
    const allowed = [
        "full_name",
        "whatsapp_number",
        "city",
        "coaching_type",
        "checkin_day",
        "checkin_time",
        "timezone",
        "upi_id",
        "payment_instructions",
        "accepted_payment_methods"
    ];

    if (body.full_name !== undefined && typeof body.full_name === "string" && body.full_name.length < 2) {
        return NextResponse.json({ error: "Full name must be at least 2 characters" }, { status: 400 });
    }

    if (body.upi_id !== undefined && typeof body.upi_id === "string" && body.upi_id.length > 50) {
        return NextResponse.json({ error: "UPI ID must not exceed 50 characters" }, { status: 400 });
    }

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
