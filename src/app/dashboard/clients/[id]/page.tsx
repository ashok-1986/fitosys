"use client";

import React from "react";
import { Avatar, Badge } from "@/components/ui/design-system";
import { NavBar } from "@/components/ui/navigation";
import { useRouter } from "next/navigation";

export default function ClientDetailScreen({ params }: { params: { id: string } }) {
  const router = useRouter();
  const client = { 
    name: "Rohan Mehta", 
    program: "12-Week Shred", 
    energy: 4, 
    sessions: 1, 
    risk: 4, 
    daysLeft: 5, 
    weight: "78kg", 
    startWeight: "84kg", 
    goal: "Fat Loss", 
    enrolled: "Jan 6, 2026" 
  };

  const weekData = [7, 6, 5, 8, 4, 5, 4];
  const barMax = 10;

  return (
    <div className="flex-1 w-full bg-[#0A0A0A] text-white font-sans overflow-y-auto pb-24">
      <NavBar 
        title="Client Profile" 
        back="Clients" 
        backHref="/dashboard/clients" 
        action="Message" 
      />

      {/* ── Hero Profile ── */}
      <div 
        className="mx-4 mt-2 mb-6 rounded-[20px] p-5 border border-[#F20000]/20"
        style={{ background: `linear-gradient(135deg, #F2000018, #1C1C1E)` }}
      >
        <div className="flex gap-4 items-center">
          <Avatar name={client.name} size={60} risk={client.risk} />
          <div>
            <h2 className="text-xl font-bold font-sans">{client.name}</h2>
            <p className="text-[13px] text-white/60 font-sans mt-0.5">{client.program}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              <Badge label="⚠ High Risk" color="#F20000" />
              <Badge label={`${client.daysLeft} days left`} color="#FF9F0A" />
            </div>
          </div>
        </div>

        {/* ── AI Insight ── */}
        <div className="mt-5 p-3.5 rounded-xl border border-[#F20000]/20 bg-[#F20000]/5">
          <p className="text-xs text-[#F20000] font-bold mb-1.5 font-sans tracking-wide">🤖 AI INSIGHT</p>
          <p className="text-[13px] text-white/70 leading-relaxed font-sans">
            Rohan's energy has dropped from 7 to 4 over three weeks. Only 1 session this week. 
            Renewal in 5 days — high churn risk. Call today.
          </p>
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-3 gap-2 px-4 mb-4">
        <div className="bg-[#1C1C1E] border border-white/10 rounded-xl p-3 text-center flex flex-col items-center justify-center h-24">
          <p className="text-xl font-bold text-[#F20000] font-barlow tracking-wide">4<span className="text-sm">/10</span></p>
          <p className="text-[11px] text-white/40 font-sans mt-1 uppercase tracking-wider font-semibold">Energy</p>
        </div>
        <div className="bg-[#1C1C1E] border border-white/10 rounded-xl p-3 text-center flex flex-col items-center justify-center h-24">
          <p className="text-xl font-bold text-[#FF9F0A] font-barlow tracking-wide">1</p>
          <p className="text-[11px] text-white/40 font-sans mt-1 uppercase tracking-wider font-semibold">Sessions</p>
        </div>
        <div className="bg-[#1C1C1E] border border-white/10 rounded-xl p-3 text-center flex flex-col items-center justify-center h-24">
          <p className="text-xl font-bold text-[#34C759] font-barlow tracking-wide">−6kg</p>
          <p className="text-[11px] text-white/40 font-sans mt-1 uppercase tracking-wider font-semibold">Progress</p>
        </div>
      </div>

      {/* ── Energy Trend Chart ── */}
      <div className="mx-4 mb-6 bg-[#1C1C1E] border border-white/10 rounded-2xl p-4">
        <p className="text-[13px] font-semibold mb-6 font-sans text-white/60 uppercase tracking-widest">
          Energy Trend — 7 Weeks
        </p>
        <div className="flex gap-2 items-end h-[72px]">
          {weekData.map((v, i) => {
            const isRed = v <= 4;
            const isOrange = v <= 6 && v > 4;
            const color = isRed ? "#F20000" : isOrange ? "#FF9F0A" : "#34C759";
            
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div 
                  className="w-full rounded-sm transition-all duration-500 max-w-[24px]"
                  style={{
                    height: `${(v / barMax) * 54}px`,
                    background: `linear-gradient(180deg, ${color}, ${color}88)`,
                  }} 
                />
                <span className="text-[9px] text-white/40 font-sans font-medium uppercase tracking-wider">
                  W{i + 1}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Action Buttons ── */}
      <div className="px-4 flex gap-2.5">
        <button className="flex-1 bg-[#F20000] hover:bg-[#C20000] border-none rounded-xl p-[14px] text-white text-sm font-bold font-barlow tracking-widest uppercase transition-colors active:scale-[0.98]">
          Send Renewal
        </button>
        <button className="flex-1 bg-[#1C1C1E] hover:bg-white/10 border border-white/10 rounded-xl p-[14px] text-white text-sm font-semibold font-sans transition-colors active:scale-[0.98]">
          View History
        </button>
      </div>
    </div>
  );
}
