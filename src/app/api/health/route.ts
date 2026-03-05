import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        razorpay_configured: !!process.env.RAZORPAY_KEY_ID,
        gemini_configured: !!process.env.GEMINI_API_KEY,
        supabase_configured: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        whatsapp_configured: !!process.env.WHATSAPP_API_TOKEN,
    });
}
