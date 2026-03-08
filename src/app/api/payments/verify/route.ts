import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpayPayment } from "@/lib/razorpay/verify-payment";
import { getRazorpay } from "@/lib/razorpay/client";
import {
    sendClientWelcome,
    sendCoachNewClientNotification,
} from "@/lib/whatsapp";
import {
    checkRateLimit,
    rateLimitResponse,
    getClientIP,
} from "@/lib/rate-limit";

// POST /api/payments/verify — Verify Razorpay payment signature + activate enrollment
// Called immediately after the Razorpay modal closes successfully on frontend
export async function POST(req: NextRequest) {
    // Rate limit: 20 requests per minute per IP
    const ip = getClientIP(req);
    const { allowed, retryAfterMs } = checkRateLimit(`verify:${ip}`, {
        maxRequests: 20,
    });
    if (!allowed) {
        return rateLimitResponse(retryAfterMs);
    }

    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        } = await req.json();

        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            return NextResponse.json(
                { error: "Missing payment parameters" },
                { status: 400 }
            );
        }

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

        // Step 2: Fetch order from Razorpay to get server-side notes
        // This prevents the client from tampering with clientData
        const razorpay = getRazorpay();
        const order = await razorpay.orders.fetch(razorpay_order_id);
        const notes = order.notes as Record<string, string>;

        if (!notes?.enrollment_id || !notes?.coach_id) {
            console.error("[Razorpay] Order missing required notes");
            return NextResponse.json(
                { error: "Invalid order data" },
                { status: 400 }
            );
        }

        // Extract client data from server-side order notes (not from frontend!)
        const clientData = {
            full_name: notes.client_full_name,
            whatsapp_number: notes.client_whatsapp,
            email: notes.client_email,
            age: notes.client_age ? parseInt(notes.client_age) : null,
            primary_goal: notes.client_primary_goal || null,
            health_notes: notes.client_health_notes || null,
        };
        const enrollmentId = notes.enrollment_id;

        const { createServiceClient } = await import("@/lib/supabase/server");
        const supabase = await createServiceClient();

        // Step 3: Get enrollment — verify it matches the order
        const { data: enrollment } = await supabase
            .from("enrollments")
            .select(
                "*, programs(name, duration_weeks), coaches(full_name, whatsapp_number, checkin_day)"
            )
            .eq("id", enrollmentId)
            .eq("coach_id", notes.coach_id)
            .eq("status", "pending") // Only activate pending enrollments
            .single();

        if (!enrollment) {
            return NextResponse.json(
                { error: "Enrollment not found or already activated" },
                { status: 404 }
            );
        }

        // Step 4: Create or find client record
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

        // Step 5: Update enrollment to active with client_id
        await supabase
            .from("enrollments")
            .update({
                client_id: clientId,
                status: "active",
                gateway_payment_id: razorpay_payment_id,
                payment_gateway: "razorpay",
            })
            .eq("id", enrollmentId);

        // Step 6: Record payment
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

        // Step 7: Send WhatsApp notifications (fire and forget)
        const coach = enrollment.coaches as unknown as {
            full_name: string;
            whatsapp_number: string;
            checkin_day: number;
        };
        const program = enrollment.programs as unknown as {
            name: string;
            duration_weeks: number;
        };

        try {
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
                sendClientWelcome(
                    clientData.whatsapp_number,
                    clientData.full_name.split(" ")[0],
                    coach?.full_name || "Your Coach"
                ),
                coach?.whatsapp_number
                    ? sendCoachNewClientNotification(
                        coach.whatsapp_number,
                        coach?.full_name || "Coach",
                        clientData.full_name
                      )
                    : Promise.resolve(),
            ]);
        } catch {
            // WhatsApp failures should not break the payment flow
            console.error(
                "[Razorpay] WhatsApp notification failed (non-blocking)"
            );
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
