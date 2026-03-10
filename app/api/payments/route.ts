import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedCoach } from "@/lib/auth";
import { createRazorpayOrder } from "@/lib/razorpay/create-order";

// GET /api/payments — List payments with optional date filter
export async function GET(request: NextRequest) {
    const { coachId, supabase, error } = await getAuthenticatedCoach();
    if (error) return error;

    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    let query = supabase!
        .from("payments")
        .select("*, clients(full_name), enrollments(programs(name))")
        .eq("coach_id", coachId!)
        .order("paid_at", { ascending: false });

    if (from) {
        query = query.gte("paid_at", from);
    }
    if (to) {
        query = query.lte("paid_at", to);
    }

    const { data, error: dbError } = await query;

    if (dbError) {
        return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

// POST /api/payments — Generate Razorpay payment link for a client renewal
export async function POST(request: NextRequest) {
    const { coachId, supabase, error } = await getAuthenticatedCoach();
    if (error) return error;

    const body = await request.json();
    const { client_id, program_id, payment_type } = body;

    if (!client_id || !program_id) {
        return NextResponse.json(
            { error: "client_id and program_id are required" },
            { status: 400 }
        );
    }

    // Get client and program details
    const [clientResult, programResult] = await Promise.all([
        supabase!
            .from("clients")
            .select("full_name, email")
            .eq("id", client_id)
            .eq("coach_id", coachId!)
            .single(),
        supabase!
            .from("programs")
            .select("name, price, currency")
            .eq("id", program_id)
            .eq("coach_id", coachId!)
            .single(),
    ]);

    if (!clientResult.data || !programResult.data) {
        return NextResponse.json(
            { error: "Client or program not found" },
            { status: 404 }
        );
    }

    try {
        // Create Razorpay order for the renewal
        const order = await createRazorpayOrder({
            amount: programResult.data.price,
            currency: programResult.data.currency ?? "INR",
            receipt: `renewal_${client_id}_${Date.now()}`,
            notes: {
                coach_id: coachId!,
                client_id,
                program_id,
                payment_type: payment_type || "renewal",
                client_name: clientResult.data.full_name,
            },
        });

        return NextResponse.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        });
    } catch (err) {
        console.error("[Razorpay] Create renewal order error:", err);
        return NextResponse.json(
            { error: "Failed to create payment order" },
            { status: 500 }
        );
    }
}
