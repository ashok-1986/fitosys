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
                const payment = event.payload.payment.entity;
                // Update payment status
                await supabase
                    .from("payments")
                    .update({ gateway_payment_status: "captured" })
                    .eq("gateway_payment_id", payment.id);

                console.log(
                    `[Razorpay Webhook] Payment captured: ${payment.id}`
                );

                // Look up enrollment details to send welcome message
                const enrollmentId = payment.notes?.enrollment_id;
                if (enrollmentId && payment.notes?.payment_type === "new") {
                    const { data: enrollment } = await supabase
                        .from("enrollments")
                        .select("start_date, clients(full_name, whatsapp_number), coaches(full_name), programs(name)")
                        .eq("id", enrollmentId)
                        .single();

                    if (enrollment) {
                        const client = enrollment.clients as unknown as { full_name: string; whatsapp_number: string };
                        const coach = enrollment.coaches as unknown as { full_name: string };
                        const program = enrollment.programs as unknown as { name: string };
                        
                        try {
                            const { sendClientWelcome } = await import("@/lib/whatsapp");
                            const startDateFormatted = new Date(enrollment.start_date || Date.now()).toLocaleDateString("en-IN", {
                                day: "numeric", month: "short", year: "numeric"
                            });

                            await sendClientWelcome(
                                client.whatsapp_number,
                                coach.full_name,
                                client.full_name.split(" ")[0],
                                program.name,
                                startDateFormatted
                            );
                            console.log(`[Razorpay Webhook] Sent welcome message to ${client.full_name}`);
                        } catch (err) {
                            console.error("[Razorpay Webhook] Failed to send welcome message:", err);
                        }
                    }
                }
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
                            plan: "suspended" as string,
                            updated_at: new Date().toISOString(),
                        })
                        .eq("id", coachId);

                    console.error(
                        `[Razorpay Webhook] Subscription halted for coach: ${coachId}`
                    );
                }
                break;
            }

            default:
                console.log(
                    `[Razorpay Webhook] Unhandled event: ${event.event}`
                );
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
