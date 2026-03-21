import { NextResponse } from "next/server";
import { logError, logRequest } from "@/lib/loggerHelpers";
import { verifyRazorpaySignature } from "@/lib/webhook/verifyRazorpay";

// POST /api/webhooks/razorpay — Razorpay webhook handler
// Handles: payment.captured, payment.failed, subscription.charged, subscription.halted
export async function POST(req: Request) {
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
                // Coach subscription renewed successfully
                const subscription = event.payload.subscription.entity;
                const coachId = subscription.notes?.coach_id;

                if (coachId) {
                    await supabase
                        .from("coaches")
                        .update({
                            plan: "active",
                            updated_at: new Date().toISOString(),
                        })
                        .eq("id", coachId);

                    console.log(
                        `[Razorpay Webhook] Subscription renewed for coach: ${coachId}`
                    );
                }
                break;
            }

            case "subscription.halted": {
                // Coach subscription payment failed
                const subscription = event.payload.subscription.entity;
                const coachId = subscription.notes?.coach_id;

                if (coachId) {
                    await supabase
                        .from("coaches")
                        .update({
                            plan: "suspended",
                            updated_at: new Date().toISOString(),
                        })
                        .eq("id", coachId);

                    console.error(
                        `[Razorpay Webhook] Subscription halted for coach: ${coachId}`
                    );
                }
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
