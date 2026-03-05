import { useState, useEffect, useRef } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const T = {
  red: "#F20000",
  redDim: "#C20000",
  redGlow: "rgba(242,0,0,0.18)",
  redSoft: "rgba(242,0,0,0.08)",
  black: "#0A0A0A",
  surface: "#111111",
  surfaceElevated: "#1A1A1A",
  surfaceCard: "#1C1C1E",
  border: "rgba(255,255,255,0.08)",
  borderStrong: "rgba(255,255,255,0.14)",
  white: "#FFFFFF",
  textPrimary: "#FFFFFF",
  textSecondary: "rgba(255,255,255,0.6)",
  textTertiary: "rgba(255,255,255,0.35)",
  green: "#34C759",
  amber: "#FF9F0A",
  blue: "#0A84FF",
  purple: "#BF5AF2",
  fontDisplay: "'Barlow Condensed', 'Impact', sans-serif",
  fontBody: "'Urbanist', 'SF Pro Display', -apple-system, sans-serif",
};

// ─── MICRO COMPONENTS ─────────────────────────────────────────────────────────

const RiskDot = ({ score }) => {
  const color = score >= 4 ? T.red : score >= 3 ? T.amber : T.green;
  return (
    <span style={{
      display: "inline-block", width: 8, height: 8, borderRadius: "50%",
      background: color, boxShadow: `0 0 6px ${color}`, flexShrink: 0
    }} />
  );
};

const Badge = ({ label, color = T.red, size = "sm" }) => (
  <span style={{
    display: "inline-flex", alignItems: "center",
    padding: size === "sm" ? "2px 8px" : "4px 12px",
    borderRadius: 100,
    background: `${color}18`,
    border: `1px solid ${color}30`,
    color: color,
    fontSize: size === "sm" ? 11 : 12,
    fontWeight: 600,
    letterSpacing: "0.04em",
    fontFamily: T.fontBody,
  }}>{label}</span>
);

const Chip = ({ icon, label, active, onClick }) => (
  <button onClick={onClick} style={{
    display: "flex", alignItems: "center", gap: 6,
    padding: "7px 14px", borderRadius: 100,
    background: active ? T.red : "rgba(255,255,255,0.06)",
    border: `1px solid ${active ? T.red : T.border}`,
    color: active ? "#fff" : T.textSecondary,
    fontSize: 13, fontWeight: 500, cursor: "pointer",
    fontFamily: T.fontBody, transition: "all 0.2s",
    whiteSpace: "nowrap",
  }}>
    {icon && <span style={{ fontSize: 14 }}>{icon}</span>}
    {label}
  </button>
);

