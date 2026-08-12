"use client";

import { useEffect, useState } from "react";
import { Loader2, Brain, ChevronDown } from "lucide-react";

interface AIWeeklySummary {
  id: string;
  summary_text: string;
  week_start_date: string;
  week_end_date: string;
  total_clients: number;
  responded_count: number;
  avg_energy_score: number | null;
  generated_at: string;
}

interface NonResponder {
  id: string;
  full_name: string;
  whatsapp_number: string;
}

interface PulseData {
  latest_summary: AIWeeklySummary | null;
  summary_history: AIWeeklySummary[];
  this_week: {
    total_sent: number;
    responded: number;
    response_rate: number;
    avg_energy: number;
  };
  active_clients: number;
  non_responders: NonResponder[];
  weekly_chart: { week: string; rate: number; avg_energy: number }[];
}

const GRADIENTS = [
  "linear-gradient(135deg,#7f0000,#c00)",
  "linear-gradient(135deg,#003366,#0055a5)",
  "linear-gradient(135deg,#1a472a,#2d6a4f)",
  "linear-gradient(135deg,#4a1942,#7b2d8b)",
  "linear-gradient(135deg,#7d4e00,#b87300)",
];

export default function PulsePage() {
  const [data, setData] = useState<PulseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSummaryId, setExpandedSummaryId] = useState<string | null>(null);

  const fetchPulseData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/pulse/data");
      if (!res.ok) throw new Error("Failed to fetch pulse data");
      const json = await res.json();
      setData(json);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPulseData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: "60px" }}>
        <Loader2 style={{ color: "#E8001D", width: "32px", height: "32px" }} className="animate-spin" />
        <div style={{ fontSize: "13px", color: "#C8C8C8", marginTop: "12px" }}>Loading pulse data...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", padding: "60px" }}>
        <div style={{ color: "#EF4444", marginBottom: "16px", fontSize: "14px" }}>{error || "Failed to load data"}</div>
        <button
          onClick={fetchPulseData}
          style={{ background: "#E8001D", color: "white", padding: "8px 20px", borderRadius: "6px", border: "none", cursor: "pointer", fontSize: "14px", fontWeight: 600 }}
        >
          Retry
        </button>
      </div>
    );
  }

  const { this_week, latest_summary, active_clients, non_responders, weekly_chart, summary_history } = data;

  const formatDateShort = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  const formatDateLong = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getRateColor = (rate: number) => {
    if (rate >= 70) return "#10B981";
    if (rate >= 40) return "#F59E0B";
    return "#EF4444";
  };

  const getEnergyColor = (energy: number) => {
    if (energy >= 7) return "#10B981";
    if (energy >= 5) return "#F59E0B";
    return "#EF4444";
  };

  return (
    <div style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "16px", minHeight: "100%", overflowY: "auto" }}>

      {/* SECTION 1: Page title */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: "24px", fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.02em", color: "white", margin: 0 }}>Weekly Pulse</h1>
        <div style={{ fontSize: "11px", color: "#888888" }}>
          {latest_summary ? `Generated ${formatDateLong(latest_summary.generated_at)}` : "No summary yet"}
        </div>
      </div>

      {/* SECTION 2: This Week Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
        {/* Card 1: Response Rate */}
        <div style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "16px", textAlign: "center" }}>
          <div style={{ fontSize: "28px", fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 500, lineHeight: 1, color: getRateColor(this_week.response_rate) }}>
            {this_week.response_rate}%
          </div>
          <div style={{ fontSize: "10px", color: "#888888", marginTop: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>This Week</div>
        </div>

        {/* Card 2: Avg Energy */}
        <div style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "16px", textAlign: "center" }}>
          <div style={{ fontSize: "28px", fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 500, lineHeight: 1, color: this_week.avg_energy > 0 ? getEnergyColor(this_week.avg_energy) : "white" }}>
            {this_week.avg_energy > 0 ? this_week.avg_energy : "—"}
          </div>
          <div style={{ fontSize: "10px", color: "#888888", marginTop: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Avg Energy</div>
        </div>

        {/* Card 3: Clients Sent */}
        <div style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "16px", textAlign: "center" }}>
          <div style={{ fontSize: "28px", fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 500, lineHeight: 1, color: "white" }}>
            {this_week.total_sent}
          </div>
          <div style={{ fontSize: "10px", color: "#888888", marginTop: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Check-ins Sent</div>
        </div>

        {/* Card 4: Active Clients */}
        <div style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "16px", textAlign: "center" }}>
          <div style={{ fontSize: "28px", fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 500, lineHeight: 1, color: "white" }}>
            {active_clients}
          </div>
          <div style={{ fontSize: "10px", color: "#888888", marginTop: "6px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Active Clients</div>
        </div>
      </div>

      {/* SECTION 3: 8-Week Response Rate Chart */}
      <div style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "16px" }}>
        <div style={{ fontSize: "11px", fontWeight: 700, color: "#888888", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px" }}>8-WEEK RESPONSE RATE</div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "80px" }}>
          {weekly_chart.map((d, i) => {
            let bg = "rgba(255,255,255,0.05)";
            if (d.rate >= 70) bg = "rgba(16,185,129,0.7)";
            else if (d.rate >= 40) bg = "rgba(245,158,11,0.7)";
            else if (d.rate > 0) bg = "rgba(239,68,68,0.7)";

            const h = Math.max((d.rate / 100) * 80, d.rate > 0 ? 4 : 2);

            return (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
                <div style={{ fontSize: "9px", color: "#888888", textAlign: "center", marginBottom: "4px" }}>
                  {d.rate > 0 ? `${d.rate}%` : "—"}
                </div>
                <div style={{ width: "100%", background: bg, height: `${h}px`, borderRadius: "4px 4px 0 0" }} />
                <div style={{ fontSize: "9px", color: "#888888", textAlign: "center", marginTop: "6px" }}>{d.week}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 4: Non-Responders This Week */}
      {non_responders.length > 0 && (
        <div style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", overflow: "hidden" }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: "13px", fontWeight: 600, color: "white" }}>No Response This Week</div>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#E8001D" }}>{non_responders.length} clients</div>
          </div>
          <div>
            {non_responders.map((client, i) => (
              <div key={client.id} style={{ padding: "10px 16px", borderBottom: i < non_responders.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none", display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: GRADIENTS[i % GRADIENTS.length], display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: "white", flexShrink: 0 }}>
                  {client.full_name.trim().split(/\s+/).filter(Boolean).map(n => n[0]).join("").toUpperCase().slice(0, 2) || "?"}
                </div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "white", flex: 1 }}>{client.full_name}</div>
                <button
                  onClick={(e) => {
                    const num = client.whatsapp_number.replace(/\D/g, '');
                    if (num.length > 0) {
                      window.open('https://wa.me/' + num, '_blank');
                    } else {
                      e.preventDefault();
                    }
                  }}
                  disabled={client.whatsapp_number.replace(/\D/g, '').length === 0}
                  style={{
                    padding: "5px 12px",
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "6px",
                    fontSize: "11px",
                    fontWeight: 600,
                    color: client.whatsapp_number.replace(/\D/g, '').length === 0 ? "#444444" : "#888888",
                    cursor: client.whatsapp_number.replace(/\D/g, '').length === 0 ? "not-allowed" : "pointer",
                    transition: "all 0.2s"
                  }}
                  onMouseOver={(e) => {
                    if (client.whatsapp_number.replace(/\D/g, '').length > 0) {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
                      e.currentTarget.style.color = "white";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (client.whatsapp_number.replace(/\D/g, '').length > 0) {
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                      e.currentTarget.style.color = "#888888";
                    }
                  }}
                >
                  Message
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 5: Latest AI Summary */}
      <div style={{ background: "#111111", border: "1px solid rgba(232,0,29,0.2)", borderRadius: "10px", overflow: "hidden" }}>
        <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Brain style={{ width: "13px", height: "13px", color: "#E8001D" }} />
            <div style={{ fontSize: "13px", fontWeight: 600, color: "white" }}>AI Weekly Summary</div>
          </div>
          {latest_summary && (
            <div style={{ fontSize: "11px", color: "#888888" }}>
              {formatDateShort(latest_summary.week_start_date)}–{formatDateShort(latest_summary.week_end_date)}
            </div>
          )}
        </div>

        {latest_summary ? (
          <div>
            <div style={{ padding: "16px", fontSize: "13px", color: "#C8C8C8", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
              {latest_summary.summary_text}
            </div>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "12px 16px", display: "flex", justifyContent: "space-between" }}>
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: "16px", fontWeight: 700, color: "white" }}>{latest_summary.responded_count} / {latest_summary.total_clients}</div>
                <div style={{ fontSize: "10px", color: "#888888", marginTop: "3px" }}>Responded</div>
              </div>
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: "16px", fontWeight: 700, color: latest_summary.avg_energy_score && latest_summary.avg_energy_score > 0 ? getEnergyColor(latest_summary.avg_energy_score) : "white" }}>
                  {latest_summary.avg_energy_score ? `${latest_summary.avg_energy_score}/10` : "—"}
                </div>
                <div style={{ fontSize: "10px", color: "#888888", marginTop: "3px" }}>Avg Energy</div>
              </div>
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{ fontSize: "13px", color: "#888888" }}>{formatDateShort(latest_summary.generated_at)}</div>
                <div style={{ fontSize: "10px", color: "#888888", marginTop: "3px" }}>Generated</div>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ padding: "32px", textAlign: "center" }}>
            <div style={{ fontSize: "13px", color: "#888888", marginBottom: "4px" }}>No summary generated yet</div>
            <div style={{ fontSize: "13px", color: "#888888" }}>Your first AI summary arrives every Monday at 7 AM</div>
          </div>
        )}
      </div>

      {/* SECTION 6: Summary History */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        <div style={{ fontSize: "13px", fontWeight: 600, color: "white", marginBottom: "4px" }}>Previous Summaries</div>

        {summary_history.length > 1 ? summary_history.slice(1).map((summary) => {
          const isExpanded = expandedSummaryId === summary.id;
          const rate = summary.total_clients > 0 ? Math.round((summary.responded_count / summary.total_clients) * 100) : 0;
          let badgeBg = "rgba(239,68,68,0.1)";
          let badgeColor = "#EF4444";
          if (rate >= 70) { badgeBg = "rgba(16,185,129,0.1)"; badgeColor = "#10B981"; }
          else if (rate >= 40) { badgeBg = "rgba(245,158,11,0.1)"; badgeColor = "#F59E0B"; }

          return (
            <div key={summary.id} style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", overflow: "hidden" }}>
              <div
                onClick={() => setExpandedSummaryId(isExpanded ? null : summary.id)}
                style={{ padding: "12px 16px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between" }}
              >
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "white" }}>
                    {formatDateShort(summary.week_start_date)}–{formatDateShort(summary.week_end_date)}
                  </div>
                  <div style={{ fontSize: "11px", color: "#888888", marginTop: "3px" }}>
                    {summary.responded_count} of {summary.total_clients} responded · {summary.avg_energy_score ? `${summary.avg_energy_score}/10` : "—"} energy
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ background: badgeBg, color: badgeColor, fontSize: "11px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px" }}>
                    {rate}%
                  </div>
                  <ChevronDown
                    style={{ width: "14px", height: "14px", color: "#888888", transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
                  />
                </div>
              </div>

              {isExpanded && (
                <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "14px 16px", fontSize: "13px", color: "#C8C8C8", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                  {summary.summary_text}
                </div>
              )}
            </div>
          );
        }) : (
          <div style={{ fontSize: "13px", color: "#888888", textAlign: "center", padding: "20px" }}>
            More summaries will appear here each week
          </div>
        )}
      </div>

    </div>
  );
}
