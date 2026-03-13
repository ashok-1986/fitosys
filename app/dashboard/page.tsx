"use client";

import { Calendar } from "@/components/dashboard/calendar";
import { TaskOverview } from "@/components/dashboard/task-overview";
import { PendingActions } from "@/components/dashboard/pending-actions";
import { LatestUpdates } from "@/components/dashboard/latest-updates";
import { ProgramCard } from "@/components/dashboard/program-card";
import { PillBarChart } from "@/components/dashboard/pill-bar-chart";
import { useDashboard } from "@/hooks/use-dashboard";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { data, loading, error, refetch } = useDashboard();

  if (loading) {
    return (
      <div className="content">
        <div className="flex items-center justify-center full-grid-span">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-brand" />
            <p className="text-sm text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content">
        <div className="flex items-center justify-center full-grid-span">
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-destructive">{error}</p>
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-brand text-white rounded-md text-sm font-medium hover:bg-brand-hover"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="content">
      {/* Left column - Calendar + Task Overview */}
      <div className="left-col">
        <Calendar />
        <TaskOverview
          tasks={data?.programs.map((program) => ({
            id: program.id,
            name: program.name,
            icon: "dumbbell" as const,
            clients: [],
            additionalCount: program.active_enrollments || 0,
          }))}
        />
      </div>

      {/* Right column - Top: Pending Actions */}
      <div className="right-top">
        <PendingActions actions={data?.pending_tasks} />
      </div>

      {/* Right column - Bottom: 3-panel row */}
      <div className="right-bot">
        <LatestUpdates
          updates={data?.recent_updates?.map((u) => ({
            id: u.id,
            clientName: u.client_name,
            clientInitials: u.client_initials,
            programName: u.program_name,
            message: u.message,
            gradient: u.gradient,
          }))}
        />
        <ProgramCard
          programTitle={data?.programs[0]?.name || "No Active Program"}
          programSubtitle={`Batch: ${data?.stats.active_clients || 0} clients`}
          progress={data?.chart_data.average || 0}
        />
        <PillBarChart
          weekData={data?.chart_data.week}
          title="Check-in Rate"
          subtitle="Weekly client responses"
        />
      </div>
    </div>
  );
}
