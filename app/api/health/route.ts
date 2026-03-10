import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        razorpay_configured: !!process.env.RAZORPAY_KEY_ID,
        openrouter_configured: !!process.env.OPENROUTER_API_KEY,
        supabase_configured: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        whatsapp_configured: !!process.env.WHATSAPP_AISENSY_API_KEY,
    });
}