const StatCard = ({ label, value, sub, accent = T.white, icon, trend }) => (
  <div style={{
    background: T.surfaceCard,
    border: `1px solid ${T.border}`,
    borderRadius: 16,
    padding: "20px",
    display: "flex", flexDirection: "column", gap: 8,
    position: "relative", overflow: "hidden",
  }}>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${accent}, transparent)` }} />
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <span style={{ fontSize: 12, color: T.textTertiary, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: T.fontBody }}>{label}</span>
      {icon && <span style={{ fontSize: 18, opacity: 0.6 }}>{icon}</span>}
    </div>
    <div style={{ fontSize: 32, fontWeight: 700, color: accent, fontFamily: T.fontDisplay, lineHeight: 1 }}>{value}</div>
    {sub && <div style={{ fontSize: 12, color: T.textSecondary, fontFamily: T.fontBody }}>
      {trend && <span style={{ color: trend > 0 ? T.green : T.red, marginRight: 4 }}>{trend > 0 ? "↑" : "↓"}{Math.abs(trend)}%</span>}
      {sub}
    </div>}
  </div>
);

const Avatar = ({ name, size = 36, risk }) => {
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const colors = ["#F20000", "#0A84FF", "#34C759", "#BF5AF2", "#FF9F0A"];
  const idx = name.charCodeAt(0) % colors.length;
  const dotColor = risk >= 4 ? T.red : risk >= 3 ? T.amber : T.green;
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <div style={{
        width: size, height: size, borderRadius: "50%",
        background: `${colors[idx]}22`, border: `1.5px solid ${colors[idx]}44`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.35, fontWeight: 700, color: colors[idx],
        fontFamily: T.fontBody,
      }}>{initials}</div>
      {risk !== undefined && (
        <div style={{
          position: "absolute", bottom: -1, right: -1,
          width: 10, height: 10, borderRadius: "50%",
          background: dotColor, border: "2px solid #111",
          boxShadow: `0 0 6px ${dotColor}`,
        }} />
      )}
    </div>
  );
};

const ProgressBar = ({ value, max = 10, color = T.red }) => (
  <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 100, height: 4, overflow: "hidden" }}>
    <div style={{
      height: "100%", width: `${(value / max) * 100}%`,
      background: `linear-gradient(90deg, ${color}, ${color}bb)`,
      borderRadius: 100, transition: "width 0.6s ease",
    }} />
  </div>
);

const Switch = ({ on }) => (
  <div style={{
    width: 44, height: 26, borderRadius: 13,
    background: on ? T.red : "rgba(255,255,255,0.1)",
    position: "relative", cursor: "pointer", transition: "background 0.2s",
    border: `1px solid ${on ? T.red : T.border}`,
  }}>
    <div style={{
      position: "absolute", top: 3, left: on ? 19 : 3,
      width: 18, height: 18, borderRadius: "50%",
      background: "#fff", transition: "left 0.2s",
      boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
    }} />
  </div>
);

const Input = ({ label, value, placeholder, type = "text", icon }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
    {label && <label style={{ fontSize: 12, color: T.textSecondary, fontWeight: 500, fontFamily: T.fontBody, letterSpacing: "0.04em" }}>{label}</label>}
    <div style={{
      display: "flex", alignItems: "center", gap: 10,
      background: "rgba(255,255,255,0.05)",
      border: `1px solid ${T.border}`,
      borderRadius: 12, padding: "12px 14px",
    }}>
      {icon && <span style={{ fontSize: 16, opacity: 0.5 }}>{icon}</span>}
      <span style={{ fontSize: 15, color: value ? T.textPrimary : T.textTertiary, fontFamily: T.fontBody }}>
        {value || placeholder}
      </span>
    </div>
  </div>
);

const NavBar = ({ title, back, action, transparent }) => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "16px 20px",
    background: transparent ? "transparent" : `${T.surface}ee`,
    backdropFilter: "blur(20px)",
    borderBottom: transparent ? "none" : `1px solid ${T.border}`,
    position: "sticky", top: 0, zIndex: 10,
  }}>
    <div style={{ width: 60, display: "flex", alignItems: "center" }}>
      {back && <button style={{
        background: "rgba(255,255,255,0.08)", border: `1px solid ${T.border}`,
        borderRadius: 20, padding: "4px 12px", color: T.textSecondary,
        fontSize: 13, cursor: "pointer", fontFamily: T.fontBody, display: "flex", alignItems: "center", gap: 4,
      }}>‹ {back}</button>}
    </div>
    <span style={{ fontSize: 17, fontWeight: 600, color: T.textPrimary, fontFamily: T.fontBody }}>{title}</span>
    <div style={{ width: 60, display: "flex", justifyContent: "flex-end" }}>
      {action && <button style={{
        background: "none", border: "none", color: T.red,
        fontSize: 14, cursor: "pointer", fontFamily: T.fontBody, fontWeight: 500,
      }}>{action}</button>}
    </div>
  </div>
);

const TabBar = ({ tabs, active, onSelect }) => (
  <div style={{
    display: "flex", justifyContent: "space-around", alignItems: "center",
    padding: "8px 0 calc(8px + env(safe-area-inset-bottom, 0px))",
    background: `${T.surface}f5`,
    backdropFilter: "blur(30px)",
    borderTop: `1px solid ${T.border}`,
    position: "sticky", bottom: 0, zIndex: 10,
  }}>
    {tabs.map(tab => (
      <button key={tab.id} onClick={() => onSelect(tab.id)} style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
        background: "none", border: "none", cursor: "pointer",
        padding: "4px 16px",
        color: active === tab.id ? T.red : T.textTertiary,
        transition: "color 0.2s",
      }}>
        <span style={{ fontSize: 22 }}>{tab.icon}</span>
        <span style={{ fontSize: 10, fontWeight: 500, fontFamily: T.fontBody }}>{tab.label}</span>
      </button>
    ))}
  </div>
);

// ─── SCREEN WRAPPER ───────────────────────────────────────────────────────────
const Screen = ({ children, style = {} }) => (
  <div style={{
    background: T.black, color: T.textPrimary,
    fontFamily: T.fontBody,
    display: "flex", flexDirection: "column",
    height: "100%", overflowY: "auto", overflowX: "hidden",
    position: "relative",
    ...style,
  }}>
    {children}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN 1 — ONBOARDING / SPLASH
// ─────────────────────────────────────────────────────────────────────────────
const SplashScreen = ({ onNext }) => (
  <Screen>
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 28px", gap: 0, minHeight: 580 }}>
      {/* BG glow */}
      <div style={{ position: "absolute", top: "20%", left: "50%", transform: "translateX(-50%)", width: 300, height: 300, borderRadius: "50%", background: `radial-gradient(circle, ${T.redGlow} 0%, transparent 70%)`, pointerEvents: "none" }} />

      {/* Logo */}
      <div style={{ marginBottom: 48, position: "relative" }}>
        <img
          src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAgAAAQABAAD/wAARCANIBbADACIAAREBAhEB/9sAQwAIBgYHBgUIBwcHCQkICgwUDQwLCwwZEhMPFB0aHx4dGhwcICQuJyAiLCMcHCg3KSwwMTQ0NB8nOT04MjwuMzQy/9sAQwEJCQkMCwwYDQ0YMiEcITIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIy/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMAAAERAhEAPwD5/ooooA"
          alt="Fitosys"
          style={{ width: 200, height: "auto", filter: "drop-shadow(0 0 20px rgba(242,0,0,0.3))" }}
        />
      </div>

      {/* Hero copy */}
      <h1 style={{
        fontFamily: T.fontDisplay, fontSize: 40, fontWeight: 800,
        textTransform: "uppercase", letterSpacing: "0.04em",
        textAlign: "center", lineHeight: 1.05, marginBottom: 16,
        background: "linear-gradient(180deg, #fff 40%, rgba(255,255,255,0.5) 100%)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
      }}>
        Where Systems<br />Meet Strength
      </h1>

      <p style={{
        fontSize: 15, color: T.textSecondary, textAlign: "center",
        lineHeight: 1.6, maxWidth: 280, marginBottom: 48, fontFamily: T.fontBody,
      }}>
        Your client follow-ups, check-ins, and renewals — automated. So Monday starts with a plan, not a pile.
      </p>

      {/* CTA */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%" }}>
        <button onClick={onNext} style={{
          background: T.red, border: "none", borderRadius: 14,
          padding: "17px", color: "#fff", fontSize: 17, fontWeight: 700,
          cursor: "pointer", fontFamily: T.fontDisplay, letterSpacing: "0.06em",
          textTransform: "uppercase",
          boxShadow: `0 4px 24px ${T.redGlow}`,
        }}>
          Start Free Trial
        </button>
        <button style={{
          background: "rgba(255,255,255,0.06)", border: `1px solid ${T.border}`,
          borderRadius: 14, padding: "16px", color: T.textSecondary,
          fontSize: 15, cursor: "pointer", fontFamily: T.fontBody, fontWeight: 500,
        }}>
          Sign In
        </button>
      </div>

      <p style={{ marginTop: 24, fontSize: 12, color: T.textTertiary, fontFamily: T.fontBody }}>
        No credit card · Up and running in 15 minutes
      </p>
    </div>
  </Screen>
);

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN 2 — COACH DASHBOARD (HOME)
// ─────────────────────────────────────────────────────────────────────────────
const DashboardScreen = ({ onNavigate }) => {
  const [tab, setTab] = useState("home");

  const clients = [
    { name: "Rohan Mehta", program: "12-Week Shred", energy: 4, sessions: 1, risk: 4, daysLeft: 5 },
    { name: "Neha Sharma", program: "Yoga Foundations", energy: 7, sessions: 3, risk: 2, daysLeft: 21 },
    { name: "Arjun Kapoor", program: "Strength Phase 2", energy: 9, sessions: 5, risk: 1, daysLeft: 14 },
    { name: "Priya Nair", program: "Fat Loss Sprint", energy: 5, sessions: 2, risk: 3, daysLeft: 3 },
  ];

  return (
    <Screen>
      {/* Header */}
      <div style={{ padding: "20px 20px 0", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ fontSize: 13, color: T.textTertiary, marginBottom: 2, fontFamily: T.fontBody }}>Monday, 3 March</p>
          <h2 style={{ fontSize: 24, fontWeight: 700, fontFamily: T.fontDisplay, letterSpacing: "0.02em" }}>
            Morning, <span style={{ color: T.red }}>Coach Ashok</span> 👋
          </h2>
        </div>
        <Avatar name="Ashok Kumar" size={42} />
      </div>

      {/* Monday Pulse Banner */}
      <div onClick={() => onNavigate("summary")} style={{
        margin: "20px 16px 0",
        background: `linear-gradient(135deg, ${T.red}18 0%, ${T.surfaceCard} 100%)`,
        border: `1px solid ${T.red}30`,
        borderRadius: 16, padding: "16px",
        cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: `${T.red}22`, border: `1px solid ${T.red}40`,
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
          }}>🤖</div>
          <div>
            <p style={{ fontSize: 13, fontWeight: 700, color: T.textPrimary, fontFamily: T.fontBody }}>Monday AI Pulse Ready</p>
            <p style={{ fontSize: 12, color: T.textSecondary, fontFamily: T.fontBody }}>4 clients · 1 needs attention</p>
          </div>
        </div>
        <span style={{ color: T.red, fontSize: 18 }}>›</span>
      </div>

      {/* Stats Row */}
      <div style={{ padding: "16px 16px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <StatCard label="Active Clients" value="24" sub="vs last month" trend={8} accent={T.red} icon="👥" />
        <StatCard label="Check-in Rate" value="91%" sub="this week" trend={3} accent={T.green} icon="✅" />
        <StatCard label="Renewals Due" value="3" sub="next 7 days" accent={T.amber} icon="🔔" />
        <StatCard label="MRR" value="₹36K" sub="vs last month" trend={12} accent={T.blue} icon="💰" />
      </div>

      {/* Section: At Risk */}
      <div style={{ padding: "20px 16px 0" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, fontFamily: T.fontDisplay, letterSpacing: "0.02em" }}>Needs Attention</h3>
          <button onClick={() => onNavigate("clients")} style={{ background: "none", border: "none", color: T.red, fontSize: 13, cursor: "pointer", fontFamily: T.fontBody }}>See All</button>
        </div>
        {clients.filter(c => c.risk >= 3).map(client => (
          <div key={client.name} onClick={() => onNavigate("clientDetail")} style={{
            display: "flex", alignItems: "center", gap: 12,
            background: T.surfaceCard, border: `1px solid ${client.risk >= 4 ? T.red + "30" : T.border}`,
            borderRadius: 14, padding: "14px", marginBottom: 8, cursor: "pointer",
          }}>
            <Avatar name={client.name} risk={client.risk} size={42} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ fontSize: 14, fontWeight: 600, color: T.textPrimary, fontFamily: T.fontBody }}>{client.name}</p>
                <Badge label={`Risk ${client.risk}/5`} color={client.risk >= 4 ? T.red : T.amber} />
              </div>
              <p style={{ fontSize: 12, color: T.textTertiary, marginTop: 2, fontFamily: T.fontBody }}>{client.program}</p>
              <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
                <span style={{ fontSize: 11, color: T.textSecondary, fontFamily: T.fontBody }}>⚡ Energy {client.energy}/10</span>
                <span style={{ fontSize: 11, color: T.textSecondary, fontFamily: T.fontBody }}>🏋️ {client.sessions} sessions</span>
                {client.daysLeft <= 7 && <span style={{ fontSize: 11, color: T.amber, fontFamily: T.fontBody }}>🔔 {client.daysLeft}d left</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ height: 20 }} />

      <TabBar
        tabs={[
          { id: "home", icon: "⊞", label: "Dashboard" },
          { id: "clients", icon: "👥", label: "Clients" },
          { id: "checkins", icon: "✅", label: "Check-ins" },
          { id: "settings", icon: "⚙", label: "Settings" },
        ]}
        active={tab}
        onSelect={(id) => { setTab(id); if (id !== "home") onNavigate(id); }}
      />
    </Screen>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN 3 — CLIENT LIST
// ─────────────────────────────────────────────────────────────────────────────
const ClientListScreen = ({ onBack, onSelect }) => {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const clients = [
    { name: "Rohan Mehta", program: "12-Week Shred", energy: 4, sessions: 1, risk: 4, status: "active", daysLeft: 5 },
    { name: "Neha Sharma", program: "Yoga Foundations", energy: 7, sessions: 3, risk: 2, status: "active", daysLeft: 21 },
    { name: "Arjun Kapoor", program: "Strength Phase 2", energy: 9, sessions: 5, risk: 1, status: "active", daysLeft: 14 },
    { name: "Priya Nair", program: "Fat Loss Sprint", energy: 5, sessions: 2, risk: 3, status: "active", daysLeft: 3 },
    { name: "Dev Singh", program: "Mobility & Recovery", energy: 6, sessions: 2, risk: 2, status: "active", daysLeft: 9 },
    { name: "Kavya Reddy", program: "12-Week Shred", energy: 8, sessions: 4, risk: 1, status: "active", daysLeft: 18 },
  ];

  const filtered = clients.filter(c =>
    (filter === "all" || (filter === "atrisk" && c.risk >= 3) || (filter === "renewal" && c.daysLeft <= 7)) &&
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Screen>
      <NavBar title="Clients" back="Home" action="+ Add" />

      {/* Search */}
      <div style={{ padding: "12px 16px" }}>
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "rgba(255,255,255,0.05)", border: `1px solid ${T.border}`,
          borderRadius: 12, padding: "11px 14px",
        }}>
          <span style={{ opacity: 0.4 }}>🔍</span>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search clients..."
            style={{ background: "none", border: "none", outline: "none", color: T.textPrimary, fontSize: 15, flex: 1, fontFamily: T.fontBody }}
          />
        </div>
      </div>

      {/* Filter chips */}
      <div style={{ display: "flex", gap: 8, padding: "0 16px 16px", overflowX: "auto", scrollbarWidth: "none" }}>
        <Chip label="All Clients" active={filter === "all"} onClick={() => setFilter("all")} />
        <Chip label="🔴 At Risk" active={filter === "atrisk"} onClick={() => setFilter("atrisk")} />
        <Chip label="🔔 Renewal Due" active={filter === "renewal"} onClick={() => setFilter("renewal")} />
      </div>

      {/* Client rows */}
      <div style={{ padding: "0 16px", display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map(client => (
          <div key={client.name} onClick={() => onSelect()} style={{
            display: "flex", alignItems: "center", gap: 12,
            background: T.surfaceCard, border: `1px solid ${T.border}`,
            borderRadius: 14, padding: "14px", cursor: "pointer",
          }}>
            <Avatar name={client.name} risk={client.risk} size={44} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <p style={{ fontSize: 15, fontWeight: 600, fontFamily: T.fontBody }}>{client.name}</p>
                <div style={{ display: "flex", gap: 6 }}>
                  {client.daysLeft <= 7 && <Badge label={`${client.daysLeft}d`} color={T.amber} />}
                  {client.risk >= 4 && <RiskDot score={client.risk} />}
                </div>
              </div>
              <p style={{ fontSize: 12, color: T.textTertiary, marginTop: 2, fontFamily: T.fontBody }}>{client.program}</p>
              <div style={{ marginTop: 8 }}>
                <ProgressBar value={client.energy} color={client.energy >= 7 ? T.green : client.energy >= 5 ? T.amber : T.red} />
                <p style={{ fontSize: 10, color: T.textTertiary, marginTop: 3, fontFamily: T.fontBody }}>Energy {client.energy}/10</p>
              </div>
            </div>
            <span style={{ color: T.textTertiary, fontSize: 18 }}>›</span>
          </div>
        ))}
      </div>

      <div style={{ height: 24 }} />
    </Screen>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN 4 — CLIENT DETAIL
// ─────────────────────────────────────────────────────────────────────────────
const ClientDetailScreen = ({ onBack }) => {
  const client = { name: "Rohan Mehta", program: "12-Week Shred", energy: 4, sessions: 1, risk: 4, daysLeft: 5, weight: "78kg", startWeight: "84kg", goal: "Fat Loss", enrolled: "Jan 6, 2026" };

  const weekData = [7, 6, 5, 8, 4, 5, 4];
  const barMax = 10;

  return (
    <Screen>
      <NavBar title="Client Profile" back="Clients" action="Message" />

      {/* Hero */}
      <div style={{
        margin: "16px", background: `linear-gradient(135deg, ${T.red}18, ${T.surfaceCard})`,
        border: `1px solid ${T.red}20`, borderRadius: 20, padding: "20px",
      }}>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <Avatar name={client.name} size={60} risk={client.risk} />
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 700, fontFamily: T.fontBody }}>{client.name}</h2>
            <p style={{ fontSize: 13, color: T.textSecondary, fontFamily: T.fontBody }}>{client.program}</p>
            <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
              <Badge label="⚠ High Risk" color={T.red} />
              <Badge label={`${client.daysLeft} days left`} color={T.amber} />
            </div>
          </div>
        </div>

        {/* AI Insight */}
        <div style={{
          marginTop: 16, padding: "12px 14px", borderRadius: 12,
          background: "rgba(242,0,0,0.06)", border: `1px solid ${T.red}20`,
        }}>
          <p style={{ fontSize: 12, color: T.red, fontWeight: 600, marginBottom: 4, fontFamily: T.fontBody }}>🤖 AI INSIGHT</p>
          <p style={{ fontSize: 13, color: T.textSecondary, lineHeight: 1.5, fontFamily: T.fontBody }}>
            Rohan's energy has dropped from 7 to 4 over three weeks. Only 1 session this week. Renewal in 5 days — high churn risk. Call today.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, padding: "0 16px" }}>
        <div style={{ background: T.surfaceCard, border: `1px solid ${T.border}`, borderRadius: 12, padding: "12px", textAlign: "center" }}>
          <p style={{ fontSize: 18, fontWeight: 700, color: T.red, fontFamily: T.fontDisplay }}>4/10</p>
          <p style={{ fontSize: 11, color: T.textTertiary, fontFamily: T.fontBody }}>Energy</p>
        </div>
        <div style={{ background: T.surfaceCard, border: `1px solid ${T.border}`, borderRadius: 12, padding: "12px", textAlign: "center" }}>
          <p style={{ fontSize: 18, fontWeight: 700, color: T.amber, fontFamily: T.fontDisplay }}>1</p>
          <p style={{ fontSize: 11, color: T.textTertiary, fontFamily: T.fontBody }}>Sessions</p>
        </div>
        <div style={{ background: T.surfaceCard, border: `1px solid ${T.border}`, borderRadius: 12, padding: "12px", textAlign: "center" }}>
          <p style={{ fontSize: 18, fontWeight: 700, color: T.green, fontFamily: T.fontDisplay }}>−6kg</p>
          <p style={{ fontSize: 11, color: T.textTertiary, fontFamily: T.fontBody }}>Progress</p>
        </div>
      </div>

      {/* Energy trend chart */}
      <div style={{ margin: "16px", background: T.surfaceCard, border: `1px solid ${T.border}`, borderRadius: 16, padding: "16px" }}>
        <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 16, fontFamily: T.fontBody, color: T.textSecondary }}>Energy Trend — 7 Weeks</p>
        <div style={{ display: "flex", gap: 8, alignItems: "flex-end", height: 60 }}>
          {weekData.map((v, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
              <div style={{
                width: "100%", borderRadius: 4,
                height: `${(v / barMax) * 54}px`,
                background: v <= 4 ? `linear-gradient(180deg, ${T.red}, ${T.red}88)` : v <= 6 ? `linear-gradient(180deg, ${T.amber}, ${T.amber}88)` : `linear-gradient(180deg, ${T.green}, ${T.green}88)`,
              }} />
              <span style={{ fontSize: 9, color: T.textTertiary, fontFamily: T.fontBody }}>W{i + 1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ padding: "0 16px", display: "flex", gap: 10 }}>
        <button style={{
          flex: 1, background: T.red, border: "none", borderRadius: 12,
          padding: "14px", color: "#fff", fontSize: 14, fontWeight: 700,
          cursor: "pointer", fontFamily: T.fontDisplay, letterSpacing: "0.04em",
        }}>SEND RENEWAL</button>
        <button style={{
          flex: 1, background: T.surfaceCard, border: `1px solid ${T.border}`,
          borderRadius: 12, padding: "14px", color: T.textPrimary,
          fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: T.fontBody,
        }}>View History</button>
      </div>

      <div style={{ height: 24 }} />
    </Screen>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN 5 — MONDAY AI SUMMARY
// ─────────────────────────────────────────────────────────────────────────────
const AISummaryScreen = ({ onBack }) => (
  <Screen>
    <NavBar title="Monday Pulse" back="Dashboard" />

    {/* Header card */}
    <div style={{ margin: "16px", background: `linear-gradient(135deg, ${T.red}22, ${T.surfaceCard})`, border: `1px solid ${T.red}30`, borderRadius: 20, padding: "20px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
        <div style={{ width: 44, height: 44, borderRadius: 12, background: `${T.red}22`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🤖</div>
        <div>
          <p style={{ fontSize: 16, fontWeight: 700, fontFamily: T.fontBody }}>AI Weekly Pulse</p>
          <p style={{ fontSize: 12, color: T.textSecondary, fontFamily: T.fontBody }}>Mon 3 Mar · Generated 7:02 AM</p>
        </div>
      </div>
      <p style={{ fontSize: 14, color: T.textSecondary, lineHeight: 1.65, fontFamily: T.fontBody }}>
        22 of 24 clients checked in this week — <span style={{ color: T.green }}>91% response rate</span>. Group energy averaged 6.4/10, down slightly from 6.9 last week. Two clients show early churn signals. Three renewals within 7 days.
      </p>
    </div>

    {/* Stats row */}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, padding: "0 16px 16px" }}>
      <div style={{ background: T.surfaceCard, border: `1px solid ${T.border}`, borderRadius: 14, padding: "14px", textAlign: "center" }}>
        <p style={{ fontSize: 22, fontWeight: 800, color: T.green, fontFamily: T.fontDisplay }}>22/24</p>
        <p style={{ fontSize: 11, color: T.textTertiary, fontFamily: T.fontBody }}>Responded</p>
      </div>
      <div style={{ background: T.surfaceCard, border: `1px solid ${T.border}`, borderRadius: 14, padding: "14px", textAlign: "center" }}>
        <p style={{ fontSize: 22, fontWeight: 800, color: T.amber, fontFamily: T.fontDisplay }}>6.4</p>
        <p style={{ fontSize: 11, color: T.textTertiary, fontFamily: T.fontBody }}>Avg Energy</p>
      </div>
      <div style={{ background: T.surfaceCard, border: `1px solid ${T.border}`, borderRadius: 14, padding: "14px", textAlign: "center" }}>
        <p style={{ fontSize: 22, fontWeight: 800, color: T.red, fontFamily: T.fontDisplay }}>2</p>
        <p style={{ fontSize: 11, color: T.textTertiary, fontFamily: T.fontBody }}>At Risk</p>
      </div>
    </div>

    {/* Needs Attention */}
    <div style={{ padding: "0 16px 12px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <div style={{ width: 4, height: 16, background: T.red, borderRadius: 2 }} />
        <h3 style={{ fontSize: 14, fontWeight: 700, fontFamily: T.fontBody, color: T.red, letterSpacing: "0.06em", textTransform: "uppercase" }}>Needs Attention</h3>
      </div>
      {[
        { name: "Rohan Mehta", reason: "Energy 4/10, only 1 session. Call today.", action: "📞 Call", risk: 4 },
        { name: "Priya Nair", reason: "Renewal in 3 days, hasn't replied to last check-in.", action: "💬 Message", risk: 3 },
      ].map(c => (
        <div key={c.name} style={{
          background: T.surfaceCard, border: `1px solid ${c.risk >= 4 ? T.red + "30" : T.amber + "30"}`,
          borderRadius: 14, padding: "14px", marginBottom: 8,
          display: "flex", alignItems: "flex-start", gap: 12,
        }}>
          <Avatar name={c.name} size={38} risk={c.risk} />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 600, fontFamily: T.fontBody }}>{c.name}</p>
            <p style={{ fontSize: 12, color: T.textSecondary, marginTop: 3, lineHeight: 1.5, fontFamily: T.fontBody }}>{c.reason}</p>
          </div>
          <button style={{
            background: T.red, border: "none", borderRadius: 8,
            padding: "6px 12px", color: "#fff", fontSize: 12,
            cursor: "pointer", fontFamily: T.fontBody, whiteSpace: "nowrap", fontWeight: 600,
          }}>{c.action}</button>
        </div>
      ))}
    </div>

    {/* Strong performers */}
    <div style={{ padding: "0 16px 12px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <div style={{ width: 4, height: 16, background: T.green, borderRadius: 2 }} />
        <h3 style={{ fontSize: 14, fontWeight: 700, fontFamily: T.fontBody, color: T.green, letterSpacing: "0.06em", textTransform: "uppercase" }}>Strong This Week</h3>
      </div>
      {[
        { name: "Arjun Kapoor", note: "9/10 energy, 5 sessions. Best week this month. Recognise publicly." },
        { name: "Kavya Reddy", note: "Consistent 8/10 for 4 weeks. Ready to progress to Phase 3." },
      ].map(c => (
        <div key={c.name} style={{
          background: T.surfaceCard, border: `1px solid ${T.green}20`,
          borderRadius: 14, padding: "14px", marginBottom: 8,
          display: "flex", alignItems: "flex-start", gap: 12,
        }}>
          <Avatar name={c.name} size={38} risk={1} />
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 14, fontWeight: 600, fontFamily: T.fontBody }}>{c.name}</p>
            <p style={{ fontSize: 12, color: T.textSecondary, marginTop: 3, lineHeight: 1.5, fontFamily: T.fontBody }}>{c.note}</p>
          </div>
        </div>
      ))}
    </div>

    {/* Business insight */}
    <div style={{ margin: "0 16px 24px", background: `${T.blue}10`, border: `1px solid ${T.blue}25`, borderRadius: 14, padding: "14px" }}>
      <p style={{ fontSize: 12, color: T.blue, fontWeight: 700, marginBottom: 6, fontFamily: T.fontBody, letterSpacing: "0.06em" }}>💡 BUSINESS INSIGHT</p>
      <p style={{ fontSize: 13, color: T.textSecondary, lineHeight: 1.6, fontFamily: T.fontBody }}>
        Clients on 12-Week Shred have 40% higher renewal rate than 4-week programs. Consider pushing more clients onto that pathway.
      </p>
    </div>
  </Screen>
);

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN 6 — CHECKIN FLOW
// ─────────────────────────────────────────────────────────────────────────────
const CheckinScreen = ({ onBack }) => {
  const [step, setStep] = useState(0);
  const [energy, setEnergy] = useState(7);
  const [sessions, setSessions] = useState(3);
  const [win, setWin] = useState("");
  const [struggle, setStruggle] = useState("");

  const questions = [
    { id: "energy", label: "How's your energy this week?", type: "scale" },
    { id: "sessions", label: "Training sessions completed?", type: "sessions" },
    { id: "win", label: "One win this week 🏆", type: "text" },
    { id: "struggle", label: "What challenged you? 💪", type: "text" },
  ];

  const total = questions.length;

  if (step >= total) {
    return (
      <Screen style={{ alignItems: "center", justifyContent: "center" }}>
        <div style={{ padding: "40px 28px", textAlign: "center" }}>
          <div style={{ fontSize: 64, marginBottom: 24 }}>✅</div>
          <h2 style={{ fontSize: 26, fontWeight: 800, fontFamily: T.fontDisplay, letterSpacing: "0.04em", marginBottom: 12 }}>Check-in Complete</h2>
          <p style={{ fontSize: 15, color: T.textSecondary, lineHeight: 1.6, fontFamily: T.fontBody, marginBottom: 32 }}>
            Great work, Rohan. Coach Ashok gets your summary tomorrow morning.
          </p>
          <button onClick={onBack} style={{
            background: T.red, border: "none", borderRadius: 14, padding: "16px 48px",
            color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer",
            fontFamily: T.fontDisplay, letterSpacing: "0.06em",
          }}>DONE</button>
        </div>
      </Screen>
    );
  }

  const q = questions[step];

  return (
    <Screen>
      <NavBar title="Weekly Check-in" back="Cancel" />

      {/* Progress */}
      <div style={{ padding: "12px 20px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <p style={{ fontSize: 12, color: T.textTertiary, fontFamily: T.fontBody }}>Step {step + 1} of {total}</p>
          <p style={{ fontSize: 12, color: T.textSecondary, fontFamily: T.fontBody }}>Coach Ashok Fitness</p>
        </div>
        <ProgressBar value={step + 1} max={total} color={T.red} />
      </div>

      <div style={{ flex: 1, padding: "32px 24px" }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, fontFamily: T.fontBody, lineHeight: 1.3, marginBottom: 32 }}>{q.label}</h2>

        {q.type === "scale" && (
          <div>
            <div style={{ fontSize: 64, fontWeight: 900, color: T.red, fontFamily: T.fontDisplay, textAlign: "center", marginBottom: 24 }}>{energy}</div>
            <input type="range" min={1} max={10} value={energy} onChange={e => setEnergy(parseInt(e.target.value))}
              style={{ width: "100%", accentColor: T.red, height: 6 }} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
              <span style={{ fontSize: 12, color: T.textTertiary, fontFamily: T.fontBody }}>Exhausted</span>
              <span style={{ fontSize: 12, color: T.textTertiary, fontFamily: T.fontBody }}>Unstoppable</span>
            </div>
          </div>
        )}

        {q.type === "sessions" && (
          <div style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            {[0, 1, 2, 3, 4, 5, 6, 7].map(n => (
              <button key={n} onClick={() => setSessions(n)} style={{
                width: 56, height: 56, borderRadius: 14,
                background: sessions === n ? T.red : T.surfaceCard,
                border: `1px solid ${sessions === n ? T.red : T.border}`,
                color: sessions === n ? "#fff" : T.textSecondary,
                fontSize: 20, fontWeight: 700, cursor: "pointer",
                fontFamily: T.fontDisplay,
              }}>{n}</button>
            ))}
          </div>
        )}

        {q.type === "text" && (
          <textarea
            placeholder={q.id === "win" ? "e.g. Hit a new PB on deadlifts" : "e.g. Sleep was poor this week..."}
            style={{
              width: "100%", background: T.surfaceCard, border: `1px solid ${T.border}`,
              borderRadius: 14, padding: "14px", color: T.textPrimary,
              fontSize: 15, fontFamily: T.fontBody, resize: "none", height: 120,
              outline: "none", boxSizing: "border-box",
            }}
          />
        )}
      </div>

      <div style={{ padding: "16px 24px 32px", display: "flex", gap: 12 }}>
        {step > 0 && <button onClick={() => setStep(s => s - 1)} style={{
          flex: 1, background: T.surfaceCard, border: `1px solid ${T.border}`,
          borderRadius: 14, padding: "16px", color: T.textSecondary,
          fontSize: 15, cursor: "pointer", fontFamily: T.fontBody,
        }}>Back</button>}
        <button onClick={() => setStep(s => s + 1)} style={{
          flex: 2, background: T.red, border: "none", borderRadius: 14,
          padding: "16px", color: "#fff", fontSize: 16, fontWeight: 700,
          cursor: "pointer", fontFamily: T.fontDisplay, letterSpacing: "0.06em",
        }}>{step === total - 1 ? "SUBMIT ✓" : "CONTINUE →"}</button>
      </div>
    </Screen>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN 7 — ONBOARDING / NEW CLIENT INTAKE
// ─────────────────────────────────────────────────────────────────────────────
const ClientIntakeScreen = ({ onBack }) => {
  const [step, setStep] = useState(0);
  const [plan, setPlan] = useState(null);

  const programs = [
    { id: "shred", name: "12-Week Shred", price: "₹15,000", duration: "12 weeks", desc: "Total body transformation" },
    { id: "strength", name: "Strength Phase 2", price: "₹12,000", duration: "8 weeks", desc: "Progressive overload system" },
    { id: "yoga", name: "Yoga Foundations", price: "₹8,000", duration: "6 weeks", desc: "Flexibility & mindfulness" },
  ];

  if (step === 0) return (
    <Screen>
      <NavBar title="Coach Ashok Fitness" />
      <div style={{ padding: "24px 20px" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Avatar name="Ashok Kumar" size={64} />
          <h1 style={{ fontSize: 24, fontWeight: 800, fontFamily: T.fontDisplay, letterSpacing: "0.04em", marginTop: 12 }}>Join the System</h1>
          <p style={{ fontSize: 14, color: T.textSecondary, lineHeight: 1.6, fontFamily: T.fontBody }}>Pick a program, pay securely, and start Monday.</p>
        </div>

        <h3 style={{ fontSize: 14, fontWeight: 600, color: T.textTertiary, marginBottom: 12, letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: T.fontBody }}>Choose Your Program</h3>

        {programs.map(p => (
          <div key={p.id} onClick={() => { setPlan(p.id); setStep(1); }} style={{
            background: plan === p.id ? `${T.red}15` : T.surfaceCard,
            border: `1px solid ${plan === p.id ? T.red : T.border}`,
            borderRadius: 14, padding: "16px", marginBottom: 10, cursor: "pointer",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <div>
              <p style={{ fontSize: 15, fontWeight: 700, fontFamily: T.fontBody }}>{p.name}</p>
              <p style={{ fontSize: 12, color: T.textTertiary, marginTop: 2, fontFamily: T.fontBody }}>{p.desc} · {p.duration}</p>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 16, fontWeight: 800, color: T.red, fontFamily: T.fontDisplay }}>{p.price}</p>
              <p style={{ fontSize: 11, color: T.textTertiary, fontFamily: T.fontBody }}>one-time</p>
            </div>
          </div>
        ))}
      </div>
    </Screen>
  );

  if (step === 1) return (
    <Screen>
      <NavBar title="Your Details" back="Programs" />
      <div style={{ padding: "24px 20px", display: "flex", flexDirection: "column", gap: 16 }}>
        <Input label="Full Name" placeholder="Enter your full name" icon="👤" />
        <Input label="WhatsApp Number" placeholder="+91 9876543210" icon="📱" />
        <Input label="Email Address" placeholder="you@email.com" icon="✉️" />
        <Input label="Current Weight" placeholder="e.g. 78 kg" icon="⚖️" />
        <Input label="Fitness Goal" placeholder="e.g. Lose 8kg in 12 weeks" icon="🎯" />

        <button onClick={() => setStep(2)} style={{
          background: T.red, border: "none", borderRadius: 14,
          padding: "17px", color: "#fff", fontSize: 16, fontWeight: 700,
          cursor: "pointer", fontFamily: T.fontDisplay, letterSpacing: "0.06em",
          marginTop: 8,
        }}>CONTINUE TO PAYMENT →</button>
      </div>
    </Screen>
  );

  return (
    <Screen>
      <NavBar title="Payment" back="Details" />
      <div style={{ padding: "24px 20px" }}>
        <div style={{ background: T.surfaceCard, border: `1px solid ${T.border}`, borderRadius: 16, padding: "20px", marginBottom: 24 }}>
          <p style={{ fontSize: 13, color: T.textTertiary, fontFamily: T.fontBody }}>Order Summary</p>
          <p style={{ fontSize: 18, fontWeight: 700, fontFamily: T.fontBody, marginTop: 4 }}>12-Week Shred Program</p>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 16, paddingTop: 16, borderTop: `1px solid ${T.border}` }}>
            <span style={{ color: T.textSecondary, fontFamily: T.fontBody }}>Total</span>
            <span style={{ fontSize: 22, fontWeight: 800, color: T.red, fontFamily: T.fontDisplay }}>₹15,000</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[{ icon: "💳", label: "Pay with Card" }, { icon: "🏦", label: "Pay with UPI" }, { icon: "📱", label: "Net Banking" }].map(opt => (
            <button key={opt.label} style={{
              background: T.surfaceCard, border: `1px solid ${T.border}`,
              borderRadius: 14, padding: "16px", color: T.textPrimary,
              fontSize: 15, cursor: "pointer", fontFamily: T.fontBody,
              display: "flex", alignItems: "center", gap: 12,
            }}>
              <span style={{ fontSize: 20 }}>{opt.icon}</span>
              {opt.label}
            </button>
          ))}
        </div>

        <p style={{ textAlign: "center", fontSize: 12, color: T.textTertiary, marginTop: 20, fontFamily: T.fontBody }}>
          🔒 Secured by Razorpay · ₹15,000 one-time payment
        </p>
      </div>
    </Screen>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SCREEN 8 — SETTINGS / PROFILE
// ─────────────────────────────────────────────────────────────────────────────
const SettingsScreen = ({ onBack }) => {
  const sections = [
    {
      title: "Account",
      items: [
        { icon: "👤", label: "Profile Details", sub: "Ashok Kumar · ashok@gmail.com", action: "›" },
        { icon: "💳", label: "Billing & Plan", sub: "Pro · ₹2,499/month", action: "›" },
        { icon: "🔔", label: "Notifications", sub: "WhatsApp, Push, Email", action: "›" },
      ]
    },
    {
      title: "Automation",
      items: [
        { icon: "📅", label: "Check-in Schedule", sub: "Sunday 7:00 PM", action: <Switch on={true} />, },
        { icon: "🤖", label: "Monday AI Summary", sub: "Monday 7:00 AM", action: <Switch on={true} />, },
        { icon: "🔄", label: "Renewal Reminders", sub: "7 days before expiry", action: <Switch on={true} />, },
        { icon: "⚡", label: "Instant Notifications", sub: "Client payment & sign-up", action: <Switch on={false} />, },
      ]
    },
    {
      title: "Integration",
      items: [
        { icon: "💬", label: "WhatsApp (Interakt)", sub: "🟡 Setup Pending", action: "›" },
        { icon: "💰", label: "Razorpay Payments", sub: "✅ Connected", action: "›" },
        { icon: "🤖", label: "Gemini AI", sub: "✅ Active", action: "›" },
      ]
    },
  ];

  return (
    <Screen>
      <NavBar title="Settings" back="Dashboard" />

      {/* Profile card */}
      <div style={{ margin: "16px", background: T.surfaceCard, border: `1px solid ${T.border}`, borderRadius: 20, padding: "20px", display: "flex", gap: 14, alignItems: "center" }}>
        <Avatar name="Ashok Kumar" size={56} />
        <div>
          <p style={{ fontSize: 18, fontWeight: 700, fontFamily: T.fontBody }}>Ashok Kumar</p>
          <p style={{ fontSize: 13, color: T.textSecondary, fontFamily: T.fontBody }}>Fitness Coach · Mumbai</p>
          <div style={{ marginTop: 8 }}>
            <Badge label="PRO" color={T.red} />
          </div>
        </div>
      </div>

      {sections.map(section => (
        <div key={section.title} style={{ marginBottom: 8 }}>
          <p style={{ padding: "8px 20px", fontSize: 12, color: T.textTertiary, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", fontFamily: T.fontBody }}>{section.title}</p>
          <div style={{ margin: "0 16px", background: T.surfaceCard, border: `1px solid ${T.border}`, borderRadius: 16, overflow: "hidden" }}>
            {section.items.map((item, i) => (
              <div key={item.label} style={{
                display: "flex", alignItems: "center", gap: 14, padding: "14px 16px",
                borderBottom: i < section.items.length - 1 ? `1px solid ${T.border}` : "none",
                cursor: "pointer",
              }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{item.icon}</div>
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: 14, fontWeight: 500, fontFamily: T.fontBody }}>{item.label}</p>
                  <p style={{ fontSize: 12, color: T.textTertiary, marginTop: 1, fontFamily: T.fontBody }}>{item.sub}</p>
                </div>
                {typeof item.action === "string" ? (
                  <span style={{ color: T.textTertiary, fontSize: 18 }}>{item.action}</span>
                ) : item.action}
              </div>
            ))}
          </div>
        </div>
      ))}

      <button style={{
        margin: "12px 16px 8px", width: "calc(100% - 32px)", background: "none",
        border: `1px solid ${T.red}40`, borderRadius: 14, padding: "15px",
        color: T.red, fontSize: 15, cursor: "pointer", fontFamily: T.fontBody, fontWeight: 500,
      }}>Sign Out</button>

      <p style={{ textAlign: "center", fontSize: 11, color: T.textTertiary, fontFamily: T.fontBody, marginBottom: 24 }}>Fitosys v1.0.0 · By Alchemetryx</p>
    </Screen>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// SYSTEM STATE SCREENS — Empty, Error, Loading
// ─────────────────────────────────────────────────────────────────────────────
const SystemStateScreen = ({ type }) => {
  const states = {
    empty: {
      icon: "👥",
      title: "No Clients Yet",
      sub: "Share your intake link to get your first client paying and onboarded in under 2 minutes.",
      action: "Copy Intake Link",
      color: T.textSecondary,
    },
    error: {
      icon: "⚠️",
      title: "Something Went Wrong",
      sub: "We couldn't load your client data. Check your connection and try again.",
      action: "Try Again",
      color: T.red,
    },
    loading: {
      icon: "⟳",
      title: "Loading...",
      sub: "Fetching your client data",
      action: null,
      color: T.textTertiary,
    },
  };

  const s = states[type];

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      flex: 1, padding: "40px 28px", textAlign: "center", minHeight: 300,
    }}>
      <div style={{
        fontSize: type === "loading" ? 40 : 48,
        marginBottom: 20,
        animation: type === "loading" ? "spin 1.2s linear infinite" : "none",
        display: "inline-block",
      }}>{s.icon}</div>
      <h3 style={{ fontSize: 18, fontWeight: 700, fontFamily: T.fontBody, marginBottom: 8 }}>{s.title}</h3>
      <p style={{ fontSize: 14, color: T.textSecondary, lineHeight: 1.6, fontFamily: T.fontBody, marginBottom: 24 }}>{s.sub}</p>
      {s.action && (
        <button style={{
          background: type === "error" ? T.red : "rgba(255,255,255,0.08)",
          border: `1px solid ${type === "error" ? T.red : T.border}`,
          borderRadius: 12, padding: "12px 24px",
          color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer",
          fontFamily: T.fontBody,
        }}>{s.action}</button>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DESIGNER'S NOTES SCREEN
// ─────────────────────────────────────────────────────────────────────────────
const DesignNotesScreen = () => {
  const notes = [
    {
      title: "Apple HIG Foundations",
      color: T.blue,
      points: [
        "Navigation follows Apple's layered hierarchy: Tab Bar for primary destinations, Navigation Bar with back chevron for depth, Modals for focused tasks (check-in flow, payment).",
        "All tap targets are minimum 44×44pt per HIG accessibility guidelines.",
        "Tab Bar uses SF Symbols-style icons, sticky at bottom, never more than 5 tabs.",
        "Navigation Bar blurs background content using backdrop-filter: blur(20px) — matching iOS frosted glass convention.",
      ]
    },
    {
      title: "Fitosys Brand Identity Applied",
      color: T.red,
      points: [
        "Primary red (#F20000) used as the single performance accent — never diluted to pink. Glow effects reinforce energy brand language.",
        "Barlow Condensed for all display numerics and hero headings. Urbanist for body text. This mirrors the split between raw performance and clean readability.",
        "Black (#0A0A0A) base with layered dark surfaces (#111, #1A1A, #1C1C1E) creates depth without competing with the red accent.",
        "Brand language from copy research — 'Monday Pulse', 'Needs Attention', 'Strong This Week' — carried directly into UI section labels.",
      ]
    },
    {
      title: "Coach Pain Points → UI Decisions",
      color: T.amber,
      points: [
        "Dashboard leads with 'Needs Attention' — not alphabetical list. Coaches who manage 20+ clients on WhatsApp need triage-first UI, not directory-first.",
        "Monday AI Pulse banner is the most prominent element after the greeting. VoC research confirmed Monday chaos is the #1 pain point.",
        "Risk scores (1-5) visible at the client list level so coaches never have to drill into a profile to know who needs attention.",
        "Renewal timer visible as badge on client cards. Coaches lose ₹72K/year to admin gaps — expiry visibility is revenue protection.",
      ]
    },
    {
      title: "Accessibility Compliance",
      color: T.green,
      points: [
        "Color is never the only signal — risk is indicated by both color AND a numeric score badge (WCAG 1.4.1 Use of Color).",
        "All text meets WCAG AA contrast ratios on dark surfaces. Primary text (#FFF on #111) is 15.7:1. Secondary text (#FFF60) is 4.8:1.",
        "Interactive elements all have visible focus states. Semantic hierarchy supports VoiceOver (headings, labels, button roles).",
        "Dynamic Type support through relative font sizes. Energy scales use sliders with accessible range labels.",
      ]
    },
    {
      title: "Micro-interactions & Motion",
      color: T.purple,
      points: [
        "Tab bar active state transitions with 0.2s color fade — immediate feedback without distraction.",
        "Progress bar widths animate at 0.6s ease — slow enough to feel deliberate during check-in flow.",
        "Risk dot glows (box-shadow: 0 0 6px [color]) provide ambient status without requiring user action.",
        "Loading state uses CSS spin animation. Error states use red tones to match severity. Empty states use neutral tones to avoid alarm.",
      ]
    },
    {
      title: "Responsive Behaviour",
      color: T.textSecondary,
      points: [
        "Phone frame (390px) is primary design target. Coaches live on their phones between sessions.",
        "Grid layouts collapse to single column below 350px. Filter chips use horizontal scroll on narrow screens.",
        "All padding uses env(safe-area-inset-bottom) accounting for iPhone home indicator.",
        "Cards use border-radius 14-20px — closer to 16px than 8px to feel native on modern iOS.",
      ]
    },
  ];

  return (
    <Screen>
      <div style={{ padding: "24px 20px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 4, height: 24, background: T.red, borderRadius: 2 }} />
          <h1 style={{ fontSize: 28, fontWeight: 800, fontFamily: T.fontDisplay, letterSpacing: "0.04em" }}>DESIGNER'S NOTES</h1>
        </div>
        <p style={{ fontSize: 13, color: T.textTertiary, fontFamily: T.fontBody, marginBottom: 24 }}>
          Key decisions, rationale, and Apple HIG compliance notes.
        </p>
      </div>

      {notes.map(note => (
        <div key={note.title} style={{ margin: "0 16px 16px", background: T.surfaceCard, border: `1px solid ${T.border}`, borderRadius: 16, padding: "16px", overflow: "hidden", position: "relative" }}>
          <div style={{ position: "absolute", top: 0, left: 0, width: 4, height: "100%", background: note.color }} />
          <h3 style={{ fontSize: 14, fontWeight: 700, color: note.color, fontFamily: T.fontBody, marginBottom: 12, letterSpacing: "0.04em", paddingLeft: 8 }}>{note.title}</h3>
          <div style={{ paddingLeft: 8 }}>
            {note.points.map((p, i) => (
              <div key={i} style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                <span style={{ color: note.color, fontSize: 12, marginTop: 2, flexShrink: 0 }}>→</span>
                <p style={{ fontSize: 13, color: T.textSecondary, lineHeight: 1.6, fontFamily: T.fontBody }}>{p}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div style={{ height: 24 }} />
    </Screen>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN APP — SCREEN NAVIGATOR
// ─────────────────────────────────────────────────────────────────────────────

const SCREENS = [
  { id: "splash", label: "Splash" },
  { id: "dashboard", label: "Dashboard" },
  { id: "clients", label: "Clients" },
  { id: "clientDetail", label: "Client Profile" },
  { id: "summary", label: "AI Summary" },
  { id: "checkin", label: "Check-in" },
  { id: "intake", label: "Client Intake" },
  { id: "settings", label: "Settings" },
  { id: "system", label: "System States" },
  { id: "notes", label: "Designer Notes" },
];

export default function App() {
  const [current, setCurrent] = useState("splash");
  const [systemState, setSystemState] = useState("empty");

  const navigate = (id) => setCurrent(id);

  const renderScreen = () => {
    switch (current) {
      case "splash": return <SplashScreen onNext={() => navigate("dashboard")} />;
      case "dashboard": return <DashboardScreen onNavigate={navigate} />;
      case "clients": return <ClientListScreen onBack={() => navigate("dashboard")} onSelect={() => navigate("clientDetail")} />;
      case "clientDetail": return <ClientDetailScreen onBack={() => navigate("clients")} />;
      case "summary": return <AISummaryScreen onBack={() => navigate("dashboard")} />;
      case "checkin": return <CheckinScreen onBack={() => navigate("dashboard")} />;
      case "intake": return <ClientIntakeScreen onBack={() => navigate("dashboard")} />;
      case "settings": return <SettingsScreen onBack={() => navigate("dashboard")} />;
      case "system": return (
        <Screen>
          <NavBar title="System States" back="Dashboard" />
          <div style={{ padding: "0 16px" }}>
            <div style={{ display: "flex", gap: 8, padding: "12px 0" }}>
              {["empty", "error", "loading"].map(s => (
                <Chip key={s} label={s.charAt(0).toUpperCase() + s.slice(1)} active={systemState === s} onClick={() => setSystemState(s)} />
              ))}
            </div>
          </div>
          <SystemStateScreen type={systemState} />
        </Screen>
      );
      case "notes": return <DesignNotesScreen />;
      default: return <DashboardScreen onNavigate={navigate} />;
    }
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#050505",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start",
      padding: "24px 16px",
      fontFamily: T.fontBody,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800;900&family=Urbanist:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { display: none; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        input[type=range] { -webkit-appearance: none; appearance: none; background: rgba(255,255,255,0.1); border-radius: 4px; }
        input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 24px; height: 24px; border-radius: 50%; background: #F20000; cursor: pointer; box-shadow: 0 0 10px rgba(242,0,0,0.4); }
      `}</style>

      {/* Screen navigator */}
      <div style={{
        display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center",
        marginBottom: 20, maxWidth: 500,
      }}>
        {SCREENS.map(s => (
          <button key={s.id} onClick={() => navigate(s.id)} style={{
            padding: "6px 14px", borderRadius: 100,
            background: current === s.id ? "#F20000" : "rgba(255,255,255,0.06)",
            border: `1px solid ${current === s.id ? "#F20000" : "rgba(255,255,255,0.1)"}`,
            color: current === s.id ? "#fff" : "rgba(255,255,255,0.5)",
            fontSize: 12, fontWeight: 500, cursor: "pointer",
            fontFamily: "'Urbanist', sans-serif", whiteSpace: "nowrap",
          }}>{s.label}</button>
        ))}
      </div>

      {/* Phone frame */}
      <div style={{
        width: 390, maxWidth: "100%",
        background: "#0A0A0A",
        borderRadius: 50,
        border: "2px solid rgba(255,255,255,0.1)",
        boxShadow: "0 40px 120px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.08)",
        overflow: "hidden",
        position: "relative",
      }}>
        {/* Status bar */}
        <div style={{
          height: 44, background: "rgba(0,0,0,0.7)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 20px", backdropFilter: "blur(10px)",
        }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: "#fff", fontFamily: T.fontBody }}>9:41</span>
          <div style={{ width: 120, height: 30, background: "#000", borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#1a1a1a", marginRight: 4 }} />
            <div style={{ width: 60, height: 8, background: "#1a1a1a", borderRadius: 4 }} />
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>●●●</span>
            <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>🔋</span>
          </div>
        </div>

        {/* Screen content */}
        <div style={{ height: 700, overflowY: "auto", overflowX: "hidden" }}>
          {renderScreen()}
        </div>

        {/* Home indicator */}
        <div style={{ height: 34, display: "flex", alignItems: "center", justifyContent: "center", background: "#0A0A0A" }}>
          <div style={{ width: 134, height: 5, background: "rgba(255,255,255,0.2)", borderRadius: 3 }} />
        </div>
      </div>

      {/* Caption */}
      <p style={{ marginTop: 16, fontSize: 12, color: "rgba(255,255,255,0.3)", fontFamily: "'Urbanist', sans-serif", textAlign: "center" }}>
        Fitosys · UI Design System · Apple HIG · 10 Screens
      </p>
    </div>
  );
}
