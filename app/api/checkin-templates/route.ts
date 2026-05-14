import { NextRequest, NextResponse } from 'next/server';
import { requireFeature } from '@/lib/plans/check-feature';

export async function GET(request: NextRequest) {
    const coachId = request.headers.get("x-coach-id"); // Or derived from session
    if (!coachId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await requireFeature(coachId, 'custom_checkin_questions');
        return NextResponse.json({ templates: [] });
    } catch (error: any) {
        if (error instanceof Response) return error;
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
