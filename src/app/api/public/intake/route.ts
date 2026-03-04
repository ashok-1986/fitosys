import { NextRequest, NextResponse } from "next/server";
import { createRazorpayOrder } from "@/lib/razorpay/create-order";

// POST /api/public/intake — Submit intake form + create Razorpay order
// No auth required — this is the public client-facing endpoint
export async function POST(request: NextRequest) {
    const body = await request.json();
    const {
        slug,
        full_name,
        whatsapp_number,
        email,
        age,
        primary_goal,
        health_notes,
        program_id,
        agree_terms,
    } = body;

    // Validate required fields
    if (!slug || !full_name || !whatsapp_number || !email || !program_id) {
        return NextResponse.json(
            { error: "All required fields must be filled" },
            { status: 400 }
        );
    }

    if (!agree_terms) {
        return NextResponse.json(
            { error: "You must agree to the terms" },
            { status: 400 }
        );
    }

    // Use service client since this is a public endpoint (no auth session)
    const { createServiceClient } = await import("@/lib/supabase/server");
    const supabase = await createServiceClient();

    // Get coach by slug
    const { data: coach, error: coachError } = await supabase
        .from("coaches")
        .select("id, full_name, whatsapp_number, checkin_day")
        .eq("slug", slug)
        .eq("status", "active")
        .single();

    if (coachError || !coach) {
        return NextResponse.json(
            { error: "Coach not found" },
            { status: 404 }
        );
    }

    // Get program details
    const { data: program, error: progError } = await supabase
        .from("programs")
        .select("*")
        .eq("id", program_id)
        .eq("coach_id", coach.id)
        .eq("is_active", true)
        .single();

    if (progError || !program) {
        return NextResponse.json(
            { error: "Program not found or inactive" },
            { status: 404 }
        );
    }

    // Create a pending enrollment (client_id null until payment is verified)
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + program.duration_weeks * 7);

    const { data: enrollment, error: enrollError } = await supabase
        .from("enrollments")
        .insert({
            coach_id: coach.id,
            program_id: program.id,
            start_date: new Date().toISOString().split("T")[0],
            end_date: endDate.toISOString().split("T")[0],
            amount_paid: program.price,
            currency: program.currency ?? "INR",
            status: "pending",
        })
        .select()
        .single();

    if (enrollError || !enrollment) {
        console.error("[Intake] Failed to create enrollment:", enrollError);
        return NextResponse.json(
            { error: "Failed to create enrollment" },
            { status: 500 }
        );
    }

    // Create Razorpay order
    try {
        const order = await createRazorpayOrder({
            amount: program.price,
            currency: program.currency ?? "INR",
            receipt: enrollment.id,
            notes: {
                coach_id: coach.id,
                program_id: program.id,
                enrollment_id: enrollment.id,
                payment_type: "new",
                client_full_name: full_name,
                client_whatsapp: whatsapp_number,
                client_email: email,
                client_age: String(age || ""),
                client_primary_goal: primary_goal || "",
                client_health_notes: health_notes || "",
            },
        });

        return NextResponse.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            enrollmentId: enrollment.id,
            coachName: coach.full_name,
            programName: program.name,
        });
    } catch (err) {
        console.error("[Intake] Razorpay order creation failed:", err);
        // Clean up the pending enrollment
        await supabase.from("enrollments").delete().eq("id", enrollment.id);
        return NextResponse.json(
            { error: "Failed to create payment order" },
            { status: 500 }
        );
    }
}
