"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalendarEvent {
  day: number;
  type?: "checkin" | "renewal" | "summary";
}

interface CalendarProps {
  events?: CalendarEvent[];
  onDateSelect?: (date: Date) => void;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DOW_LABELS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function Calendar({ events = [], onDateSelect }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  // Get first day of month and total days
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const eventDays = new Set(events.map(e => e.day));

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleDayClick = (day: number) => {
    if (onDateSelect) {
      onDateSelect(new Date(year, month, day));
    }
  };

  // Generate calendar days
  const renderDays = () => {
    const days = [];

    // Previous month days
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const day = daysInPrevMonth - i;
      days.push(
        <div
          key={`prev-${day}`}
          className="cal-d dim"
        >
          {day}
        </div>
      );
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = isCurrentMonth && day === today.getDate();
      const hasEvent = eventDays.has(day);

      days.push(
        <div
          key={day}
          className={cn(
            "cal-d",
            isToday && "today",
            hasEvent && "ev"
          )}
          onClick={() => handleDayClick(day)}
        >
          {day}
        </div>
      );
    }

    // Next month days (fill remaining cells to make 42 total)
    const totalCells = firstDayOfMonth + daysInMonth;
    const remaining = 42 - totalCells;
    for (let day = 1; day <= remaining; day++) {
      days.push(
        <div
          key={`next-${day}`}
          className="cal-d dim"
        >
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="card">
      <div className="cal-top">
        <div className="cal-month">
          {MONTH_NAMES[month]} {year}
        </div>
        <div className="cal-navs">
          <button
            className="cal-nav"
            onClick={handlePrevMonth}
            aria-label="Previous month"
          >
            <ChevronLeft className="h-2 w-2" />
          </button>
          <button
            className="cal-nav"
            onClick={handleNextMonth}
            aria-label="Next month"
          >
            <ChevronRight className="h-2 w-2" />
          </button>
        </div>
      </div>
      <div className="cal-grid">
        <div className="cal-dow">
          {DOW_LABELS.map((label) => (
            <div key={label} className="cal-dow-cell">
              {label}
            </div>
          ))}
        </div>
        <div className="cal-days">
          {renderDays()}
        </div>
      </div>
    </div>
  );
}
