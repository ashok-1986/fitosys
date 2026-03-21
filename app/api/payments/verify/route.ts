import { NextRequest, NextResponse } from "next/server";
import { verifyRazorpayPayment } from "@/lib/razorpay/verify-payment";
import { getRazorpay } from "@/lib/razorpay/client";
import {
    sendClientWelcome,
    sendCoachNewClientNotification,
    sendRenewalConfirmation,
} from "@/lib/whatsapp";
import { checkClientLimit } from "@/lib/plans/check-limit";
import { sensitiveRateLimit } from "@/lib/rate-limit";
import { generateGSTInvoice } from "@/lib/gst/generate-invoice";
import { logRequest, logError } from "@/lib/loggerHelpers";

// POST /api/payments/verify — Verify Razorpay payment signature + activate enrollment
// Called immediately after the Razorpay modal closes successfully on frontend
export async function POST(req: NextRequest) {
    logRequest(req, "POST /api/payments/verify");
    
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const { success } = await sensitiveRateLimit.limit(ip);
    if (!success) {
        return new NextResponse("Too many requests", { status: 429 });
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
// Idempotency check — prevent double processing
const { data: existingPayment } = await supabase
    .from("payments")
    .select("id, client_id")
    .eq("gateway_payment_id", razorpay_payment_id)
    .single();

if (existingPayment) {
    return NextResponse.json({ success: true, clientId: existingPayment.client_id });
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

        // Check if this is a renewal payment
        const isRenewal = notes.payment_type === "renewal";

        // Step 3: Get enrollment — verify it matches the order
        const { data: enrollment } = await supabase
            .from("enrollments")
            .select(
                "*, programs(name, duration_weeks, price, currency), coaches(full_name, whatsapp_number, checkin_day, business_name, gst_number, billing_address)"
            )
            .eq("id", enrollmentId)
            .eq("coach_id", notes.coach_id)
            .eq("status", isRenewal ? "active" : "pending")
            .single();

        if (!enrollment) {
            return NextResponse.json(
                { error: "Enrollment not found or already processed" },
                { status: 404 }
            );
        }

        // Extract program and coach from enrollment (type assertion for nested data)
        const program = enrollment.programs as unknown as {
            name: string;
            duration_weeks: number;
            price: number;
            currency: string;
        };
        const coach = enrollment.coaches as unknown as {
            full_name: string;
            whatsapp_number: string;
            checkin_day: number;
            business_name?: string;
            gst_number?: string;
            billing_address?: string;
        };

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
            // Backend safeguard: Check plan limit before creating a NEW client
            try {
                const limitCheck = await checkClientLimit(enrollment.coach_id);
                if (!limitCheck.allowed) {
                    // Refund the payment
                    console.error(`[Razorpay] Coach ${enrollment.coach_id} over limit. Refunding payment ${razorpay_payment_id}.`);
                    await razorpay.payments.refund(razorpay_payment_id, {
                        speed: "optimum",
                        notes: {
                            reason: "Coach capacity reached",
                        }
                    });

                    // Update enrollment status
                    await supabase
                        .from("enrollments")
                        .update({ status: "cancelled" })
                        .eq("id", enrollmentId);

                    return NextResponse.json(
                        { error: "Coach capacity reached. Your payment has been refunded." },
                        { status: 403 }
                    );
                }
            } catch (limitErr) {
                console.error("[Razorpay Verify] Failed to check plan limit:", limitErr);
                return NextResponse.json({ error: "Capacity verification failed" }, { status: 500 });
            }

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
        if (isRenewal) {
            // For renewals, extend the end_date by program duration
            const newEndDate = new Date(enrollment.end_date);
            newEndDate.setDate(newEndDate.getDate() + (program.duration_weeks || 12) * 7);
            
            await supabase
                .from("enrollments")
                .update({
                    client_id: clientId,
                    end_date: newEndDate.toISOString().split("T")[0],
                    gateway_payment_id: razorpay_payment_id,
                    payment_gateway: "razorpay",
                    renewal_reminder_1_sent: false,
                    renewal_reminder_2_sent: false,
                })
                .eq("id", enrollmentId);
        } else {
            // For new enrollments, set to active
            await supabase
                .from("enrollments")
                .update({
                    client_id: clientId,
                    status: "active",
                    gateway_payment_id: razorpay_payment_id,
                    payment_gateway: "razorpay",
                })
                .eq("id", enrollmentId);
        }

        // Step 6: Record payment
        await supabase.from("payments").insert({
            coach_id: enrollment.coach_id,
            client_id: clientId,
            enrollment_id: enrollmentId,
            amount: enrollment.amount_paid,
            currency: enrollment.currency,
            payment_type: isRenewal ? "renewal" : "new",
            gateway_payment_id: razorpay_payment_id,
            gateway_order_id: razorpay_order_id,
            payment_gateway: "razorpay",
            gateway_payment_status: "captured",
            paid_at: new Date().toISOString(),
        });

        // Step 7: Send WhatsApp notifications (fire and forget)
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

            // For renewals, calculate new end date
            const newEndDate = isRenewal
                ? (() => {
                    const d = new Date(enrollment.end_date);
                    d.setDate(d.getDate() + (program.duration_weeks || 12) * 7);
                    return d.toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    });
                })()
                : endDate;

            await Promise.allSettled([
                // Send welcome for new enrollments, renewal confirmation for renewals
                isRenewal
                    ? sendRenewalConfirmation(
                        clientData.whatsapp_number,
                        clientData.full_name.split(" ")[0],
                        program?.name || "Fitness Program",
                        newEndDate
                    )
                    : sendClientWelcome(
                        clientData.whatsapp_number,
                        coach?.full_name || "Your Coach",
                        clientData.full_name.split(" ")[0],
                        program?.name || "Fitness Program",
                        startDate
                    ),
                // Coach notification (only for new enrollments)
                !isRenewal && coach?.whatsapp_number
                    ? sendCoachNewClientNotification(
                        coach.whatsapp_number,
                        coach?.full_name || "Coach",
                        clientData.full_name
                    )
                    : Promise.resolve(),
                generateGSTInvoice({
                    coachId: enrollment.coach_id,
                    clientId: clientId,
                    enrollmentId: enrollmentId,
                    paymentId: razorpay_payment_id,
                    invoiceDate: new Date().toISOString().split("T")[0],
                    seller: {
                        name: coach?.business_name || coach?.full_name || "Fitness Coach",
                        address: coach?.billing_address || "India",
                        gstin: coach?.gst_number || undefined,
                    },
                    buyer: {
                        name: clientData.full_name,
                        email: clientData.email,
                    },
                    item: {
                        description: `${program?.name || "Fitness Program"} (${program?.duration_weeks || 12} Weeks)`,
                        amountBeforeTax: Math.round(enrollment.amount_paid / 1.18 * 100) / 100,
                    },
                    tax: {
                        rate: 18,
                        igst: Math.round((enrollment.amount_paid - (enrollment.amount_paid / 1.18)) * 100) / 100,
                    },
                    totalAmount: enrollment.amount_paid,
                    paymentDetails: {
                        id: razorpay_payment_id,
                        method: "Online",
                        date: new Date().toLocaleDateString("en-IN"),
                    }
                }).catch(err => console.error("[Razorpay Verification] Failed to generate GST Invoice:", err))
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
        logError(error, "POST /api/payments/verify");
        return NextResponse.json(
            { error: "Payment verification failed" },
            { status: 500 }
        );
    }
}
