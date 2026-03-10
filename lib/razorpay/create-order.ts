import { getRazorpay } from "./client";

interface CreateOrderParams {
    amount: number; // in rupees (₹1,499 = 1499)
    currency?: string; // default INR
    receipt: string; // your internal enrollment/order ID
    notes?: Record<string, string>;
}

export async function createRazorpayOrder(params: CreateOrderParams) {
    const order = await getRazorpay().orders.create({
        amount: params.amount * 100, // convert rupees to paise
        currency: params.currency ?? "INR",
        receipt: params.receipt,
        notes: params.notes ?? {},
    });

    return order;
}
