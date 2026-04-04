"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";

interface ClientListItem {
  id: string;
  full_name: string;
  whatsapp_number: string;
  status: string;
  program_name: string | null;
  start_date: string | null;
  end_date: string | null;
  last_checkin_date: string | null;
  energy_score: number | null;
}

const GRADIENTS = [
  "linear-gradient(135deg,#7f0000,#c00)",
  "linear-gradient(135deg,#003366,#0055a5)",
  "linear-gradient(135deg,#1a472a,#2d6a4f)",
  "linear-gradient(135deg,#4a1942,#7b2d8b)",
  "linear-gradient(135deg,#7d4e00,#b87300)",
];

export default function ClientsPage() {
  const router = useRouter();
  const [clients, setClients] = useState<ClientListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'payment_pending' | 'renewal_due'>('all');

  const fetchClients = useCallback(async (currentSearch: string, currentFilter: string) => {
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      if (currentFilter !== 'all') qs.append('status', currentFilter);
      if (currentSearch) qs.append('search', currentSearch);

      const res = await fetch(`/api/clients?${qs.toString()}`);
      if (!res.ok) throw new Error("Failed to fetch clients");
      const data = await res.json();
      setClients(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchClients(search, statusFilter);
    }, 400);
    return () => clearTimeout(timeoutId);
  }, [search, statusFilter, fetchClients]);

  const getEnergyColor = (score: number | null) => {
    if (score === null) return "#888888";
    if (score <= 4) return "#EF4444";
    if (score <= 7) return "#F59E0B";
    return "#10B981";
  };

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

  const formatDaysAgo = (dateStr: string | null) => {
    if (!dateStr) return "Never";
    const diff = new Date().getTime() - new Date(dateStr).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "1 day ago";
    return `${days} days ago`;
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100%", padding: "20px", gap: "16px" }}>

      {/* Top bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: "24px", fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.02em", color: "white", margin: 0 }}>Clients</h1>
        <span style={{ fontSize: "13px", color: "#888888" }}>{clients.length} clients</span>
      </div>

      {/* Search bar */}
      <div style={{ position: "relative" }}>
        <Search style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", width: "14px", height: "14px", color: "#888888" }} />
        <input
          type="text"
          placeholder="Search by name or number..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: "100%", background: "#111111", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "10px 14px 10px 36px", fontSize: "14px", color: "white", outline: "none", transition: "border-color 0.2s" }}
          onFocus={(e) => e.target.style.borderColor = "rgba(232,0,29,0.4)"}
          onBlur={(e) => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
        />
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: "16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        {(['all', 'active', 'inactive', 'payment_pending', 'renewal_due'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setStatusFilter(tab)}
            style={{
              padding: "6px 14px 10px",
              background: "transparent",
              border: "none",
              borderBottom: statusFilter === tab ? "2px solid #E8001D" : "2px solid transparent",
              color: statusFilter === tab ? "#E8001D" : "#888888",
              fontSize: "12px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s"
            }}
          >
            {tab === 'all' ? 'All' : tab === 'active' ? 'Active' : tab === 'inactive' ? 'Inactive' : tab === 'payment_pending' ? 'Pending Payment' : 'Renewal Due'}
          </button>
        ))}
      </div>

      {/* Table area */}
      <div style={{ flex: 1, background: "#111111", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "10px", overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr 1fr 1fr", backgroundColor: "#111111", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          {['NAME', 'PROGRAM', 'ENROLLED', 'ENDS', 'LAST CHECK-IN', 'ENERGY', 'STATUS'].map(col => (
            <div key={col} style={{ fontSize: "10px", fontWeight: 700, color: "#888888", textTransform: "uppercase", letterSpacing: "0.08em", padding: "10px 16px", textAlign: "left" }}>
              {col}
            </div>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: "60px", display: "flex", justifyContent: "center" }}>
            <Loader2 style={{ color: "#E8001D", width: "24px", height: "24px" }} className="animate-spin" />
          </div>
        ) : clients.length === 0 ? (
          <div style={{ padding: "60px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "13px", color: "#888888" }}>No clients found</span>
            <span style={{ fontSize: "12px", color: "#444444" }}>Share your onboarding link to enroll your first client</span>
          </div>
        ) : (
          <div>
            {clients.map((client, i) => (
              <div
                key={client.id}
                onClick={() => router.push(`/dashboard/clients/${client.id}`)}
                style={{ display: "grid", gridTemplateColumns: "2fr 1.5fr 1fr 1fr 1fr 1fr 1fr", alignItems: "center", padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.04)", cursor: "pointer", transition: "background 0.2s" }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.02)"}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "transparent"}
              >
                {/* NAME cell */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: GRADIENTS[i % GRADIENTS.length], display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: 700, color: "white", flexShrink: 0 }}>
                    {client.full_name.trim().split(/\s+/).filter(Boolean).map(n => n[0]).join("").toUpperCase().slice(0, 2) || "?"}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "white" }}>{client.full_name}</span>
                    <span style={{ fontSize: "11px", color: "#888888" }}>{client.whatsapp_number}</span>
                  </div>
                </div>

                {/* PROGRAM cell */}
                <div style={{ fontSize: "12px", color: "#C8C8C8" }}>{client.program_name || "—"}</div>

                {/* ENROLLED cell */}
                <div style={{ fontSize: "12px", color: "#888888" }}>{formatDate(client.start_date)}</div>

                {/* ENDS cell */}
                <div style={{ fontSize: "12px", color: "#888888" }}>{formatDate(client.end_date)}</div>

                {/* LAST CHECK-IN cell */}
                <div style={{ fontSize: "12px", color: "#888888" }}>{formatDaysAgo(client.last_checkin_date)}</div>

                {/* ENERGY cell */}
                <div style={{ fontSize: "13px", fontWeight: 700, color: getEnergyColor(client.energy_score) }}>
                  {client.energy_score !== null ? `${client.energy_score}/10` : "—"}
                </div>

                {/* STATUS cell */}
                <div>{getStatusBadge(client.status)}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
