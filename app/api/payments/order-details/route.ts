import { NextRequest, NextResponse } from "next/server";
import { getRazorpay } from "@/lib/razorpay/client";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get("order");

    if (!orderId) {
        return NextResponse.json(
            { error: "Missing order parameter" },
            { status: 400 }
        );
    }

    try {
        const razorpay = getRazorpay();
        const order = await razorpay.orders.fetch(orderId);

        return NextResponse.json({
            orderId: order.id,
            amount: order.amount,
            currency: order.currency,
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        });
    } catch (err) {
        console.error("[Order Details] Fetch error:", err);
        return NextResponse.json(
            { error: "Failed to fetch order details" },
            { status: 500 }
        );
    }
}
