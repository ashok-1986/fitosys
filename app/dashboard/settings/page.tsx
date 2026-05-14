"use client";

import { useState, useEffect } from "react";

interface CoachProfile {
  id: string;
  full_name: string;
  whatsapp_number: string;
  city: string | null;
  coaching_type: string[];
  upi_id: string | null;
  payment_instructions: string | null;
  accepted_payment_methods: string[];
  checkin_day: number;
  checkin_time: string;
  timezone: string;
}

const COACHING_TYPES = ["Fitness", "Yoga", "Wellness", "Nutrition", "Strength", "Mobility"];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const generateTimes = () => {
  const times = [];
  for (let h = 6; h <= 22; h++) {
    for (let m = 0; m < 60; m += 30) {
      if (h === 22 && m === 30) continue;
      const hh = h.toString().padStart(2, '0');
      const mm = m.toString().padStart(2, '0');
      const suffix = h >= 12 ? 'PM' : 'AM';
      let displayH = h > 12 ? h - 12 : h;
      if (h === 12) displayH = 12; // 12 PM
      if (h === 0) displayH = 12; // 12 AM
      times.push({ value: `${hh}:${mm}`, label: `${displayH}:${mm} ${suffix}` });
    }
  }
  return times;
};
const TIMES = generateTimes();

import { Loader2 } from "lucide-react";

const PLAN_AMOUNTS: Record<string, number> = {
  starter: 999,
  basic: 1499,
  pro: 2999,
  studio: 5999,
}

const PLAN_CLIENT_LIMITS: Record<string, string> = {
  starter: "10 clients",
  basic: "25 clients",
  pro: "50 clients",
  studio: "Unlimited",
}

interface SubData {
  plan: string;
  client_limit: number | null;
  active_clients: number;
  utilisation_pct: number;
  show_upgrade_prompt: boolean;
  amount_inr: number;
  billing_cycle: string;
  current_period_end: string | null;
  days_remaining: number | null;
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<CoachProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const [subData, setSubData] = useState<SubData | null>(null);
  const [subLoading, setSubLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);

  // Section 1 State
  const [fullName, setFullName] = useState("");
  const [city, setCity] = useState("");
  const [coachingType, setCoachingType] = useState<string[]>([]);
  const [savingSec1, setSavingSec1] = useState(false);
  const [successSec1, setSuccessSec1] = useState(false);
  const [errorSec1, setErrorSec1] = useState("");

  // Section 2 State
  const [upiId, setUpiId] = useState("");
  const [paymentInstructions, setPaymentInstructions] = useState("");
  const [acceptedMethods, setAcceptedMethods] = useState<string[]>([]);
  const [savingSec2, setSavingSec2] = useState(false);
  const [successSec2, setSuccessSec2] = useState(false);
  const [errorSec2, setErrorSec2] = useState("");

  // Section 3 State
  const [checkinDay, setCheckinDay] = useState(0);
  const [checkinTime, setCheckinTime] = useState("06:00");
  const [savingSec3, setSavingSec3] = useState(false);
  const [successSec3, setSuccessSec3] = useState(false);
  const [errorSec3, setErrorSec3] = useState("");

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/coaches/settings");
      if (res.ok) {
        const data: CoachProfile = await res.json();
        setProfile(data);

        setFullName(data.full_name || "");
        setCity(data.city || "");
        setCoachingType(data.coaching_type || []);

        setUpiId(data.upi_id || "");
        setPaymentInstructions(data.payment_instructions || "");
        setAcceptedMethods(data.accepted_payment_methods || []);

        setCheckinDay(data.checkin_day ?? 0);
        setCheckinTime(data.checkin_time || "06:00");
      }

