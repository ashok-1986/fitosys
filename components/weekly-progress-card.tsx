"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";

type DayData = {
  day: string;
  value: number;
  segments: { height: string; opacity: number }[];
  isHighlight?: boolean;
};

const weekData: DayData[] = [
  {
    day: "Mon",
    value: 56,
    segments: [
      { height: "40%", opacity: 0.3 },
      { height: "30%", opacity: 0.5 },
      { height: "20%", opacity: 0.7 },
    ],
  },
  {
    day: "Tue",
    value: 32,
    segments: [
      { height: "38%", opacity: 0.3 },
      { height: "24%", opacity: 0.5 },
    ],
  },
  {
    day: "Wed",
    value: 68,
    isHighlight: true,
    segments: [
      { height: "28%", opacity: 0.3 },
      { height: "26%", opacity: 0.5 },
      { height: "24%", opacity: 0.7 },
    ],
  },
  {
    day: "Thu",
    value: 44,
    segments: [
      { height: "45%", opacity: 0.3 },
      { height: "20%", opacity: 0.6 },
    ],
  },
  {
    day: "Fri",
    value: 52,
    segments: [
      { height: "38%", opacity: 0.3 },
      { height: "24%", opacity: 0.5 },
    ],
  },
];

const monthData: DayData[] = [
  { day: "W1", value: 42, segments: [{ height: "42%", opacity: 0.3 }, { height: "18%", opacity: 0.5 }] },
  { day: "W2", value: 58, segments: [{ height: "38%", opacity: 0.3 }, { height: "28%", opacity: 0.5 }, { height: "16%", opacity: 0.7 }] },
  { day: "W3", value: 65, isHighlight: true, segments: [{ height: "30%", opacity: 0.3 }, { height: "26%", opacity: 0.5 }, { height: "22%", opacity: 0.7 }] },
  { day: "W4", value: 48, segments: [{ height: "40%", opacity: 0.3 }, { height: "20%", opacity: 0.5 }] },
];

// Heights for pill bars — taller = more value
function getBarHeight(value: number): string {
  const minH = 48;
  const maxH = 144;
  const h = minH + ((value / 100) * (maxH - minH));
  return `${h}px`;
}

type EngagementStat = {
  day: string;
  count: number;
};

export default function WeeklyProgressCard({ stats }: { stats?: EngagementStat[] }) {
  const [view, setView] = useState<"week" | "month">("week");
  
  // Use real stats if provided, otherwise fallback to empty for now (or keep dummy for demo if preferred)
  // For production we want real data.
  const displayData = stats && stats.length > 0 ? stats.map(s => ({
    day: s.day,
    value: s.count,
    segments: [
      { height: "100%", opacity: 0.7 }
    ]
  })) : weekData;

  const data = view === "week" ? displayData : monthData;
  const avg = data.length > 0 ? Math.round(data.reduce((s, d) => s + d.value, 0) / data.length) : 0;
  
  // Find max value to scale bar heights
  const maxValue = Math.max(...data.map(d => d.value), 1);

  // Adjusted height function for engagement counts
  function getEngagementBarHeight(value: number): string {
    const minH = 20;
    const maxH = 144;
    const h = minH + ((value / maxValue) * (maxH - minH));
    return `${h}px`;
  }

  return (
    <div className="bg-[#1C1C1E] border border-white/5 rounded-2xl p-5 sm:p-7 relative overflow-hidden group hover:border-white/10 transition-colors">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#F20000] to-transparent opacity-50" />

      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg sm:text-xl font-bold font-barlow tracking-wider uppercase text-white">
            Client Engagement
          </h2>
          <p className="text-xs text-white/40 mt-1">
            Check-in responses received over the last 7 days.
          </p>
        </div>
        {/* Pill toggle (Disabled for now until we have monthly analytics) */}
        <div className="hidden items-center gap-1 bg-white/5 rounded-full p-1">
          <button
            onClick={() => setView("week")}
            className={cn(
              "px-3 py-1.5 rounded-full text-[11px] font-bold font-barlow tracking-widest uppercase transition-all",
              view === "week"
                ? "bg-[#F20000] text-white shadow-sm"
                : "text-white/40 hover:text-white/60"
            )}
          >
            Week
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="flex gap-3 sm:gap-4 items-end justify-between h-48 sm:h-52">
        {data.map((col, i) => (
          <React.Fragment key={i}>
            {/* Column */}
            <div className="flex flex-col items-center gap-2 flex-1">
              <div className="relative w-9 sm:w-10 flex-1 flex items-end">
                {/* Pill bar */}
                <div
                  className="flex flex-col overflow-hidden bg-white/5 w-full border border-white/5 rounded-full justify-end transition-all duration-500"
                  style={{ height: getEngagementBarHeight(col.value) }}
                >
                  {col.segments.map((seg, si) => (
                    <div
                      key={si}
                      className="w-full"
                      style={{
                        height: seg.height,
                        backgroundColor: `rgba(242, 0, 0, ${seg.opacity})`,
                      }}
                    />
                  ))}
                </div>

                {/* Value label */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[11px] font-medium text-white/50">
                  {col.value}
                </div>
              </div>
              <span className="text-[11px] font-medium text-white/40">
                {col.day}
              </span>
            </div>

            {/* Dotted divider */}
            {i < data.length - 1 && (
              <div className="h-40 sm:h-44 flex items-stretch">
                <div className="w-px h-full border-l border-dotted border-white/10" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Legend */}
      <div className="mt-5 flex items-center justify-between text-[11px] text-white/40">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#F20000]/70 border border-[#F20000]/30" />
          <span>Responses per day</span>
        </div>
        <p className="font-medium">
          Daily Average:{" "}
          <span className="font-bold text-white/70">{avg}</span>
        </p>
      </div>
    </div>
  );
}
