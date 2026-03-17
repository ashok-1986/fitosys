"use client";

import { Calendar } from "@/components/dashboard/calendar";
import { TaskOverview } from "@/components/dashboard/task-overview";
import { PendingActions } from "@/components/dashboard/pending-actions";
import { LatestUpdates } from "@/components/dashboard/latest-updates";
import { PillBarChart } from "@/components/dashboard/pill-bar-chart";
import { useDashboard } from "@/hooks/use-dashboard";
import { Loader2, TrendingUp, Users, RefreshCw, IndianRupee } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
  }).format(amount);
};

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
      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 col-span-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display">{formatCurrency(data?.stats.total_revenue || 0)}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display">{formatCurrency(data?.stats.mrr || 0)}</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display">+{data?.stats.active_clients || 0}</div>
            <p className="text-xs text-muted-foreground">Currently enrolled</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Renewals Due</CardTitle>
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-display">{data?.stats.renewals_due || 0}</div>
            <p className="text-xs text-muted-foreground">In the next 7 days</p>
          </CardContent>
        </Card>
      </div>

      {/* Left column - Calendar + Task Overview */}
      <div className="left-col">
        <Calendar />
        <TaskOverview
          tasks={data?.programs?.map((program) => ({
            id: program.id,
            name: program.name,
            icon: "onboarding" as const,
            clients: [],
            additionalCount: program.active_enrollments || 0,
          })) || []}
        />
      </div>

      {/* Right column - Top: Pending Actions */}
      <div className="right-top">
        <PendingActions actions={data?.pending_tasks} />
      </div>

      {/* Right column - Bottom: 2-panel row */}
      <div className="grid md:grid-cols-2 gap-4 col-span-2">
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
        <PillBarChart
          weekData={data?.chart_data.week}
          title="Check-in Rate"
          subtitle="Weekly client responses"
        />
      </div>
    </div>
  );
}
