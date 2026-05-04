import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendWhatsAppMessage } from "@/lib/whatsapp/send";
import { checkClientLimit } from "@/lib/plans/check-limit";
import { withRateLimit } from "@/lib/with-rate-limit";
import { logRequest, logError } from "@/lib/loggerHelpers";

// Zod schema for intake validation
const intakeSchema = z.object({
    slug: z.string().min(1).max(50),
    full_name: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name too long")
        .transform((s) => s.replace(/<[^>]*>/g, "")),
    whatsapp_number: z
        .string()
        .regex(/^\+?[0-9]{10,15}$/, "Invalid phone number")
        .transform((val) => {
            // Strip spaces and dashes
            const clean = val.replace(/[\s\-]/g, "");
            // If already has + prefix, return as is
            if (clean.startsWith("+")) return clean;
            // If 10 digits assume India, add +91
            if (clean.length === 10) return "+91" + clean;
            // Otherwise add + prefix
            return "+" + clean;
        }),
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
    consent_data: z.literal(true, {
        message: "You must consent to data processing",
    }),
    consent_health: z.literal(true, {
        message: "You must consent to health data collection",
    }),
    consent_whatsapp: z.literal(true, {
        message: "You must consent to WhatsApp communications",
    }),
});

// POST /api/public/intake — Submit intake form (UPI flow, no Razorpay)
// No auth required — this is the public client-facing endpoint
export async function POST(request: NextRequest) {
    logRequest(request, "POST /api/public/intake");
    return withRateLimit(request, false, async () => {

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

    const consentTimestamp = new Date().toISOString();

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

    // Check plan limits
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
        logError("[Intake] Plan limit check failed:", String(err));
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

    // Create enrollment with payment_pending status
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
            status: "payment_pending",
        })
        .select()
        .single();

    if (enrollError || !enrollment) {
        logError("[Intake] Failed to create enrollment:", String(enrollError));
        return NextResponse.json(
            { error: "Failed to create enrollment" },
            { status: 500 }
        );
    }

    // Create or update client record with consent timestamps
    const { data: client, error: clientError } = await supabase
        .from("clients")
        .upsert(
            {
                coach_id: coach.id,
                full_name,
                whatsapp_number,
                email,
                age,
                primary_goal,
                health_notes,
                status: "active",
                consent_data_at: consentTimestamp,
                consent_health_at: consentTimestamp,
                consent_whatsapp_at: consentTimestamp,
            },
            { onConflict: "whatsapp_number, coach_id" }
        )
        .select("id")
        .single();

    if (clientError || !client) {
        logError(
            "Failed to create or upsert client during intake",
            String(clientError)
        );
        // Clean up orphaned enrollment
        await supabase.from("enrollments").delete().eq("id", enrollment.id);
        return NextResponse.json(
            { error: "Failed to process client information" },
            { status: 500 }
        );
    }

    // Link client to enrollment
    const { error: updateError } = await supabase
        .from("enrollments")
        .update({ client_id: client.id })
        .eq("id", enrollment.id);

    if (updateError) {
        logError(
            "Failed to link client to enrollment",
            `enrollmentId: ${enrollment.id} clientId: ${client.id} error: ${String(updateError)}`
        );
        // Non-fatal — enrollment and client exist, proceed
    }

    // Send WhatsApp notification to coach
    try {
        await sendWhatsAppMessage({
            phone: coach.whatsapp_number,
            message: `New client payment pending.\n\nClient: ${full_name}\nProgram: ${program.name}\nAmount: ₹${program.price}\n\nThey've confirmed sending payment via UPI. Review and confirm in your Fitosys dashboard.`,
        });
    } catch (err) {
        logError("[Intake] WhatsApp notification failed:", String(err));
    }

    return NextResponse.json({
        success: true,
        enrollmentId: enrollment.id,
        programName: program.name,
        coachName: coach.full_name,
    });
    });
}