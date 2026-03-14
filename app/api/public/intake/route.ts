import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createRazorpayOrder } from "@/lib/razorpay/create-order";
import { checkClientLimit } from "@/lib/plans/check-limit";
import { intakeRateLimit } from "@/lib/rate-limit";
import { logRequest, logError } from "@/lib/loggerHelpers";

// Zod schema for intake validation
const intakeSchema = z.object({
    slug: z.string().min(1).max(50),
    full_name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name too long")
        .transform((s) => s.replace(/<[^>]*>/g, "")), // strip HTML
    whatsapp_number: z
        .string()
        .regex(/^\+?[0-9]{10,15}$/, "Invalid phone number"),
    email: z.string().email("Invalid email").max(255),
    age: z.coerce.number().int().min(10).max(120).optional().nullable(),
    primary_goal: z
        .string()
        .max(500)
        .transform((s) => s.replace(/<[^>]*>/g, ""))
        .optional()
        .nullable(),
    health_notes: z
        .string()
        .max(1000)
        .transform((s) => s.replace(/<[^>]*>/g, ""))
        .optional()
        .nullable(),
    program_id: z.string().uuid("Invalid program ID"),
    agree_terms: z.literal(true, {
        message: "You must agree to the terms",
    }),
});

// POST /api/public/intake — Submit intake form + create Razorpay order
// No auth required — this is the public client-facing endpoint
export async function POST(request: NextRequest) {
    logRequest(request, "POST /api/public/intake");
    
    const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const { success } = await intakeRateLimit.limit(ip);
    if (!success) {
        return new NextResponse("Too many requests", { status: 429 });
    }

    // Parse and validate input
    let body;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { error: "Invalid request body" },
            { status: 400 }
        );
    }

    const parsed = intakeSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            {
                error: "Validation failed",
                details: parsed.error.issues.map((i) => ({
                    field: i.path.join("."),
                    message: i.message,
                })),
            },
            { status: 400 }
        );
    }

    const {
        slug,
        full_name,
        whatsapp_number,
        email,
        age,
        primary_goal,
        health_notes,
        program_id,
    } = parsed.data;

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

    // Check plan limits before allowing intake
    try {
        const limitCheck = await checkClientLimit(coach.id);
        if (!limitCheck.allowed) {
            return NextResponse.json(
                {
                    error: "Coach capacity reached",
                    upgrade_required: true,
                },
                { status: 403 }
            );
        }
    } catch (err) {
        console.error("[Intake] Plan limit check failed:", err);
        return NextResponse.json(
            { error: "Failed to verify coach capacity" },
            { status: 500 }
        );
    }

    // Get program details
    const { data: program, error: progError } = await supabase
        .from("programs")
        .select("id, name, duration_weeks, price, currency")
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
