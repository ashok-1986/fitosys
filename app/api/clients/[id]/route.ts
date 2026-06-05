import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedCoach } from "@/lib/auth";
import { encryptPhone, decryptPhone } from "@/lib/crypto";

// GET /api/clients/:id — Get full client profile
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { coachId, supabase, error } = await getAuthenticatedCoach();
    if (error) return error;

    const { id } = await params;

    const [clientRes, enrollmentRes, checkinsRes, paymentsRes] = await Promise.all([
        supabase!
            .from("clients")
            .select("*")
            .eq("id", id)
            .eq("coach_id", coachId!)
            .single(),
        supabase!
            .from("enrollments")
            .select("id, start_date, end_date, amount_paid, status, programs(name)")
            .eq("client_id", id)
            .eq("coach_id", coachId!)
            .eq("status", "active")
            .order("start_date", { ascending: false })
            .limit(1)
            .maybeSingle(),
        supabase!
            .from("checkins")
            .select("id, week_number, check_date, energy_score, sessions_completed, raw_reply, notes, responded_at, message_sent_at")
            .eq("client_id", id)
            .eq("coach_id", coachId!)
            .order("check_date", { ascending: false })
            .limit(20),
        supabase!
            .from("payments")
            .select("id, amount, currency, payment_type, gateway_payment_status, paid_at, created_at")
            .eq("client_id", id)
            .eq("coach_id", coachId!)
            .order("created_at", { ascending: false })
            .limit(10),
    ]);

    if (clientRes.error || !clientRes.data) {
        return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    if (checkinsRes.error) {
        console.error("Failed to fetch checkins:", checkinsRes.error);
    }
    if (paymentsRes.error) {
        console.error("Failed to fetch payments:", paymentsRes.error);
    }

    const enrollmentData = enrollmentRes.data ? {
        id: enrollmentRes.data.id,
        program_name: (enrollmentRes.data.programs as unknown as { name: string })?.name || "Unknown",
        start_date: enrollmentRes.data.start_date,
        end_date: enrollmentRes.data.end_date,
        amount_paid: enrollmentRes.data.amount_paid,
        status: enrollmentRes.data.status,
    } : null;

    if (clientRes.data && clientRes.data.whatsapp_number) {
        clientRes.data.whatsapp_number = decryptPhone(clientRes.data.whatsapp_number);
    }

    return NextResponse.json({
        client: clientRes.data,
        enrollment: enrollmentData,
        checkins: checkinsRes.data || [],
        payments: paymentsRes.data || [],
    });
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

    if (updates.whatsapp_number) {
        updates.whatsapp_number = encryptPhone(updates.whatsapp_number as string);
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

    if (data && data.whatsapp_number) {
        data.whatsapp_number = decryptPhone(data.whatsapp_number);
    }

    return NextResponse.json(data);
}

// DELETE /api/clients/:id — Delete a client and log the action
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { coachId, supabase, error } = await getAuthenticatedCoach();
    if (error) return error;

    const { id } = await params;

    // We use the service client for audit log insertion to bypass any RLS restrictions if needed, 
    // but the policy allows authenticated users to insert their own logs.
    const { error: dbError } = await supabase!
        .from("clients")
        .delete()
        .eq("id", id)
        .eq("coach_id", coachId!);

    if (dbError) {
        return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    // Insert audit log
    await supabase!
        .from("audit_logs")
        .insert({
            coach_id: coachId!,
            client_id: id,
            action: "delete",
            target_table: "clients",
            record_id: id,
        });

    return NextResponse.json({ success: true });
}
