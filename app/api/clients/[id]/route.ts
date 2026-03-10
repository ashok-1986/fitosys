import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedCoach } from "@/lib/auth";

// GET /api/clients/:id — Get single client with current enrollment
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { coachId, supabase, error } = await getAuthenticatedCoach();
    if (error) return error;

    const { id } = await params;

    const { data, error: dbError } = await supabase!
        .from("clients")
        .select("*")
        .eq("id", id)
        .eq("coach_id", coachId!)
        .single();

    if (dbError) {
        return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

// PUT /api/clients/:id — Update client details
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { coachId, supabase, error } = await getAuthenticatedCoach();
    if (error) return error;

    const { id } = await params;
    const body = await request.json();
    const allowed = [
        "full_name",
        "whatsapp_number",
        "email",
        "age",
        "primary_goal",
        "health_notes",
        "status",
    ];
    const updates: Record<string, unknown> = {};
    for (const key of allowed) {
        if (key in body) updates[key] = body[key];
    }

    const { data, error: dbError } = await supabase!
        .from("clients")
        .update(updates)
        .eq("id", id)
        .eq("coach_id", coachId!)
        .select()
        .single();

    if (dbError) {
        return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json(data);
}
