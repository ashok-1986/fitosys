import { NextRequest, NextResponse } from "next/server";
import { generateWeeklySummary, SummaryInput } from "@/lib/openrouter";
import { sendCoachWeeklySummary } from "@/lib/whatsapp/templates";

// POST /api/cron/summaries — Generate AI coaching summaries
// Runs every Monday morning for each coach
export async function POST(request: NextRequest) {
    // Verify CRON secret
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { createServiceClient } = await import("@/lib/supabase/server");
    const supabase = await createServiceClient();

    const now = new Date();
    // Calculate last week's range (Sunday–Saturday)
    const weekEnd = new Date(now);
    weekEnd.setDate(now.getDate() - now.getDay()); // Last Saturday = today - today's day
    weekEnd.setDate(weekEnd.getDate() - 1); // Go to previous Saturday
    const weekStart = new Date(weekEnd);
    weekStart.setDate(weekEnd.getDate() - 6); // Previous Sunday

    const weekStartStr = weekStart.toISOString().split("T")[0];
    const weekEndStr = weekEnd.toISOString().split("T")[0];

    // Get all active coaches
    const { data: coaches, error: coachError } = await supabase
        .from("coaches")
        .select("id, full_name, whatsapp_number")
        .eq("status", "active");

    if (coachError || !coaches) {
        return NextResponse.json({ error: "Failed to query coaches" }, { status: 500 });
    }

    let generated = 0;
    let errors = 0;

    for (const coach of coaches) {
        try {
            // Check if summary already exists for this week
            const { data: existing } = await supabase
                .from("ai_summaries")
                .select("id")
                .eq("coach_id", coach.id)
                .eq("week_start_date", weekStartStr)
                .limit(1)
                .maybeSingle();

            if (existing) continue; // Already generated

            // Get total active clients
            const { count: totalClients } = await supabase
                .from("clients")
                .select("id", { count: "exact", head: true })
                .eq("coach_id", coach.id)
                .eq("status", "active");

            // Get check-ins for this week
            const { data: checkins } = await supabase
                .from("checkins")
                .select("*, clients(full_name)")
                .eq("coach_id", coach.id)
                .gte("check_date", weekStartStr)
                .lte("check_date", weekEndStr);

            if (!checkins || checkins.length === 0) continue;

            // Separate responders and non-responders
            const responded = checkins
                .filter((c) => c.responded_at)
                .map((c) => ({
                    client_name: (c.clients as unknown as { full_name: string })?.full_name || "Unknown",
                    weight: c.weight_kg ? `${c.weight_kg} kg` : undefined,
                    sessions: c.sessions_completed ?? undefined,
                    energy_score: c.energy_score ?? undefined,
                    notes: c.notes || undefined,
                }));

            const nonResponders = checkins
                .filter((c) => !c.responded_at)
                .map((c) => (c.clients as unknown as { full_name: string })?.full_name || "Unknown");

            // Build summary input
            const summaryInput: SummaryInput = {
                coach_name: coach.full_name,
                week_ending: weekEndStr,
                total_active_clients: totalClients || 0,
                responded_clients: responded,
                non_responder_names: nonResponders,
            };

            // Generate AI summary
            const summaryText = await generateWeeklySummary(summaryInput);

            // Calculate average energy score
            const energyScores = responded
                .filter((r) => r.energy_score !== undefined)
                .map((r) => r.energy_score!);
            const avgEnergy = energyScores.length > 0
                ? energyScores.reduce((a, b) => a + b, 0) / energyScores.length
                : null;

            // Save summary
            await supabase.from("ai_summaries").insert({
                coach_id: coach.id,
                week_start_date: weekStartStr,
                week_end_date: weekEndStr,
                summary_text: summaryText,
                total_clients: totalClients || 0,
                responded_count: responded.length,
                avg_energy_score: avgEnergy ? Math.round(avgEnergy * 10) / 10 : null,
                delivered_to_coach: false,
            });

            // Send via WhatsApp
            await sendCoachWeeklySummary(
                coach.whatsapp_number,
                coach.full_name.split(" ")[0],
                weekEndStr,
                summaryText
            );

            // Mark as delivered
            await supabase
                .from("ai_summaries")
                .update({ delivered_to_coach: true })
                .eq("coach_id", coach.id)
                .eq("week_start_date", weekStartStr);

            generated++;
            console.log(`[Cron/Summaries] Summary generated for ${coach.full_name}`);
        } catch (err) {
            console.error(`[Cron/Summaries] Error for coach ${coach.full_name}:`, err);
            errors++;
        }
    }

    return NextResponse.json({ generated, errors });
}
