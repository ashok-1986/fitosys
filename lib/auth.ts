import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * Get the authenticated coach's ID from the current session.
 * Returns { coachId, supabase } on success, or { error: NextResponse } on failure.
 */
export async function getAuthenticatedCoach() {
    const supabase = await createClient();
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (error || !user) {
        return {
            coachId: null,
            supabase: null,
            error: NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            ),
        };
    }

    return { coachId: user.id, supabase, error: null };
}