      fetch('/api/subscriptions/current')
        .then(r => r.json())
        .then(d => setSubData(d))
        .catch(() => setSubData(null))
        .finally(() => setSubLoading(false))
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSaveSec1 = async () => {
    setSavingSec1(true);
    setErrorSec1("");
    try {
      const res = await fetch("/api/coaches/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ full_name: fullName, city, coaching_type: coachingType })
      });
      if (!res.ok) {
        const errObj = await res.json();
        throw new Error(errObj.error || "Failed to save");
      }
      setSuccessSec1(true);
      setTimeout(() => setSuccessSec1(false), 2000);
      await fetchProfile();
    } catch (err: any) {
      setErrorSec1(err.message || "Failed to save");
    } finally {
      setSavingSec1(false);
    }
  };

  const handleSaveSec2 = async () => {
    setSavingSec2(true);
    setErrorSec2("");
    try {
      const res = await fetch("/api/coaches/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ upi_id: upiId, payment_instructions: paymentInstructions, accepted_payment_methods: acceptedMethods })
      });
      if (!res.ok) {
        const errObj = await res.json();
        throw new Error(errObj.error || "Failed to save");
      }
      setSuccessSec2(true);
      setTimeout(() => setSuccessSec2(false), 2000);
      await fetchProfile();
    } catch (err: any) {
      setErrorSec2(err.message || "Failed to save");
    } finally {
      setSavingSec2(false);
    }
  };

  const handleSaveSec3 = async () => {
    setSavingSec3(true);
    setErrorSec3("");
    try {
      const res = await fetch("/api/coaches/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ checkin_day: checkinDay, checkin_time: checkinTime })
      });
      if (!res.ok) {
        const errObj = await res.json();
        throw new Error(errObj.error || "Failed to save");
      }
      setSuccessSec3(true);
      setTimeout(() => setSuccessSec3(false), 2000);
      await fetchProfile();
    } catch (err: any) {
      setErrorSec3(err.message || "Failed to save");
    } finally {
      setSavingSec3(false);
    }
  };

  const toggleCoachingType = (type: string) => {
    setCoachingType(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };

  const togglePaymentMethod = (method: string) => {
    setAcceptedMethods(prev => prev.includes(method) ? prev.filter(m => m !== method) : [...prev, method]);
  };

  async function handleSubscribe(plan: string) {
    setSubscribing(true);
    try {
      const res = await fetch('/api/subscriptions/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan })
      });
      const data = await res.json();
      if (res.ok && data.short_url) {
        window.open(data.short_url, '_blank');
      } else {
        alert(data.error || 'Failed to create subscription');
      }
    } finally {
      setSubscribing(false);
    }
  }

  async function handleCancel() {
    if (!confirm('Cancel your subscription? You keep access until the end of your billing period.')) return;
    const res = await fetch('/api/subscriptions/cancel', { method: 'POST' });
    const data = await res.json();
    if (res.ok) {
      alert('Subscription cancelled. Access until ' + data.access_until);
      fetch('/api/subscriptions/current').then(r => r.json()).then(d => setSubData(d));
    } else {
      alert(data.error || 'Failed to cancel');
    }
  }

  if (loading) return <div className="text-white p-8">Loading...</div>;
  if (!profile) return <div className="text-white p-8">Profile not found.</div>;

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-6 lg:p-8">
      <div className="max-w-[720px] mx-0 space-y-5">
        <h1 className="font-['Barlow_Condensed'] text-[32px] uppercase text-white font-medium mb-6">Settings</h1>

        {/* Section 1 - Profile */}
        <section className="bg-[#111111] border border-[rgba(255,255,255,0.06)] rounded-[10px] p-6">
          <div className="mb-6">
            <h2 className="font-['Barlow_Condensed'] font-medium text-[20px] uppercase tracking-[0.02em] text-white">Profile</h2>
            <p className="font-['Urbanist'] text-[14px] text-[#888888]">Update your personal information and coaching specialization.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-['Urbanist'] text-[13px] font-medium text-[#C8C8C8] mb-2">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                disabled={savingSec1}
                className="w-full bg-[#1a1a1a] border border-[rgba(255,255,255,0.08)] rounded-[6px] px-3 py-2.5 text-[14px] text-white focus:outline-none focus:border-[rgba(232,0,29,0.5)] transition-colors disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block font-['Urbanist'] text-[13px] font-medium text-[#C8C8C8] mb-2">WhatsApp Number</label>
              <input
                type="text"
                value={profile.whatsapp_number}
                disabled
                className="w-full bg-[#1a1a1a] border border-[rgba(255,255,255,0.08)] rounded-[6px] px-3 py-2.5 text-[14px] text-white opacity-60 cursor-not-allowed"
              />
              <p className="text-[#888888] text-xs mt-1.5 font-['Urbanist']">Contact support to change your WhatsApp number.</p>
            </div>

            <div>
              <label className="block font-['Urbanist'] text-[13px] font-medium text-[#C8C8C8] mb-2">City</label>
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                disabled={savingSec1}
                className="w-full bg-[#1a1a1a] border border-[rgba(255,255,255,0.08)] rounded-[6px] px-3 py-2.5 text-[14px] text-white focus:outline-none focus:border-[rgba(232,0,29,0.5)] transition-colors disabled:opacity-50"
              />
            </div>

            <div>
              <label className="block font-['Urbanist'] text-[13px] font-medium text-[#C8C8C8] mb-2">Coaching Type</label>
              <div className="flex flex-wrap gap-2">
                {COACHING_TYPES.map(type => {
                  const isSelected = coachingType.includes(type);
                  return (
                    <button
                      key={type}
                      type="button"
                      disabled={savingSec1}
                      onClick={() => toggleCoachingType(type)}
                      className={`px-3 py-1.5 rounded-full text-[13px] font-['Urbanist'] font-medium transition-colors border disabled:opacity-50 ${isSelected ? 'bg-[rgba(232,0,29,0.15)] border-[rgba(232,0,29,0.4)] text-[#E8001D]' : 'bg-[#1a1a1a] border-[rgba(255,255,255,0.08)] text-[#888888]'}`}
                    >
                      {type}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={handleSaveSec1}
                disabled={savingSec1}
                className="bg-[#E8001D] hover:bg-[#C20000] text-white font-['Urbanist'] font-bold text-[13px] uppercase tracking-[0.04em] px-5 py-2.5 rounded-[6px] transition-colors disabled:opacity-50 min-w-[80px] flex justify-center"
              >
                {savingSec1 ? (
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                ) : 'Save'}
              </button>
              {successSec1 && <span className="text-[#10B981] font-['Urbanist'] text-[13px] font-medium">Saved</span>}
              {errorSec1 && <span className="text-red-500 font-['Urbanist'] text-[13px]">{errorSec1}</span>}
            </div>
          </div>
        </section>

        {/* Section 2 - Payment Details */}
        <section className="bg-[#111111] border border-[rgba(255,255,255,0.06)] rounded-[10px] p-6">
          <div className="mb-6">
            <h2 className="font-['Barlow_Condensed'] font-medium text-[20px] uppercase tracking-[0.02em] text-white">How your clients pay you</h2>
            <p className="font-['Urbanist'] text-[14px] text-[#888888]">Fitosys never touches your client payments. Add your UPI ID so clients see it on your onboarding page.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-['Urbanist'] text-[13px] font-medium text-[#C8C8C8] mb-2">UPI ID</label>
              <input
                type="text"
                placeholder="yourname@upi"
                value={upiId}
                onChange={e => setUpiId(e.target.value)}
                disabled={savingSec2}
                className="w-full bg-[#1a1a1a] border border-[rgba(255,255,255,0.08)] rounded-[6px] px-3 py-2.5 text-[14px] text-white focus:outline-none focus:border-[rgba(232,0,29,0.5)] transition-colors disabled:opacity-50 placeholder:text-[#555]"
              />
            </div>

            <div>
              <label className="block font-['Urbanist'] text-[13px] font-medium text-[#C8C8C8] mb-2">Payment Instructions <span className="text-[#555] ml-1 font-normal">(Max 200 chars)</span></label>
              <textarea
                placeholder="Pay via GPay to 9876543210@okaxis. Send screenshot to confirm."
                maxLength={200}
                value={paymentInstructions}
                onChange={e => setPaymentInstructions(e.target.value)}
                disabled={savingSec2}
                className="w-full bg-[#1a1a1a] border border-[rgba(255,255,255,0.08)] rounded-[6px] px-3 py-2.5 text-[14px] text-white focus:outline-none focus:border-[rgba(232,0,29,0.5)] transition-colors min-h-[80px] disabled:opacity-50 placeholder:text-[#555]"
              />
            </div>

            <div>
              <label className="block font-['Urbanist'] text-[13px] font-medium text-[#C8C8C8] mb-3">Accepted Methods</label>
              <div className="space-y-2.5">
                {["UPI", "Bank Transfer", "Cash"].map(method => (
                  <label key={method} className="flex items-center gap-3 cursor-pointer group w-fit">
                    <input
                      type="checkbox"
                      checked={acceptedMethods.includes(method)}
                      onChange={() => togglePaymentMethod(method)}
                      disabled={savingSec2}
                      className="w-4 h-4 rounded border-[rgba(255,255,255,0.08)] bg-[#1a1a1a] text-[#E8001D] focus:ring-[#E8001D] focus:ring-offset-0 disabled:opacity-50"
                    />
                    <span className="font-['Urbanist'] text-[14px] text-white group-hover:text-[#E8001D] transition-colors">{method}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={handleSaveSec2}
                disabled={savingSec2}
                className="bg-[#E8001D] hover:bg-[#C20000] text-white font-['Urbanist'] font-bold text-[13px] uppercase tracking-[0.04em] px-5 py-2.5 rounded-[6px] transition-colors disabled:opacity-50 min-w-[80px] flex justify-center"
              >
                {savingSec2 ? (
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                ) : 'Save'}
              </button>
              {successSec2 && <span className="text-[#10B981] font-['Urbanist'] text-[13px] font-medium">Saved</span>}
              {errorSec2 && <span className="text-red-500 font-['Urbanist'] text-[13px]">{errorSec2}</span>}
            </div>
          </div>
        </section>

        {/* Section 3 - Check-in Schedule */}
        <section className="bg-[#111111] border border-[rgba(255,255,255,0.06)] rounded-[10px] p-6">
          <div className="mb-6">
            <h2 className="font-['Barlow_Condensed'] font-medium text-[20px] uppercase tracking-[0.02em] text-white">Check-in Schedule</h2>
            <p className="font-['Urbanist'] text-[14px] text-[#888888]">Set when your clients will submit their check-ins.</p>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-['Urbanist'] text-[13px] font-medium text-[#C8C8C8] mb-2">Check-in Day</label>
                <select
                  value={checkinDay}
                  onChange={e => setCheckinDay(Number(e.target.value))}
                  disabled={savingSec3}
                  className="w-full bg-[#1a1a1a] border border-[rgba(255,255,255,0.08)] rounded-[6px] px-3 py-2.5 text-[14px] text-white focus:outline-none focus:border-[rgba(232,0,29,0.5)] transition-colors disabled:opacity-50"
                  style={{ WebkitAppearance: 'none', appearance: 'none' }}
                >
                  {DAYS.map((day, idx) => (
                    <option key={idx} value={idx}>{day}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-['Urbanist'] text-[13px] font-medium text-[#C8C8C8] mb-2">Check-in Time</label>
                <select
                  value={checkinTime}
                  onChange={e => setCheckinTime(e.target.value)}
                  disabled={savingSec3}
                  className="w-full bg-[#1a1a1a] border border-[rgba(255,255,255,0.08)] rounded-[6px] px-3 py-2.5 text-[14px] text-white focus:outline-none focus:border-[rgba(232,0,29,0.5)] transition-colors disabled:opacity-50"
                  style={{ WebkitAppearance: 'none', appearance: 'none' }}
                >
                  {TIMES.map(t => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-['Urbanist'] text-[13px] font-medium text-[#C8C8C8] mb-2">Timezone</label>
              <input
                type="text"
                value={profile.timezone}
                disabled
                className="w-full bg-[#1a1a1a] border border-[rgba(255,255,255,0.08)] rounded-[6px] px-3 py-2.5 text-[14px] text-white opacity-60 cursor-not-allowed"
              />
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={handleSaveSec3}
                disabled={savingSec3}
                className="bg-[#E8001D] hover:bg-[#C20000] text-white font-['Urbanist'] font-bold text-[13px] uppercase tracking-[0.04em] px-5 py-2.5 rounded-[6px] transition-colors disabled:opacity-50 min-w-[80px] flex justify-center"
              >
                {savingSec3 ? (
                  <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                ) : 'Save'}
              </button>
              {successSec3 && <span className="text-[#10B981] font-['Urbanist'] text-[13px] font-medium">Saved</span>}
              {errorSec3 && <span className="text-red-500 font-['Urbanist'] text-[13px]">{errorSec3}</span>}
            </div>
          </div>
        </section>

        {/* Section 4 - Billing & Plan */}
        <section className="bg-[#111111] border border-[rgba(255,255,255,0.06)] rounded-[10px] p-6">
          <div className="mb-6">
            <h2 className="font-['Barlow_Condensed'] font-medium text-[20px] uppercase tracking-[0.02em] text-white">Billing & Plan</h2>
            <p className="font-['Urbanist'] text-[14px] text-[#888888]">Manage your Fitosys subscription</p>
          </div>

          {subLoading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: "40px" }}>
              <Loader2 className="animate-spin" style={{ color: "#E8001D", width: "20px", height: "20px" }} />
            </div>
          ) : subData && (
            <div>
              {/* Block 1 - Current plan row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingBottom: "20px", marginBottom: "20px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                <div>
                  <div style={{ display: "inline-block", marginBottom: "8px", background: "rgba(232,0,29,0.1)", color: "#E8001D", fontSize: "11px", fontWeight: 700, padding: "3px 12px", borderRadius: "20px" }}>
                    {subData.plan.toUpperCase()}
                  </div>

                  {subData.amount_inr > 0 && (
                    <div style={{ fontSize: "18px", fontWeight: 700, color: "white" }}>
                      ₹{subData.amount_inr}/month
                    </div>
                  )}

                  {subData.current_period_end && (
                    <div style={{ fontSize: "12px", color: "#888888", marginTop: "4px" }}>
                      Renews {new Date(subData.current_period_end).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  )}

                  {subData.days_remaining !== null && subData.days_remaining <= 7 && (
                    <div style={{ fontSize: "12px", color: "#F59E0B", marginTop: "4px" }}>
                      ⚠ {subData.days_remaining} days remaining
                    </div>
                  )}
                </div>

                {subData.plan !== 'trial' && (
                  <button
                    onClick={handleCancel}
                    style={{ padding: "8px 16px", background: "transparent", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", fontSize: "12px", fontWeight: 600, color: "#888888", cursor: "pointer" }}
                    onMouseOver={(e) => { e.currentTarget.style.borderColor = "rgba(239,68,68,0.4)"; e.currentTarget.style.color = "#EF4444"; }}
                    onMouseOut={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#888888"; }}
                  >
                    Cancel Plan
                  </button>
                )}
              </div>

              {/* Block 2 - Client usage */}
              <div>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "white", marginBottom: "10px" }}>Client Usage</div>
                <div style={{ background: "#1a1a1a", borderRadius: "99px", height: "6px", overflow: "hidden", marginBottom: "8px" }}>
                  <div style={{ width: `${subData.utilisation_pct}%`, height: "100%", borderRadius: "99px", transition: "width 0.4s ease", background: subData.utilisation_pct >= 90 ? "#EF4444" : subData.utilisation_pct >= 70 ? "#F59E0B" : "#10B981" }} />
                </div>
                <div style={{ fontSize: "12px", color: "#888888" }}>
                  {subData.active_clients} of {subData.client_limit ?? '∞'} clients used
                </div>
              </div>

              {/* Block 3 - Upgrade section */}
              {(subData.show_upgrade_prompt || subData.plan === 'trial') && (
                <div>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "white", marginTop: "24px", marginBottom: "16px" }}>Choose a Plan</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
                    {['starter', 'basic', 'pro', 'studio'].filter(p => p !== subData.plan).map(plan => {
                      const isBasic = plan === 'basic';
                      return (
                        <div key={plan} style={{ background: "#1a1a1a", border: isBasic ? "1px solid rgba(232,0,29,0.35)" : "1px solid rgba(255,255,255,0.08)", borderRadius: "10px", padding: "16px" }}>
                          {isBasic && (
                            <div style={{ fontSize: "9px", fontWeight: 700, color: "#E8001D", letterSpacing: "0.1em", marginBottom: "6px" }}>
                              RECOMMENDED
                            </div>
                          )}
                          <div style={{ fontSize: "11px", fontWeight: 700, color: "#E8001D", letterSpacing: "0.06em", marginBottom: "4px" }}>
                            {plan.toUpperCase()}
                          </div>
                          <div style={{ fontSize: "20px", fontFamily: '"Barlow Condensed", sans-serif', fontWeight: 500, color: "white", marginBottom: "6px" }}>
                            ₹{PLAN_AMOUNTS[plan]}/mo
                          </div>
                          <div style={{ fontSize: "12px", color: "#888888", marginBottom: "14px" }}>
                            {PLAN_CLIENT_LIMITS[plan]}
                          </div>
                          <button
                            onClick={() => handleSubscribe(plan)}
                            disabled={subscribing}
                            onMouseOver={(e) => { if (!isBasic && !subscribing) e.currentTarget.style.background = "rgba(232,0,29,0.1)"; }}
                            onMouseOut={(e) => { if (!isBasic && !subscribing) e.currentTarget.style.background = "transparent"; }}
                            style={{ width: "100%", padding: "9px", background: isBasic ? "#E8001D" : "transparent", border: isBasic ? "none" : "1px solid rgba(232,0,29,0.4)", borderRadius: "6px", fontSize: "12px", fontWeight: 700, color: "white", cursor: subscribing ? "not-allowed" : "pointer" }}
                          >
                            {subscribing ? <Loader2 className="animate-spin mx-auto" size={12} /> : "Subscribe"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
        {/* Section 5 - WhatsApp Configuration */}
        <section className="bg-[#111111] border border-[rgba(255,255,255,0.06)] rounded-[10px] p-6">
          <div className="mb-6">
            <h2 className="font-['Barlow_Condensed'] font-medium text-[20px] uppercase tracking-[0.02em] text-white">WhatsApp Integration</h2>
            <p className="font-['Urbanist'] text-[14px] text-[#888888]">View your WhatsApp connection status for automated client messaging.</p>
          </div>

          <div className="bg-[#1a1a1a] border border-[rgba(255,255,255,0.08)] rounded-[8px] p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-['Urbanist'] text-[15px] font-bold text-white mb-1">System Status</h3>
                <p className="font-['Urbanist'] text-[13px] text-[#888888] max-w-[300px]">
                  Fitosys automated messaging is active. We handle all onboarding, check-ins, and reminders for your clients.
                </p>
              </div>
              <div className="flex items-center gap-2 bg-[#10B981]/10 px-3 py-1.5 rounded-full border border-[#10B981]/20">
                <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse"></div>
                <span className="font-['Urbanist'] text-[11px] font-bold text-[#10B981] uppercase tracking-widest">Enabled</span>
              </div>
            </div>

            <div className="pt-4 border-t border-[rgba(255,255,255,0.06)] flex items-center justify-between">
              <div>
                <span className="block font-['Urbanist'] text-[11px] text-[#888888] font-medium uppercase tracking-widest mb-1">Your Registered Number</span>
                <span className="font-['Urbanist'] text-[14px] font-medium text-white">{profile?.whatsapp_number}</span>
              </div>
              <a
                href={`https://wa.me/917738363495`} 
                target="_blank"
                rel="noreferrer"
                className="bg-[rgba(255,255,255,0.05)] hover:bg-[rgba(255,255,255,0.1)] transition-colors border border-[rgba(255,255,255,0.1)] text-white font-['Urbanist'] text-[12px] font-bold uppercase tracking-widest px-4 py-2 rounded-[6px]"
              >
                Test Notification
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
