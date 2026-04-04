"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import type { Client, CheckIn, Payment } from "@/types/database";

// Assuming Payment interface doesn't strictly exist in database.ts since it wasn't listed, 
// creating a local type to ensure type safety.
interface LocalPayment {
  id: string;
  amount: number;
  currency: string;
  payment_type: string;
  gateway_payment_status: string;
  paid_at: string | null;
  created_at: string;
}

interface ProfileData {
  client: Client;
  enrollment: {
    id: string;
    program_name: string;
    start_date: string;
    end_date: string;
    amount_paid: number;
    status: string;
  } | null;
  checkins: CheckIn[];
  payments: LocalPayment[];
}

export default function ClientProfilePage() {
  const router = useRouter();
  const params = useParams();
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'checkins' | 'payments'>('overview');

  useEffect(() => {
    async function loadData() {
      if (!params?.id) return;
      try {
        const res = await fetch(`/api/clients/${params.id}`);
        if (!res.ok) throw new Error("Failed to fetch client");
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [params?.id]);

  if (loading) {
    return (
      <div style={{ padding: "60px", display: "flex", justifyContent: "center", height: "100%", alignItems: "center" }}>
        <Loader2 style={{ color: "#E8001D", width: "32px", height: "32px" }} className="animate-spin" />
      </div>
    );
  }

  if (!data || !data.client) {
    return (
      <div style={{ padding: "60px", textAlign: "center", color: "#888888", fontSize: "14px" }}>
        Client not found
      </div>
    );
  }

  const { client, enrollment, checkins, payments } = data;

  const getStatusBadge = (status: string) => {
    const style = { fontSize: "10px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", textTransform: "uppercase" as const };
    switch (status) {
      case 'active':
        return <span style={{ ...style, background: "rgba(16,185,129,0.1)", color: "#10B981" }}>Active</span>;
      case 'inactive':
        return <span style={{ ...style, background: "rgba(136,136,136,0.1)", color: "#888888" }}>Inactive</span>;
      case 'payment_pending':
        return <span style={{ ...style, background: "rgba(245,158,11,0.1)", color: "#F59E0B" }}>Pending</span>;
      case 'renewal_due':
        return <span style={{ ...style, background: "rgba(59,130,246,0.1)", color: "#3B82F6" }}>Renewal Due</span>;
      default:
        return <span style={{ ...style, background: "rgba(136,136,136,0.1)", color: "#888888" }}>{status}</span>;
    }
  };

  const getEndDateColor = (dateStr: string | null) => {
    if (!dateStr) return "white";
    const diff = new Date(dateStr).getTime() - new Date().getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days <= 7 && days >= 0) return "#EF4444";
    if (days <= 14 && days >= 0) return "#F59E0B";
    return "white";
  };

  const renderOverview = () => {
    const totalCheckins = checkins.filter(c => c.responded_at).length;
    let avgEnergyVal = "—";
    if (totalCheckins > 0) {
      const validEnergy = checkins.filter(c => typeof c.energy_score === 'number');
      if (validEnergy.length > 0) {
        avgEnergyVal = (validEnergy.reduce((a, b) => a + (b.energy_score as number), 0) / validEnergy.length).toFixed(1);
      }
    }

    // Sessions this month
    const thisMonth = new Date().getMonth();
    const thisYear = new Date().getFullYear();
    const sessionsThisMonth = checkins
      .filter(c => {
        if (!c.check_date) return false;
        const d = new Date(c.check_date);
        return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
      })
      .reduce((a, b) => a + (b.sessions_completed || 0), 0);

    const recentReplies = checkins.filter(c => c.raw_reply).slice(0, 3);
    const last8 = [...checkins].reverse().slice(-8); // Assuming checkins is DESC, reverse to ASC for chart

    return (
      <div style={{ padding: "16px 20px" }}>
        {/* Stats Row */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
          {[
            { label: "TOTAL CHECK-INS", value: totalCheckins },
            { label: "AVG ENERGY", value: avgEnergyVal },
            { label: "SESSIONS THIS MONTH", value: sessionsThisMonth }
          ].map((stat, i) => (
            <div key={i} style={{ flex: 1, background: "#111111", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "16px", textAlign: "center" }}>
              <div style={{ fontSize: "24px", fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 500, color: "white" }}>{stat.value}</div>
              <div style={{ fontSize: "10px", color: "#888888", marginTop: "4px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Energy Trend */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "#888888", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px", marginTop: "20px" }}>Energy Trend</div>
          <div style={{ display: "flex", alignItems: "flex-end", gap: "6px", height: "60px" }}>
            {last8.map((c, i) => {
              const val = c.energy_score || 0;
              let bg = "rgba(255,255,255,0.05)";
              if (val > 0 && val <= 4) bg = "rgba(239,68,68,0.7)";
              else if (val >= 5 && val <= 7) bg = "rgba(245,158,11,0.7)";
              else if (val >= 8) bg = "rgba(16,185,129,0.7)";

              const h = Math.max((val / 10) * 60, 4);
              return (
                <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end" }}>
                  <div style={{ width: "100%", background: bg, height: `${h}px`, transition: "height 0.3s" }} />
                  <div style={{ fontSize: "9px", color: "#888888", marginTop: "4px" }}>Wk {c.week_number}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Replies */}
        <div>
          <div style={{ fontSize: "11px", fontWeight: 700, color: "#888888", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px" }}>Recent Replies</div>
          {recentReplies.length > 0 ? (
            recentReplies.map((r, i) => (
              <div key={i} style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "12px", marginBottom: "8px" }}>
                <div style={{ fontSize: "11px", color: "#888888", marginBottom: "4px" }}>
                  {r.check_date ? new Date(r.check_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : "—"}
                </div>
                <div style={{ fontSize: "13px", color: "#C8C8C8", lineHeight: 1.6 }}>{r.raw_reply}</div>
              </div>
            ))
          ) : (
            <div style={{ fontSize: "13px", color: "#888888" }}>No replies yet.</div>
          )}
        </div>
      </div>
    );
  };

  const renderCheckins = () => {
    return (
      <div style={{ padding: "16px 20px" }}>
        {checkins.length === 0 ? (
          <div style={{ fontSize: "13px", color: "#888888", textAlign: "center", padding: "20px" }}>No check-ins recorded yet</div>
        ) : (
          <div style={{ border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", overflow: "hidden" }}>
            <div style={{ display: "grid", gridTemplateColumns: "0.8fr 1fr 1fr 1fr 2fr 1fr", backgroundColor: "#111111", borderBottom: "1px solid rgba(255,255,255,0.06)", padding: "10px 16px" }}>
              {['WEEK', 'DATE', 'ENERGY', 'SESSIONS', 'REPLY', 'STATUS'].map(col => (
                <div key={col} style={{ fontSize: "10px", fontWeight: 700, color: "#888888", textTransform: "uppercase", letterSpacing: "0.08em", textAlign: "left" }}>{col}</div>
              ))}
            </div>
            <div>
              {checkins.map((c, i) => {
                let energyColor = "#888888";
                if (c.energy_score !== null) {
                  if (c.energy_score <= 4) energyColor = "#EF4444";
                  else if (c.energy_score <= 7) energyColor = "#F59E0B";
                  else energyColor = "#10B981";
                }

                const replyStr = c.raw_reply ? (c.raw_reply.length > 40 ? c.raw_reply.substring(0, 40) + "..." : c.raw_reply) : "No reply";

                return (
                  <div key={c.id} style={{ display: "grid", gridTemplateColumns: "0.8fr 1fr 1fr 1fr 2fr 1fr", alignItems: "center", padding: "12px 16px", borderBottom: i < checkins.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", backgroundColor: "transparent" }}>
                    <div style={{ fontSize: "12px", color: "#888888" }}>Wk {c.week_number}</div>
                    <div style={{ fontSize: "12px", color: "#C8C8C8" }}>{new Date(c.check_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}</div>
                    <div style={{ fontSize: "13px", fontWeight: 700, color: energyColor }}>{c.energy_score !== null && c.energy_score !== undefined ? `${c.energy_score}/10` : "—"}</div>
                    <div style={{ fontSize: "12px", color: "#C8C8C8" }}>{c.sessions_completed ?? "—"}</div>
                    <div style={{ fontSize: "12px", color: "#888888" }}>{replyStr}</div>
                    <div style={{ fontSize: "12px", color: c.responded_at ? "#10B981" : "#888888" }}>{c.responded_at ? "Replied" : "No response"}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderPayments = () => {
    const totalPaid = payments.filter(p => p.gateway_payment_status === 'captured').reduce((a, b) => a + Number(b.amount), 0);

    return (
      <div style={{ padding: "16px 20px" }}>
        {payments.length === 0 ? (
          <div style={{ fontSize: "13px", color: "#888888", textAlign: "center", padding: "20px" }}>No payments recorded yet</div>
        ) : (
          <>
            {payments.map(p => {
              const statusColor = p.gateway_payment_status === 'captured' ? '#10B981' : p.gateway_payment_status === 'failed' ? '#EF4444' : '#888888';
              const isRenewal = p.payment_type === 'renewal';
              return (
                <div key={p.id} style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "14px 16px", marginBottom: "8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <span style={{ fontSize: "10px", fontWeight: 700, padding: "3px 10px", borderRadius: "20px", textTransform: "uppercase", background: isRenewal ? "rgba(245,158,11,0.1)" : "rgba(16,185,129,0.1)", color: isRenewal ? "#F59E0B" : "#10B981" }}>
                      {isRenewal ? "Renewal" : "New"}
                    </span>
                    <div style={{ fontSize: "11px", color: "#888888", marginTop: "4px" }}>
                      {p.paid_at ? new Date(p.paid_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : new Date(p.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "16px", fontWeight: 700, color: "white" }}>₹{Number(p.amount).toLocaleString('en-IN')}</div>
                    <div style={{ fontSize: "10px", color: statusColor, marginTop: "2px", textTransform: "uppercase" }}>{p.gateway_payment_status || "unknown"}</div>
                  </div>
                </div>
              );
            })}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "12px", marginTop: "4px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: "13px", color: "#888888" }}>Total Paid</div>
              <div style={{ fontSize: "16px", fontWeight: 700, color: "white" }}>₹{totalPaid.toLocaleString('en-IN')}</div>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflowY: "auto" }}>
      {/* Back Button */}
      <a onClick={() => router.push('/dashboard/clients')} style={{ padding: "16px 20px", fontSize: "13px", color: "#888888", cursor: "pointer", display: "block" }}>
        ← Clients
      </a>

      {/* Header Card */}
      <div style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", padding: "20px", margin: "0 20px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#E8001D", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: 700, color: "white" }}>
              {client.full_name.trim().split(/\s+/).filter(Boolean).map(n => n[0]).join("").toUpperCase().slice(0, 2) || "?"}
            </div>
            <div>
              <div style={{ fontSize: "18px", fontWeight: 600, color: "white", fontFamily: '"Barlow Condensed", sans-serif', textTransform: "uppercase" }}>{client.full_name}</div>
              <div style={{ fontSize: "13px", color: "#888888", marginTop: "2px" }}>{enrollment?.program_name || "No active program"}</div>
            </div>
          </div>
          <div>{getStatusBadge(client.status)}</div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: "16px", paddingTop: "16px" }}>
          <div>
            <div style={{ fontSize: "10px", color: "#888888", textTransform: "uppercase", marginBottom: "4px" }}>WhatsApp</div>
            <div style={{ fontSize: "13px", color: "white" }}>{client.whatsapp_number}</div>
          </div>
          <div>
            <div style={{ fontSize: "10px", color: "#888888", textTransform: "uppercase", marginBottom: "4px" }}>Email</div>
            <div style={{ fontSize: "13px", color: "white" }}>{client.email || "—"}</div>
          </div>
          <div>
            <div style={{ fontSize: "10px", color: "#888888", textTransform: "uppercase", marginBottom: "4px" }}>Primary Goal</div>
            <div style={{ fontSize: "13px", color: "white" }}>{client.primary_goal || "Not set"}</div>
          </div>
        </div>

        {enrollment && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", borderTop: "1px solid rgba(255,255,255,0.06)", marginTop: "12px", paddingTop: "12px" }}>
            <div>
              <div style={{ fontSize: "10px", color: "#888888", textTransform: "uppercase", marginBottom: "4px" }}>Started</div>
              <div style={{ fontSize: "13px", color: "white" }}>{new Date(enrollment.start_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
            </div>
            <div>
              <div style={{ fontSize: "10px", color: "#888888", textTransform: "uppercase", marginBottom: "4px" }}>Ends</div>
              <div style={{ fontSize: "13px", color: getEndDateColor(enrollment.end_date) }}>{new Date(enrollment.end_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
            </div>
          </div>
        )}
      </div>

      {/* Tab Bar */}
      <div style={{ display: "flex", gap: "16px", paddingLeft: "20px", borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: "0" }}>
        {(['overview', 'checkins', 'payments'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "6px 14px 10px",
              background: "transparent",
              border: "none",
              borderBottom: activeTab === tab ? "2px solid #E8001D" : "2px solid transparent",
              color: activeTab === tab ? "#E8001D" : "#888888",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            {tab === 'overview' ? 'Overview' : tab === 'checkins' ? 'Check-in History' : 'Payment History'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ flex: 1 }}>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'checkins' && renderCheckins()}
        {activeTab === 'payments' && renderPayments()}
      </div>
    </div>
  );
}
