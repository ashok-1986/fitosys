"use client";

import React, { useState } from "react";
import { Avatar, Badge, Switch } from "@/components/ui/design-system";
import { NavBar } from "@/components/ui/navigation";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SettingsScreen() {
  const [automationState, setAutomationState] = useState({
    schedule: true,
    summary: true,
    renewal: true,
    instant: false,
  });

  const handleToggle = (key: keyof typeof automationState) => {
    setAutomationState(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const sections = [
    {
      title: "Account",
      items: [
        { icon: "👤", label: "Profile Details", sub: "Ashok Kumar · ashok@gmail.com", action: <ChevronRight className="h-5 w-5 text-white/30" /> },
        { icon: "💳", label: "Billing & Plan", sub: "Pro · ₹2,499/month", action: <ChevronRight className="h-5 w-5 text-white/30" /> },
        { icon: "🔔", label: "Notifications", sub: "WhatsApp, Push, Email", action: <ChevronRight className="h-5 w-5 text-white/30" /> },
      ]
    },
    {
      title: "Automation",
      items: [
        { icon: "📅", label: "Check-in Schedule", sub: "Sunday 7:00 PM", action: <Switch on={automationState.schedule} onToggle={() => handleToggle('schedule')} /> },
        { icon: "🤖", label: "Monday AI Summary", sub: "Monday 7:00 AM", action: <Switch on={automationState.summary} onToggle={() => handleToggle('summary')} /> },
        { icon: "🔄", label: "Renewal Reminders", sub: "7 days before expiry", action: <Switch on={automationState.renewal} onToggle={() => handleToggle('renewal')} /> },
        { icon: "⚡", label: "Instant Notifications", sub: "Client payment & sign-up", action: <Switch on={automationState.instant} onToggle={() => handleToggle('instant')} /> },
      ]
    },
    {
      title: "Integration",
      items: [
        { icon: "💬", label: "WhatsApp (Interakt)", sub: "🟡 Setup Pending", action: <ChevronRight className="h-5 w-5 text-white/30" /> },
        { icon: "💰", label: "Razorpay Payments", sub: "✅ Connected", action: <ChevronRight className="h-5 w-5 text-white/30" /> },
        { icon: "🤖", label: "Gemini AI", sub: "✅ Active", action: <ChevronRight className="h-5 w-5 text-white/30" /> },
      ]
    },
  ];

  return (
    <div className="flex-1 w-full bg-[#0A0A0A] text-white font-sans overflow-y-auto pb-24">
      <NavBar title="Settings" back="Dashboard" backHref="/dashboard" />

      {/* ── Profile Card ── */}
      <div className="mx-4 my-4 bg-[#1C1C1E] border border-white/10 rounded-[20px] p-5 flex gap-[14px] items-center">
        <Avatar name="Ashok Kumar" size={56} />
        <div>
          <p className="text-lg font-bold font-sans">Ashok Kumar</p>
          <p className="text-[13px] text-white/60 font-sans mt-0.5">Fitness Coach · Mumbai</p>
          <div className="mt-2">
            <Badge label="PRO MANAGER" color="#F20000" />
          </div>
        </div>
      </div>

      {/* ── Settings Sections ── */}
      {sections.map(section => (
        <div key={section.title} className="mb-6">
          <p className="px-5 py-2 text-xs text-white/40 font-semibold tracking-widest uppercase font-sans">
            {section.title}
          </p>
          <div className="mx-4 bg-[#1C1C1E] border border-white/10 rounded-2xl overflow-hidden">
            {section.items.map((item, i) => (
              <div 
                key={item.label} 
                className={cn(
                  "flex items-center gap-[14px] p-4 cursor-pointer hover:bg-white/5 transition-colors active:bg-white/10",
                  i < section.items.length - 1 ? "border-b border-white/5" : ""
                )}
              >
                <div className="w-[34px] h-[34px] rounded-[10px] bg-white/5 flex items-center justify-center text-base shrink-0">
                  {item.icon}
                </div>
                <div className="flex-1">
                  <p className="text-[14px] font-medium font-sans text-white/90">{item.label}</p>
                  <p className="text-xs text-white/40 mt-0.5 font-sans">{item.sub}</p>
                </div>
                <div className="shrink-0 flex items-center justify-center">
                  {item.action}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* ── Sign Out Button ── */}
      <button className="mx-4 mb-4 w-[calc(100%-32px)] bg-transparent border border-[#F20000]/40 rounded-xl p-[14px] text-[#F20000] text-[15px] font-medium font-sans cursor-pointer hover:bg-[#F20000]/10 transition-colors active:scale-[0.98]">
        Sign Out
      </button>

      <p className="text-center text-[11px] text-white/30 font-sans mb-8">
        Fitosys v1.0.0 · Designed with Alchemetryx
      </p>
    </div>
  );
}
