import { NextResponse } from "next/server";
import { createRazorpayOrder } from "@/lib/razorpay/create-order";

// POST /api/payments/create-order — Create a Razorpay order for client payment
// Called when client clicks Pay on intake form or renewal
export async function POST(req: Request) {
    try {
        const { programId, clientData, coachId } = await req.json();

        if (!programId) {
            return NextResponse.json(
                { error: "programId is required" },
                { status: 400 }
            );
        }

        const { createServiceClient } = await import("@/lib/supabase/server");
        const supabase = await createServiceClient();

        // Fetch program details
        const { data: program, error } = await supabase
            .from("programs")
            .select("*, coaches(full_name, id)")
            .eq("id", programId)
            .single();

        if (error || !program) {
            return NextResponse.json(
                { error: "Program not found" },
                { status: 404 }
            );
        }

        const resolvedCoachId = coachId || program.coach_id;

        // Create a pending enrollment record (client_id is null until payment verified)
        const { data: enrollment } = await supabase
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

        if (!enrollment) {
            return NextResponse.json(
                { error: "Failed to create enrollment" },
                { status: 500 }
            );
        }

        // Create Razorpay order
        const order = await createRazorpayOrder({
            amount: program.price,
            currency: program.currency ?? "INR",
            receipt: enrollment.id,
            notes: {
                coach_id: resolvedCoachId,
                program_id: programId,
                enrollment_id: enrollment.id,
                ...(clientData
                    ? {
                        client_name: clientData.full_name,
                        client_whatsapp: clientData.whatsapp_number,
                    }
                    : {}),
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
