"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { TrendingUp, TrendingDown, Users, Mail, Activity, AlertTriangle } from "lucide-react";
import { NavBar } from "@/components/ui/navigation";

interface PulseData {
  latest_summary: {
    summary_text: string;
    week_start_date: string;
    week_end_date: string;
    total_checkins: number;
    avg_energy: number;
    at_risk_clients: string[];
  } | null;
  response_rate: number;
  avg_energy: number;
  checkins_sent: number;
  renewals_due: number;
  weekly_data: { week: string; rate: number }[];
  clients_at_risk: { id: string; name: string; reason: string }[];
  clients_strong: { id: string; name: string; reason: string }[];
  clients_watch: { id: string; name: string; reason: string }[];
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function WeeklyPulsePage() {
  const [data, setData] = useState<PulseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "at-risk" | "strong" | "watch">("all");

  useEffect(() => {
    fetchPulseData();
  }, []);

  async function fetchPulseData() {
    try {
      const res = await fetch("/api/pulse/data");
      if (!res.ok) {
        throw new Error("Failed to load Weekly Pulse data");
      }
      const result = await res.json();
      setData(result);
      setError(null);
    } catch (err) {
      console.error("Error fetching pulse data:", err);
      setError("Failed to load Weekly Pulse data. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex-1 w-full bg-background text-white font-sans overflow-y-auto pb-24">
        <NavBar title="Weekly Pulse" back="Home" backHref="/dashboard" />
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-brand border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground">Loading Weekly Pulse...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 w-full bg-background text-white font-sans overflow-y-auto pb-24">
        <NavBar title="Weekly Pulse" back="Home" backHref="/dashboard" />
        <div className="p-4">
          <Card className="border-destructive/50">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <AlertTriangle className="h-8 w-8 text-destructive mb-4" />
              <p className="text-sm text-destructive font-medium">{error}</p>
              <Button onClick={fetchPulseData} variant="outline" className="mt-4">
                Retry
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const filteredClients =
    activeTab === "all"
      ? [...(data?.clients_at_risk || []), ...(data?.clients_strong || []), ...(data?.clients_watch || [])]
      : activeTab === "at-risk"
      ? data?.clients_at_risk || []
      : activeTab === "strong"
      ? data?.clients_strong || []
      : data?.clients_watch || [];

  function handleMessage(clientName: string) {
    // In production, fetch client's WhatsApp number from API
    // For now, show a toast/placeholder
    alert(`Opening WhatsApp chat with ${clientName}...`);
    // window.open(`https://wa.me/${clientWhatsapp}`, '_blank');
  }

  return (
    <div className="flex-1 w-full bg-background text-white font-sans overflow-y-auto pb-24">
      <NavBar
        title="Weekly Pulse"
        back="Home"
        backHref="/dashboard"
      />

      {/* AI Summary Card */}
      {data?.latest_summary ? (
        <div className="mx-4 mt-4 mb-6">
          <Card className="bg-gradient-to-br from-brand/10 to-transparent border-brand/20">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-brand" />
                <p className="text-xs font-bold uppercase tracking-widest text-brand">
                  Week of {new Date(data.latest_summary.week_start_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed text-white/80">
                {data.latest_summary.summary_text}
              </p>
              <div className="flex gap-4 mt-4 pt-4 border-t border-brand/10">
                <div>
                  <p className="text-lg font-bold font-barlow">{data.latest_summary.total_checkins}</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider">Check-ins</p>
                </div>
                <div>
                  <p className="text-lg font-bold font-barlow">{data.latest_summary.avg_energy.toFixed(1)}</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider">Avg Energy</p>
                </div>
                <div>
                  <p className="text-lg font-bold font-barlow">{data.latest_summary.at_risk_clients.length}</p>
                  <p className="text-[10px] text-white/40 uppercase tracking-wider">At Risk</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="mx-4 mt-4 mb-6">
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-8">
              <Mail className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">No AI summary yet</p>
              <p className="text-xs text-muted-foreground mt-1">
                Your first summary will arrive Monday at 7 AM
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* 4-Stat Row */}
      <div className="grid grid-cols-4 gap-2 px-4 mb-6">
        <StatCard
          label="Response"
          value={`${data?.response_rate || 0}%`}
          icon={Mail}
          color={data?.response_rate && data.response_rate >= 70 ? "text-[#34C759]" : "text-[#FF9F0A]"}
        />
        <StatCard
          label="Energy"
          value={data?.avg_energy.toFixed(1) || "0.0"}
          icon={Activity}
          color={data?.avg_energy && data.avg_energy >= 7 ? "text-[#34C759]" : "text-[#FF9F0A]"}
        />
        <StatCard
          label="Sent"
          value={data?.checkins_sent || 0}
          icon={TrendingUp}
          color="text-white"
        />
        <StatCard
          label="Renewals"
          value={data?.renewals_due || 0}
          icon={AlertTriangle}
          color={data?.renewals_due && data.renewals_due > 0 ? "text-[#F20000]" : "text-white/40"}
        />
      </div>

      {/* 8-Week Response Rate Chart */}
      <div className="mx-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/40">
              Response Rate — 8 Weeks
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex gap-1 items-end h-[80px]">
              {data?.weekly_data.map((d, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                  <div
                    className="w-full rounded-sm transition-all duration-300"
                    style={{
                      height: `${d.rate}%`,
                      background: d.rate >= 70
                        ? "linear-gradient(180deg, #34C759, #34C75988)"
                        : d.rate >= 40
                        ? "linear-gradient(180deg, #FF9F0A, #FF9F0A88)"
                        : "linear-gradient(180deg, #F20000, #F2000088)",
                    }}
                  />
                  <span className="text-[8px] text-white/40 font-medium uppercase">{d.week}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Client Flags */}
      <div className="mx-4 mb-6">
        <div className="flex gap-2 mb-4 overflow-x-auto">
          <FilterChip label="All" count={filteredClients.length} active={activeTab === "all"} onClick={() => setActiveTab("all")} />
          <FilterChip label="⚠ At Risk" count={data?.clients_at_risk.length || 0} active={activeTab === "at-risk"} onClick={() => setActiveTab("at-risk")} />
          <FilterChip label="✅ Strong" count={data?.clients_strong.length || 0} active={activeTab === "strong"} onClick={() => setActiveTab("strong")} />
          <FilterChip label="👀 Watch" count={data?.clients_watch.length || 0} active={activeTab === "watch"} onClick={() => setActiveTab("watch")} />
        </div>

        <Card>
          <CardContent className="py-4">
            {filteredClients.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No clients in this category
              </p>
            ) : (
              <div className="space-y-3">
                {filteredClients.map((client) => (
                  <div key={client.id} className="flex items-center gap-3">
                    <Avatar size="sm">
                      <AvatarFallback className="text-xs font-semibold">
                        {getInitials(client.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{client.name}</p>
                      <p className="text-xs text-muted-foreground">{client.reason}</p>
                    </div>
                    <Button size="sm" variant="outline" className="text-xs" onClick={() => handleMessage(client.name)}>
                      Message
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string | number; icon: any; color: string }) {
  return (
    <div className="bg-[#1C1C1E] border border-white/5 rounded-xl p-3 text-center">
      <Icon className={`h-4 w-4 mx-auto mb-1 ${color}`} />
      <p className={`text-lg font-bold font-barlow ${color}`}>{value}</p>
      <p className="text-[9px] text-white/40 uppercase tracking-wider">{label}</p>
    </div>
  );
}

function FilterChip({ label, count, active, onClick }: { label: string; count: number; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
        active
          ? "bg-brand text-white"
          : "bg-[#1C1C1E] text-white/60 hover:text-white"
      }`}
    >
      {label} ({count})
    </button>
  );
}
