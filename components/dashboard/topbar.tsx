"use client";

import { Search } from "lucide-react";

interface TopbarProps {
  coachName?: string;
  coachInitials?: string;
}

export function Topbar({ coachName = "Coach", coachInitials = "C" }: TopbarProps) {
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
        />
      </div>
      
      <div className="topbar-avatar">
        {coachInitials}
      </div>
    </div>
  );
}
