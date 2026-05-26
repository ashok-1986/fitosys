import { NextResponse } from "next/server";
import { getAuthenticatedCoach } from "@/lib/auth";
import { sendClientWelcome } from "@/lib/whatsapp/templates";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: enrollmentId } = await params;
        const { coachId, supabase, error } = await getAuthenticatedCoach();

        if (error || !coachId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { action } = body;

        if (action !== "confirm" && action !== "reject") {
            return NextResponse.json({ error: "Invalid action" }, { status: 400 });
        }

        // Fetch enrollment
        const { data: enrollment, error: fetchError } = await supabase!
            .from("enrollments")
            .select("id, client_id, start_date, status")
            .eq("id", enrollmentId)
            .eq("coach_id", coachId)
            .eq("status", "payment_pending")
            .single();

        if (fetchError || !enrollment) {
            return NextResponse.json({ error: "Enrollment not found or already processed" }, { status: 404 });
        }

        if (action === "confirm") {
            // 1. Update enrollment status to 'active'
            const { error: updateEnrollmentError } = await supabase!
                .from("enrollments")
                .update({ status: "active" })
                .eq("id", enrollmentId);

            if (updateEnrollmentError) throw updateEnrollmentError;

            // 2. If client_id exists, update client to 'active' and send WA
            if (enrollment.client_id) {
                const { error: updateClientError } = await supabase!
                    .from("clients")
                    .update({ status: "active" })
                    .eq("id", enrollment.client_id);

                if (updateClientError) throw updateClientError;

                // Fetch client, program, coach for WhatsApp
                const [coachRes, clientRes, progRes] = await Promise.all([
                    supabase!.from("coaches").select("full_name, checkin_day").eq("id", coachId).single(),
                    supabase!.from("clients").select("full_name, whatsapp_number").eq("id", enrollment.client_id).single(),
                    supabase!.from("enrollments").select("programs(name)").eq("id", enrollmentId).single(),
                ]);

                if (coachRes.data && clientRes.data && progRes.data) {
                    try {
                        await sendClientWelcome(
                            clientRes.data.whatsapp_number,
                            coachRes.data.full_name,
                            clientRes.data.full_name.split(" ")[0],
                            (progRes.data.programs as unknown as { name: string })?.name || "your program",
                            enrollment.start_date,
                            coachRes.data.checkin_day
                        );
                    } catch (waError) {
                        console.error("WhatsApp welcome failed:", waError);
                    }
                }
            }

            return NextResponse.json({ success: true, action: "confirmed" });
        }

        if (action === "reject") {
            // 1. Update enrollment status to 'cancelled'
            const { error: rejectEnrollmentError } = await supabase!
                .from("enrollments")
                .update({ status: "cancelled" })
                .eq("id", enrollmentId);

            if (rejectEnrollmentError) throw rejectEnrollmentError;

            // 2. Update client to 'inactive' if exists
            if (enrollment.client_id) {
                const { error: rejectClientError } = await supabase!
                    .from("clients")
                    .update({ status: "inactive" })
                    .eq("id", enrollment.client_id);

                if (rejectClientError) throw rejectClientError;
            }

            return NextResponse.json({ success: true, action: "rejected" });
        }

    } catch (err: any) {
        console.error("Confirm error:", err);
        return NextResponse.json({ error: err.message || "Internal server error" }, { status: 500 });
    }
}
