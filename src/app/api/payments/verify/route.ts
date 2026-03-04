import { NextResponse } from "next/server";
import { verifyRazorpayPayment } from "@/lib/razorpay/verify-payment";
import {
    sendClientWelcome,
    sendCoachNewClientNotification,
} from "@/lib/whatsapp";

// POST /api/payments/verify — Verify Razorpay payment signature + activate enrollment
// Called immediately after the Razorpay modal closes successfully on frontend
export async function POST(req: Request) {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            enrollmentId,
            clientData,
        } = await req.json();

        // Step 1: Verify signature — CRITICAL security check
        const isValid = verifyRazorpayPayment(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        );

        if (!isValid) {
            console.error("[Razorpay] Invalid payment signature");
            return NextResponse.json(
                { error: "Invalid payment signature" },
                { status: 400 }
            );
        }

        const { createServiceClient } = await import("@/lib/supabase/server");
        const supabase = await createServiceClient();

        // Step 2: Get enrollment details
        const { data: enrollment } = await supabase
            .from("enrollments")
            .select(
                "*, programs(name, duration_weeks), coaches(full_name, whatsapp_number)"
            )
            .eq("id", enrollmentId)
            .single();

        if (!enrollment) {
            return NextResponse.json(
                { error: "Enrollment not found" },
                { status: 404 }
            );
        }

        // Step 3: Create or find client record
        let clientId: string;
        const { data: existingClient } = await supabase
            .from("clients")
            .select("id")
            .eq("whatsapp_number", clientData.whatsapp_number)
            .eq("coach_id", enrollment.coach_id)
            .single();

        if (existingClient) {
            clientId = existingClient.id;
        } else {
            const { data: newClient } = await supabase
                .from("clients")
                .insert({
                    coach_id: enrollment.coach_id,
                    full_name: clientData.full_name,
                    whatsapp_number: clientData.whatsapp_number,
                    email: clientData.email,
                    age: clientData.age || null,
                    primary_goal: clientData.primary_goal || null,
                    health_notes: clientData.health_notes || null,
                    status: "active",
                })
                .select()
                .single();

            if (!newClient) {
                return NextResponse.json(
                    { error: "Failed to create client record" },
                    { status: 500 }
                );
            }
            clientId = newClient.id;
        }

        // Step 4: Update enrollment to active with client_id
        await supabase
            .from("enrollments")
            .update({
                client_id: clientId,
                status: "active",
                gateway_payment_id: razorpay_payment_id,
                payment_gateway: "razorpay",
            })
            .eq("id", enrollmentId);

        // Step 5: Record payment
        await supabase.from("payments").insert({
            coach_id: enrollment.coach_id,
            client_id: clientId,
            enrollment_id: enrollmentId,
            amount: enrollment.amount_paid,
            currency: enrollment.currency,
            payment_type: "new",
            gateway_payment_id: razorpay_payment_id,
            gateway_order_id: razorpay_order_id,
            payment_gateway: "razorpay",
            gateway_payment_status: "captured",
            paid_at: new Date().toISOString(),
        });

        // Step 6: Send WhatsApp notifications (fire and forget)
        const coach = enrollment.coaches as unknown as {
            full_name: string;
            whatsapp_number: string;
        };
        const program = enrollment.programs as unknown as {
            name: string;
            duration_weeks: number;
        };

        try {
            // Compute enrollment dates for notification messages
            const endDate = enrollment.end_date
                ? new Date(enrollment.end_date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                })
                : "TBD";
            const startDate = enrollment.start_date
                ? new Date(enrollment.start_date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                })
                : new Date().toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                });
            const dayNames = [
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
            ];

            await Promise.allSettled([
                sendClientWelcome({
                    clientName: clientData.full_name.split(" ")[0],
                    coachName: coach?.full_name || "Your Coach",
                    programName: program?.name || "Coaching Program",
                    endDate,
                    checkinDay: dayNames[0], // Default Sunday, updated by coach settings
                    clientPhone: clientData.whatsapp_number,
                }),
                coach?.whatsapp_number
                    ? sendCoachNewClientNotification({
                        coachPhone: coach.whatsapp_number,
                        clientName: clientData.full_name,
                        programName: program?.name || "Coaching Program",
                        currency: enrollment.currency || "INR",
                        amount: enrollment.amount_paid,
                        startDate,
                        endDate,
                    })
                    : Promise.resolve(),
            ]);
        } catch {
            // WhatsApp failures should not break the payment flow
            console.error("[Razorpay] WhatsApp notification failed (non-blocking)");
        }

        console.log(
            `[Razorpay] Payment verified: ${clientData.full_name} → ${coach?.full_name}`
        );

        return NextResponse.json({ success: true, clientId });
    } catch (error) {
        console.error("[Razorpay] Payment verify error:", error);
        return NextResponse.json(
            { error: "Payment verification failed" },
            { status: 500 }
        );
    }
}
