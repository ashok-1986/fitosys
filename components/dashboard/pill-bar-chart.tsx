"use client";

import { useState, useEffect } from "react";

interface ChartDataPoint {
  label: string;
  value: number;
}

interface PillBarChartProps {
  weekData?: ChartDataPoint[];
  monthData?: ChartDataPoint[];
  title?: string;
  subtitle?: string;
}

const MAX_PX = 95;

export function PillBarChart({
  weekData = [
    { label: "Mon", value: 62 },
    { label: "Tue", value: 55 },
    { label: "Wed", value: 85 },
    { label: "Thu", value: 48 },
    { label: "Fri", value: 78 },
    { label: "Sun", value: 73 },
  ],
  monthData = [
    { label: "W1", value: 68 },
    { label: "W2", value: 74 },
    { label: "W3", value: 60 },
    { label: "W4", value: 82 },
    { label: "W5", value: 71 },
    { label: "W6", value: 73 },
  ],
  title = "Check-in Rate",
  subtitle = "Weekly client responses",
}: PillBarChartProps) {
  const [activeTab, setActiveTab] = useState<"week" | "month">("week");
  const [currentData, setCurrentData] = useState(weekData);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    setCurrentData(activeTab === "week" ? weekData : monthData);
    setAnimated(false);
    const timer = setTimeout(() => setAnimated(true), 50);
    return () => clearTimeout(timer);
  }, [activeTab, weekData, monthData]);

  const peakValue = Math.max(...currentData.map((d) => d.value));
  const averageValue = Math.round(
    currentData.reduce((sum, d) => sum + d.value, 0) / currentData.length
  );

  return (
    <div className="chart-card">
      <div className="chart-hd">
        <div>
          <div className="chart-title">{title}</div>
          <div className="chart-sub">{subtitle}</div>
        </div>
        <div className="chart-toggle">
          <button
            className={`chart-tab ${activeTab === "week" ? "on" : ""}`}
            onClick={() => setActiveTab("week")}
          >
            Week
          </button>
          <button
            className={`chart-tab ${activeTab === "month" ? "on" : ""}`}
            onClick={() => setActiveTab("month")}
          >
            Month
          </button>
        </div>
      </div>

      <div className="chart-bars" id="chartBars">
        {currentData.map((data, idx) => {
          const isPeak = data.value === peakValue;
          const fillHeight = Math.round((data.value / 100) * MAX_PX);

          return (
            <div
              key={`${data.label}-${idx}`}
              className={`bar-col ${isPeak ? "peak" : ""}`}
            >
              <div className="bar-val">{data.value}%</div>
              <div
                className="bar-pill-wrap"
                style={{ height: `${MAX_PX}px` }}
              >
                <div
                  className="bar-pill-fill"
                  style={{
                    height: animated ? `${fillHeight}px` : "0",
                    transition: "height 0.65s cubic-bezier(.4,0,.2,1)",
                  }}
                />
              </div>
              <div className="bar-day">{data.label}</div>
            </div>
          );
        })}
      </div>

      <div className="chart-foot">
        <div className="chart-legend">
          <div className="legend-ring" />
          Clients checked in
        </div>
        <div className="chart-avg">
          Avg: <strong>{averageValue}%</strong>
        </div>
      </div>
    </div>
  );
}
