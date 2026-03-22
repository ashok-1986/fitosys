"use client";

import { useDashboard } from "@/hooks/use-dashboard";
import { Loader2, TrendingUp, Users, RefreshCw, IndianRupee, AlertTriangle, Brain } from "lucide-react";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", minimumFractionDigits: 0 }).format(amount);

const GRADIENTS = [
  "linear-gradient(135deg,#7f0000,#c00)",
  "linear-gradient(135deg,#003366,#0055a5)",
  "linear-gradient(135deg,#1a472a,#2d6a4f)",
  "linear-gradient(135deg,#4a1942,#7b2d8b)",
  "linear-gradient(135deg,#7d4e00,#b87300)",
];

export default function DashboardPage() {
  const { data, loading, error, refetch } = useDashboard();

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "400px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
          <Loader2 style={{ width: "28px", height: "28px", color: "#E8001D" }} className="animate-spin" />
          <p style={{ fontSize: "13px", color: "#A0A0A0" }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", minHeight: "400px" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
          <p style={{ fontSize: "13px", color: "#EF4444" }}>{error}</p>
          <button onClick={() => refetch()} style={{ padding: "8px 16px", background: "#E8001D", color: "#fff", border: "none", borderRadius: "7px", fontSize: "13px", cursor: "pointer" }}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const stats = data?.stats;
  const renewals = data?.renewals || [];
  const recentUpdates = data?.recent_updates || [];
  const pendingTasks = data?.pending_tasks || [];
  const chartData = data?.chart_data?.week || [];
  const aiSummary = data?.ai_summary;
  const maxChartValue = Math.max(...chartData.map(d => d.value), 1);

  return (
    <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px", minHeight: "100%" }}>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
        {[
          { label: "Total Revenue", value: formatCurrency(stats?.total_revenue || 0), sub: "All time", icon: TrendingUp },
          { label: "Monthly Revenue", value: formatCurrency(stats?.mrr || 0), sub: "This month", icon: IndianRupee },
          { label: "Active Clients", value: `${stats?.active_clients || 0}`, sub: "Currently enrolled", icon: Users },
          { label: "Renewals Due", value: `${stats?.renewals_due || 0}`, sub: "In the next 7 days", icon: RefreshCw },
        ].map((kpi, i) => (
          <div key={i} style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "18px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
              <span style={{ fontSize: "12px", fontWeight: 600, color: "#FFFFFF" }}>{kpi.label}</span>
              <kpi.icon style={{ width: "14px", height: "14px", color: "#444444" }} />
            </div>
            <div style={{ fontSize: "22px", fontWeight: 700, color: "#FFFFFF", lineHeight: 1 }}>{kpi.value}</div>
            <div style={{ fontSize: "11px", color: "#A0A0A0", marginTop: "4px" }}>{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "16px", alignItems: "start" }}>

        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* Clients needing attention */}
          <div style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px 10px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#FFFFFF" }}>Clients needing attention</span>
              <AlertTriangle style={{ width: "13px", height: "13px", color: "#F59E0B" }} />
            </div>
            {renewals.length === 0 ? (
              <div style={{ padding: "24px 16px", textAlign: "center", color: "#444444", fontSize: "13px" }}>No clients need attention right now</div>
            ) : (
              renewals.slice(0, 4).map((r, i) => (
                <div key={r.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", borderBottom: i < Math.min(renewals.length, 4) - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                  <div>
                    <div style={{ fontSize: "13px", fontWeight: 600, color: "#FFFFFF" }}>{r.client_name}</div>
                    <div style={{ fontSize: "11px", color: "#A0A0A0", marginTop: "2px" }}>{r.program} — ends {r.end_date}</div>
                  </div>
                  <span style={{ fontSize: "11px", fontWeight: 700, color: r.days_remaining <= 3 ? "#EF4444" : "#F59E0B", background: r.days_remaining <= 3 ? "rgba(239,68,68,0.1)" : "rgba(245,158,11,0.1)", padding: "3px 10px", borderRadius: "20px" }}>
                    {r.days_remaining}d left
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Recent check-in replies */}
          <div style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px 10px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#FFFFFF" }}>Recent check-in replies</span>
              <span style={{ fontSize: "11px", color: "#E8001D", fontWeight: 600, cursor: "pointer" }}>View all</span>
            </div>
            {recentUpdates.length === 0 ? (
              <div style={{ padding: "24px 16px", textAlign: "center", color: "#444444", fontSize: "13px" }}>No check-in replies yet this week</div>
            ) : (
              recentUpdates.map((u, i) => (
                <div key={u.id} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 16px", borderBottom: i < recentUpdates.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", cursor: "pointer" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: GRADIENTS[i % GRADIENTS.length], display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                    {u.client_initials}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "12px", color: "#A0A0A0" }}><strong style={{ color: "#FFFFFF" }}>{u.client_name}</strong> · {u.program_name}</div>
                    <div style={{ fontSize: "12px", color: "#A0A0A0", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{u.message}</div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Check-in rate chart */}
          <div style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px 8px" }}>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#FFFFFF" }}>Check-in Rate</div>
                <div style={{ fontSize: "11px", color: "#A0A0A0", marginTop: "2px" }}>Weekly client responses</div>
              </div>
              <span style={{ fontSize: "11px", color: "#A0A0A0" }}>Avg: <strong style={{ color: "#FFFFFF" }}>{data?.chart_data?.average || 0}%</strong></span>
            </div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", padding: "8px 16px 16px", height: "120px" }}>
              {chartData.map((d, i) => (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", height: "100%", justifyContent: "flex-end" }}>
                  <span style={{ fontSize: "10px", color: "#A0A0A0" }}>{d.value}%</span>
                  <div style={{ width: "100%", background: "#1A1A1A", borderRadius: "99px", overflow: "hidden", height: "80px", position: "relative" }}>
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "#E8001D", opacity: d.value > 0 ? 0.8 : 0.1, height: `${Math.round((d.value / maxChartValue) * 100)}%`, borderRadius: "99px", transition: "height 0.6s ease" }} />
                  </div>
                  <span style={{ fontSize: "10px", color: "#444444", textTransform: "uppercase", letterSpacing: "0.04em" }}>{d.label.slice(0, 3)}</span>
                </div>
              ))}
            </div>
            <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", margin: "0 16px" }} />
            <div style={{ display: "flex", alignItems: "center", gap: "6px", padding: "10px 16px" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", border: "2px solid #E8001D" }} />
              <span style={{ fontSize: "11px", color: "#A0A0A0" }}>Clients checked in</span>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          {/* AI Summary */}
          <div style={{ background: "#111111", border: "1px solid rgba(232,0,29,0.2)", borderRadius: "10px", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px 10px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <Brain style={{ width: "13px", height: "13px", color: "#E8001D" }} />
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#FFFFFF" }}>AI Weekly Summary</span>
            </div>
            {aiSummary ? (
              <div style={{ padding: "14px 16px" }}>
                <p style={{ fontSize: "12px", color: "#A0A0A0", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{aiSummary.summary_text.slice(0, 300)}{aiSummary.summary_text.length > 300 ? "..." : ""}</p>
                <div style={{ display: "flex", gap: "12px", marginTop: "12px", paddingTop: "12px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <div>
                    <div style={{ fontSize: "16px", fontWeight: 700, color: "#FFFFFF" }}>{aiSummary.responded_count}/{aiSummary.total_clients}</div>
                    <div style={{ fontSize: "10px", color: "#A0A0A0" }}>Responded</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "16px", fontWeight: 700, color: "#FFFFFF" }}>{aiSummary.avg_energy_score}/10</div>
                    <div style={{ fontSize: "10px", color: "#A0A0A0" }}>Avg Energy</div>
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ padding: "24px 16px", textAlign: "center", color: "#444444", fontSize: "12px", lineHeight: 1.6 }}>
                No summary yet.<br />Generated every Monday at 7 AM.
              </div>
            )}
          </div>

          {/* Renewals due */}
          <div style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px 10px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#FFFFFF" }}>Renewals this week</span>
              <RefreshCw style={{ width: "13px", height: "13px", color: "#A0A0A0" }} />
            </div>
            {renewals.length === 0 ? (
              <div style={{ padding: "20px 16px", textAlign: "center", color: "#444444", fontSize: "12px" }}>No renewals due this week</div>
            ) : (
              renewals.map((r, i) => (
                <div key={r.id} style={{ padding: "10px 16px", borderBottom: i < renewals.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "#FFFFFF" }}>{r.client_name}</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "4px" }}>
                    <span style={{ fontSize: "11px", color: "#A0A0A0" }}>{r.program}</span>
                    <span style={{ fontSize: "11px", fontWeight: 700, color: r.days_remaining <= 3 ? "#EF4444" : "#F59E0B" }}>{r.days_remaining}d</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pending actions */}
          <div style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", overflow: "hidden" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px 10px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ fontSize: "13px", fontWeight: 600, color: "#FFFFFF" }}>Pending actions</span>
            </div>
            {pendingTasks.length === 0 ? (
              <div style={{ padding: "20px 16px", textAlign: "center", color: "#444444", fontSize: "12px" }}>All clear for today</div>
            ) : (
              pendingTasks.map((task, i) => (
                <div key={task.id} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 16px", borderBottom: i < pendingTasks.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                  <div style={{ width: "16px", height: "16px", borderRadius: "4px", border: "1.5px solid rgba(255,255,255,0.1)", flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: "12px", color: "#A0A0A0", lineHeight: 1.4 }}>{task.text}</span>
                  <span style={{ fontSize: "10px", fontWeight: 700, color: task.due === "today" ? "#E8001D" : "#F59E0B", flexShrink: 0 }}>
                    {task.due === "today" ? "Today" : `${task.daysUntil}d`}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}