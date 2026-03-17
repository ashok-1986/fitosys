"use client";

import { Search, Settings, Bell } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface TopbarProps {
  coachName?: string;
  coachInitials?: string;
}

export function Topbar({ coachName = "Coach", coachInitials = "C" }: TopbarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="topbar">
      <div className="topbar-greet">
        <h1>Welcome, {coachName}! 👋</h1>
        <p>Check your daily coaching insights · {today}</p>
      </div>

      <div className="topbar-search">
        <Search className="h-3.5 w-3.5" />
        <input
          type="text"
          placeholder="Search clients, programs…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 hover:bg-white/5 rounded-full transition-colors relative">
          <Bell className="h-4 w-4 text-[#A0A0A0]" />
          <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-brand rounded-full border border-black" />
        </button>

        <Link
          href="/dashboard/settings"
          className="p-2 hover:bg-white/5 rounded-full transition-colors"
          title="Settings"
        >
          <Settings className="h-4 w-4 text-[#A0A0A0]" />
        </Link>

        <div className="topbar-avatar">
          {coachInitials}
        </div>
      </div>
    </div>
  );
}
