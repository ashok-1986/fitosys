"use client";

import React, { useState } from "react";
import { Avatar, StatCard, Badge, RiskDot, ProgressBar, Chip } from "@/components/ui/design-system";
import { ChevronRight, ArrowRight, Activity, Users, MessageCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function DashboardScreen() {
  const router = useRouter();
  const [tab, setTab] = useState("home");

  const clients = [
    { name: "Rohan Mehta", program: "12-Week Shred", energy: 4, sessions: 1, risk: 4, daysLeft: 5 },
    { name: "Neha Sharma", program: "Yoga Foundations", energy: 7, sessions: 3, risk: 2, daysLeft: 21 },
    { name: "Arjun Kapoor", program: "Strength Phase 2", energy: 9, sessions: 5, risk: 1, daysLeft: 14 },
    { name: "Priya Nair", program: "Fat Loss Sprint", energy: 5, sessions: 2, risk: 3, daysLeft: 3 },
  ];

  return (
    <div className="flex-1 w-full bg-[#0A0A0A] text-white font-sans overflow-y-auto pb-24">
      {/* ── Header ── */}
      <div className="px-5 pt-8 pb-4 flex items-center justify-between">
        <div>
          <p className="text-[13px] text-white/40 mb-1 font-sans">Monday, 3 March</p>
          <h2 className="text-2xl font-bold font-barlow tracking-wider">
            MORNING, <span className="text-[#F20000]">COACH ASHOK</span> <span className="text-xl">👋</span>
          </h2>
        </div>
        <Avatar name="Ashok Kumar" size={42} />
      </div>

      {/* ── Monday Pulse Banner ── */}
      <div 
        onClick={() => router.push("/dashboard/summary")}
        className="mx-4 mb-6 relative overflow-hidden rounded-2xl border border-[#F20000]/30 cursor-pointer active:scale-[0.98] transition-all"
        style={{ background: `linear-gradient(135deg, #F2000018 0%, #111111 100%)` }}
      >
        <div className="p-4 flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#F20000]/10 border border-[#F20000]/20 flex flex-shrink-0 items-center justify-center text-xl">
              🤖
            </div>
            <div>
              <p className="text-[13px] font-bold text-white font-sans">Monday AI Pulse Ready</p>
              <p className="text-xs text-white/50 font-sans mt-0.5">4 clients · 1 needs attention</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-[#F20000]" />
        </div>
      </div>

      {/* ── Stats Row ── */}
      <div className="px-4 grid grid-cols-2 gap-3 mb-8">
        <StatCard label="Active Clients" value="24" sub="vs last month" trend={8} accent="#F20000" icon="👥" />
        <StatCard label="Check-in Rate" value="91%" sub="this week" trend={3} accent="#34C759" icon="✅" />
        <StatCard label="Renewals Due" value="3" sub="next 7 days" accent="#FF9F0A" icon="🔔" />
        <StatCard label="MRR" value="₹36K" sub="vs last month" trend={12} accent="#0A84FF" icon="💰" />
      </div>

      {/* ── Needs Attention Section ── */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold font-barlow tracking-wider">NEEDS ATTENTION</h3>
          <button 
            onClick={() => router.push("/dashboard/clients")}
            className="text-[13px] text-[#F20000] font-medium font-sans hover:underline"
          >
            See All
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {clients.filter(c => c.risk >= 3).map(client => (
            <div 
              key={client.name} 
              onClick={() => router.push(`/dashboard/clients/${client.name.toLowerCase().replace(" ", "-")}`)}
              className={cn(
                "flex items-center gap-3 rounded-[14px] p-3.5 cursor-pointer bg-[#1C1C1E] border transition-colors active:scale-[0.99]",
                client.risk >= 4 ? "border-[#F20000]/30 hover:bg-[#F20000]/5" : "border-white/10 hover:bg-white/5"
              )}
            >
              <Avatar name={client.name} risk={client.risk} size={44} />
              
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center mb-1">
                  <p className="text-[15px] font-semibold font-sans text-white truncate">{client.name}</p>
                  <Badge 
                    label={`Risk ${client.risk}/5`} 
                    color={client.risk >= 4 ? "#F20000" : "#FF9F0A"} 
                  />
                </div>
                
                <p className="text-xs text-white/40 font-sans truncate">{client.program}</p>
                
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[11px] text-white/50 font-sans flex items-center gap-1">
                    ⚡ {client.energy}/10
                  </span>
                  <span className="text-[11px] text-white/50 font-sans flex items-center gap-1">
                    🏋️ {client.sessions} sessions
                  </span>
                  {client.daysLeft <= 7 && (
                    <span className="text-[11px] text-[#FF9F0A] font-medium font-sans flex items-center gap-1">
                      🔔 {client.daysLeft}d left
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
