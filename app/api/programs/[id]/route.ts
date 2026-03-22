import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedCoach } from "@/lib/auth";

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { coachId, supabase, error } = await getAuthenticatedCoach();
    if (error) return error;

    const { id } = await params;
    const body = await req.json();

    const { data, error: dbError } = await supabase!
        .from("programs")
        .update(body)
        .eq("id", id)
        .eq("coach_id", coachId!)
        .select()
        .single();

    if (dbError) {
        return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

export async function DELETE(
    _req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { coachId, supabase, error } = await getAuthenticatedCoach();
    if (error) return error;

    const { id } = await params;

    const { error: dbError } = await supabase!
        .from("programs")
        .update({ is_active: false })
        .eq("id", id)
        .eq("coach_id", coachId!);

    if (dbError) {
        return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
