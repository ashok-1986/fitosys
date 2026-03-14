import { NextRequest, NextResponse } from "next/server";
import { getRazorpay } from "@/lib/razorpay/client";
import { logRequest } from "@/lib/loggerHelpers";

// GET /api/renewals/details — Get renewal payment details
// Public endpoint - no auth required (client-facing)
export async function GET(request: NextRequest) {
    logRequest(request, "GET /api/renewals/details");

    const searchParams = request.nextUrl.searchParams;
    const orderId = searchParams.get("order");
    const enrollmentId = searchParams.get("enrollment");

    if (!orderId || !enrollmentId) {
        return NextResponse.json(
            { error: "Order ID and enrollment ID are required" },
            { status: 400 }
        );
    }

    try {
        const { createServiceClient } = await import("@/lib/supabase/server");
        const supabase = await createServiceClient();

        // Fetch order from Razorpay to verify and get details
        const razorpay = getRazorpay();
        const order = await razorpay.orders.fetch(orderId);

        if (!order || order.status === "paid") {
            return NextResponse.json(
                { error: "Invalid or already paid order" },
                { status: 404 }
            );
        }

        // Get enrollment details
        const { data: enrollment, error: enrollError } = await supabase
            .from("enrollments")
            .select(`
                id,
                end_date,
                amount_paid,
                currency,
                clients(full_name),
                programs(name)
            `)
            .eq("id", enrollmentId)
            .eq("status", "active")
            .single();

        if (enrollError || !enrollment) {
            console.error("[Renewal Details] Enrollment fetch error:", enrollError);
            return NextResponse.json(
                { error: "Renewal enrollment not found" },
                { status: 404 }
            );
        }

        // Calculate days remaining
        const now = new Date();
        const endDate = new Date(enrollment.end_date);
        const daysRemaining = Math.ceil(
            (endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
        );

        const client = enrollment.clients as unknown as { full_name: string };
        const program = enrollment.programs as unknown as { name: string };

        return NextResponse.json({
            clientName: client?.full_name || "Client",
            programName: program?.name || "Program",
            amount: Number(order.amount) / 100, // Convert from paise
            currency: order.currency,
            daysRemaining: Math.max(0, daysRemaining),
        });
    } catch (error) {
        console.error("[Renewal Details] Error:", error);
        return NextResponse.json(
            { error: "Failed to load renewal details" },
            { status: 500 }
        );
    }
}
