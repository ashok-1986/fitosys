import { NextRequest, NextResponse } from "next/server";
import { getAuthenticatedCoach } from "@/lib/auth";

export async function GET(request: NextRequest) {
    const { coachId, supabase, error } = await getAuthenticatedCoach();
    if (error) return error;

    try {
        const { searchParams } = new URL(request.url);
        const month = searchParams.get("month"); // Format: YYYY-MM

        let query = supabase!
            .from("gst_invoices")
            .select("*, clients(full_name)")
            .eq("coach_id", coachId!)
            .order("invoice_date", { ascending: false });

        if (month) {
            const startDate = `${month}-01`;
            // Calculate end date of the month
            const [y, m] = month.split('-');
            const endDate = new Date(parseInt(y), parseInt(m), 0).toISOString().split('T')[0];

            query = query
                .gte("invoice_date", startDate)
                .lte("invoice_date", endDate);
        }

        const { data: invoices, error: dbError } = await query;

        if (dbError) {
            console.error("[Invoices API] DB error:", dbError);
            return NextResponse.json({ error: dbError.message }, { status: 500 });
        }

        return NextResponse.json(invoices || []);
    } catch (err) {
        console.error("[Invoices API] Unknown error:", err);
        return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 });
    }
}
