import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedCoach } from "@/lib/auth";

// PUT /api/enrollments/:id/churn — Log churn reason
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { coachId, supabase, error } = await getAuthenticatedCoach();
    if (error) return error;

    const { id } = await params;
    const body = await request.json();

    if (!body.churn_reason) {
        return NextResponse.json(
            { error: "churn_reason is required" },
            { status: 400 }
        );
    }

    const { data, error: dbError } = await supabase!
        .from("enrollments")
        .update({
            churn_reason: body.churn_reason,
            status: "cancelled",
        })
        .eq("id", id)
        .eq("coach_id", coachId!)
        .select()
        .single();

    if (dbError) {
        return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json(data);
}
