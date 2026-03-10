import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedCoach } from "@/lib/auth";

export async function PUT(request: NextRequest) {
    const { coachId, supabase, error } = await getAuthenticatedCoach();
    if (error) return error;

    try {
        const body = await request.json();
        const { business_name, gst_number, billing_address } = body;

        const { error: dbError } = await supabase!
            .from("coaches")
            .update({
                business_name: business_name || null,
                gst_number: gst_number || null,
                billing_address: billing_address || null
            })
            .eq("id", coachId!);

        if (dbError) {
            console.error("[Billing Update] Database error:", dbError);
            return NextResponse.json({ error: dbError.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("[Billing Update] Parsing error:", err);
        return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
    }
}
