"use server";

import { createAdminClient } from "@/lib/supabase-server";

export async function submitCheckin(data: {
  coach_id: string;
  client_id: string;
  energy: number;
  sessions: number;
  win: string;
  struggle: string;
}) {
  const supabase = createAdminClient();

  // Determine the current week number for this client's active enrollment
  const { data: enrollment } = await supabase
    .from("enrollments")
    .select("id, start_date")
    .eq("client_id", data.client_id)
    .eq("status", "active")
    .single();

  let weekNumber = 1;
  const enrollmentId = enrollment?.id || null;

  if (enrollment?.start_date) {
    const start = new Date(enrollment.start_date).getTime();
    const now = new Date().getTime();
    const diffWeeks = Math.floor((now - start) / (1000 * 60 * 60 * 24 * 7));
    weekNumber = diffWeeks + 1;
  }

  // Insert the checkin
  const { error } = await supabase
    .from("checkins")
    .insert({
      coach_id: data.coach_id,
      client_id: data.client_id,
      enrollment_id: enrollmentId,
      week_number: Math.max(1, weekNumber),
      check_date: new Date().toISOString(),
      energy_score: data.energy,
      sessions_completed: data.sessions,
      notes: `Win: ${data.win}\n\nStruggle: ${data.struggle}`,
      responded_at: new Date().toISOString()
    });

  if (error) {
    console.error("Failed to save checkin:", error);
    return { success: false, error: error.message };
  }

  return { success: true };
}
