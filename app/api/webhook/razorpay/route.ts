import { NextRequest, NextResponse } from "next/server";
import { logError, logRequest } from "@/lib/loggerHelpers";
import { verifyRazorpaySignature } from "@/lib/webhook/verifyRazorpay";

const RAZORPAY_WEBHOOK_IPS = [
    "52.74.43.81",
    "52.77.239.96",
    "13.234.61.24",
    "13.234.179.64",
    "15.206.93.100",
    "3.109.223.134",
];

// POST /api/webhooks/razorpay — Razorpay webhook handler
// Handles: payment.captured, payment.failed, subscription.charged, subscription.halted
export async function POST(req: NextRequest) {
    // IP allowlist check must come before any body read
    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip = forwardedFor?.split(",")[0].trim() ?? req.headers.get("x-real-ip") ?? "";

    if (process.env.NODE_ENV === "production" && !RAZORPAY_WEBHOOK_IPS.includes(ip)) {
        console.warn(`[Razorpay Webhook] Blocked request from unlisted IP: ${ip}`);
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        logRequest(req as any, "POST /api/webhooks/razorpay");
        const body = await req.text();
        const signature = req.headers.get("x-razorpay-signature") ?? "";
        const isValid = verifyRazorpaySignature(body, signature);
        if (!isValid) {
            logError("Invalid signature", "razorpay-webhook");
            return NextResponse.json(
                { error: "Invalid signature" },
                { status: 400 }
            );
        }

        const event = JSON.parse(body);

        const { createServiceClient } = await import("@/lib/supabase/server");
        const supabase = await createServiceClient();

        switch (event.event) {
            case "payment.captured": {
                // Handled in /api/payments/verify — client creation, enrollment
                // activation, and WhatsApp notifications already sent there.
                // No action needed here to avoid duplicate welcome messages.
                console.log(`[Razorpay Webhook] payment.captured acknowledged: ${event.payload.payment.entity.id}`);
                break;
            }

            case "payment.failed": {
                const payment = event.payload.payment.entity;
                const enrollmentId = payment.notes?.enrollment_id;

                if (enrollmentId) {
                    await supabase
                        .from("enrollments")
                        .update({ status: "payment_failed" })
                        .eq("id", enrollmentId);
                }

                // Record the failed payment
                if (payment.notes?.coach_id) {
                    await supabase.from("payments").upsert(
                        {
                            coach_id: payment.notes.coach_id,
                            client_id: payment.notes.client_id || null,
                            enrollment_id: enrollmentId || null,
                            amount: payment.amount / 100,
                            currency: payment.currency?.toUpperCase() || "INR",
                            payment_type: payment.notes.payment_type || "new",
                            gateway_payment_id: payment.id,
                            gateway_order_id: payment.order_id,
                            payment_gateway: "razorpay",
                            gateway_payment_status: "failed",
                        },
                        { onConflict: "gateway_payment_id" }
                    );
                }

                console.error(
                    `[Razorpay Webhook] Payment failed: ${payment.id}`,
                    payment.error_description
                );
                break;
            }

            case "subscription.charged": {
                const subscription = event.payload.subscription.entity;
                const payment = event.payload.payment?.entity;
                const coachId = subscription.notes?.coach_id;
                const plan = subscription.notes?.plan;

                if (!coachId || !plan) {
                    console.error("[Razorpay Webhook] subscription.charged missing coachId or plan");
                    break;
                }

                // Calculate new period dates
                const periodStart = new Date();
                const periodEnd = new Date();
                periodEnd.setDate(periodEnd.getDate() + 30);

                // Update subscription record
                await supabase
                    .from("subscriptions")
                    .update({
                        status: "active",
                        current_period_start: periodStart.toISOString().split("T")[0],
                        current_period_end: periodEnd.toISOString().split("T")[0],
                    })
                    .eq("gateway_payment_id", subscription.id);

                // Update coach plan and status
                await supabase
                    .from("coaches")
                    .update({
                        plan: plan,
                        status: "active",
                        updated_at: new Date().toISOString(),
                    })
                    .eq("id", coachId);

                // Log the payment if payment entity exists
                if (payment && coachId) {
                    await supabase.from("payments").upsert(
                        {
                            coach_id: coachId,
                            client_id: null,
                            enrollment_id: null,
                            amount: payment.amount / 100,
                            currency: payment.currency?.toUpperCase() || "INR",
                            payment_type: "subscription",
                            gateway_payment_id: payment.id,
                            gateway_order_id: payment.order_id || null,
                            payment_gateway: "razorpay",
                            gateway_payment_status: "captured",
                            paid_at: new Date().toISOString(),
                        },
                        { onConflict: "gateway_payment_id" }
                    );
                }

                console.log(`[Razorpay Webhook] Subscription charged for coach: ${coachId}, plan: ${plan}`);
                break;
            }

            case "subscription.halted": {
                const subscription = event.payload.subscription.entity;
                const coachId = subscription.notes?.coach_id;

                if (!coachId) {
                    console.error("[Razorpay Webhook] subscription.halted missing coachId");
                    break;
                }

                // Update subscription record to past_due
                await supabase
                    .from("subscriptions")
                    .update({ status: "past_due" })
                    .eq("gateway_payment_id", subscription.id);

                // Get coach details for WhatsApp notification
                const { data: coach } = await supabase
                    .from("coaches")
                    .select("full_name, whatsapp_number")
                    .eq("id", coachId)
                    .single();

                // Send WhatsApp warning to coach
                if (coach?.whatsapp_number) {
                    try {
                        const { sendWhatsAppMessage } = await import("@/lib/whatsapp/send");
                        await sendWhatsAppMessage({
                            phone: coach.whatsapp_number,
                            message: `Hi ${coach.full_name}, your Fitosys subscription payment failed. Your account remains active for now. Please update your payment method to avoid service interruption. Login at fitosys.alchemetryx.com`
                        });
                    } catch (waErr) {
                        console.error("[Razorpay Webhook] WhatsApp notification failed:", waErr);
                    }
                }

                console.error(`[Razorpay Webhook] Subscription halted for coach: ${coachId}`);
                break;
            }
            case "refund.created": {
                const refund = event.payload.refund?.entity;
                if (!refund) break;
                console.log(`[Razorpay Webhook] Refund created: ${refund.id} for payment ${refund.payment_id}`);
                break;
            }
            default:
                console.log(`[Razorpay Webhook] Unhandled event: ${event.event}`);
        }

        return NextResponse.json({ received: true });
    } catch (error) {
        console.error("[Razorpay Webhook] Processing error:", error);
        return NextResponse.json(
            { error: "Webhook failed" },
            { status: 500 }
        );
    }
}
