import { NextResponse } from "next/server";
import { createRazorpayOrder } from "@/lib/razorpay/create-order";
import { intakeRateLimit } from "@/lib/rate-limit";

// POST /api/payments/create-order — Create a Razorpay order for client payment
// Called when client clicks Pay on intake form or renewal
// Note: This is a public endpoint - no auth required (client-facing)
export async function POST(req: Request) {
    const ip = req.headers.get("x-forwarded-for") ?? "anonymous";
    const { success } = await intakeRateLimit.limit(ip);
    if (!success) {
        return NextResponse.json(
            { error: "Too many requests. Please try again shortly." },
            { status: 429 }
        );
    }

    try {
        const body = await req.json();
        const { programId, clientData, slug } = body;

        if (!programId) {
            return NextResponse.json(
                { error: "programId is required" },
                { status: 400 }
            );
        }

        if (!clientData?.full_name || !clientData?.email || !clientData?.whatsapp_number) {
            return NextResponse.json(
                { error: "Missing required client data" },
                { status: 400 }
            );
        }

        const { createServiceClient } = await import("@/lib/supabase/server");
        const supabase = await createServiceClient();

        const { data: program, error: progError } = await supabase
            .from("programs")
            .select("*, coaches(id, full_name)")
            .eq("id", programId)
            .eq("is_active", true)
            .single();

        if (progError || !program) {
            console.error("[Create Order] Program fetch error:", progError);
            return NextResponse.json(
                { error: "Program not found or inactive" },
                { status: 404 }
            );
        }

        const resolvedCoachId = program.coach_id;

        const { data: enrollment, error: enrollError } = await supabase
            .from("enrollments")
            .insert({
                coach_id: resolvedCoachId,
                program_id: programId,
                start_date: new Date().toISOString().split("T")[0],
                end_date: getEndDate(program.duration_weeks),
                amount_paid: program.price,
                currency: program.currency ?? "INR",
                status: "pending",
            })
            .select()
            .single();

        if (enrollError || !enrollment) {
            console.error("[Create Order] Enrollment creation error:", enrollError);
            return NextResponse.json(
                { error: "Failed to create enrollment record" },
                { status: 500 }
            );
        }

        const order = await createRazorpayOrder({
            amount: program.price,
            currency: program.currency ?? "INR",
            receipt: enrollment.id,
            notes: {
                coach_id: resolvedCoachId,
                program_id: programId,
                enrollment_id: enrollment.id,
                payment_type: "new",
                client_full_name: clientData?.full_name || "",
                client_whatsapp: clientData?.whatsapp_number || "",
                client_email: clientData?.email || "",
                client_age: String(clientData?.age || ""),
                client_primary_goal: clientData?.primary_goal || "",
                client_health_notes: clientData?.health_notes || "",
            },
        });

        return NextResponse.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            enrollmentId: enrollment.id,
        });
    } catch (error) {
        console.error("[Razorpay] Create order error:", error);
        return NextResponse.json(
            { error: "Failed to create order" },
            { status: 500 }
        );
    }
}

function getEndDate(durationWeeks: number): string {
    const end = new Date();
    end.setDate(end.getDate() + durationWeeks * 7);
    return end.toISOString().split("T")[0];
}