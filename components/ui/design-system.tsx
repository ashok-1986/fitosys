import React from "react";
import { cn } from "@/lib/utils";

// ─── RISK DOT ──────────────────────────────────────────────────────────────
interface RiskDotProps {
  score: number;
  className?: string;
}

export function RiskDot({ score, className }: RiskDotProps) {
  const colorClass = score >= 4 ? "bg-[#F20000] shadow-[0_0_6px_#F20000]" 
                   : score >= 3 ? "bg-[#FF9F0A] shadow-[0_0_6px_#FF9F0A]" 
                   : "bg-[#34C759] shadow-[0_0_6px_#34C759]";

  return (
    <span 
      className={cn(
        "inline-block w-2 h-2 rounded-full shrink-0",
        colorClass,
        className
      )} 
    />
  );
}

// ─── BADGE ─────────────────────────────────────────────────────────────────
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  label: string;
  color?: string; // Expecting hex like #F20000
  size?: "sm" | "md";
}

export function Badge({ label, color = "#F20000", size = "sm", className, ...props }: BadgeProps) {
  // We use inline styles here because Tailwind doesn't support dynamic arbitrary hex values well
  return (
    <span 
      className={cn(
        "inline-flex items-center rounded-full font-semibold font-sans tracking-wide",
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-3 py-1 text-xs",
        className
      )}
      style={{
        backgroundColor: `${color}18`,
        border: `1px solid ${color}30`,
        color: color,
      }}
      {...props}
    >
      {label}
    </span>
  );
}

// ─── CHIP ──────────────────────────────────────────────────────────────────
interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon?: string;
  label: string;
  active?: boolean;
}

export function Chip({ icon, label, active, className, ...props }: ChipProps) {
  return (
    <button 
      className={cn(
        "flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-medium font-sans transition-all whitespace-nowrap cursor-pointer",
        active 
          ? "bg-[#F20000] border-[#F20000] text-white" 
          : "bg-white/5 border-white/10 text-white/60 hover:text-white/80",
        "border",
        className
      )}
      {...props}
    >
      {icon && <span className="text-sm">{icon}</span>}
      {label}
    </button>
  );
}

// ─── STAT CARD ─────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
  icon?: string;
  trend?: number;
  className?: string;
}

export function StatCard({ label, value, sub, accent = "#FFFFFF", icon, trend, className }: StatCardProps) {
  return (
    <div className={cn(
      "bg-[#1C1C1E] border border-white/10 rounded-2xl p-5 flex flex-col gap-2 relative overflow-hidden",
      className
    )}>
      {/* Top Gradient Border Line */}
      <div 
        className="absolute top-0 left-0 right-0 h-[2px]" 
        style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }} 
      />
      
      <div className="flex justify-between items-start">
        <span className="text-xs text-white/35 font-medium tracking-widest uppercase font-sans">
          {label}
        </span>
        {icon && <span className="text-lg opacity-60">{icon}</span>}
      </div>
      
      <div className="text-[32px] font-bold font-barlow leading-none" style={{ color: accent }}>
        {value}
      </div>
      
      {sub && (
        <div className="text-xs text-white/60 font-sans">
          {trend !== undefined && (
            <span 
              className="mr-1" 
              style={{ color: trend > 0 ? "#34C759" : "#F20000" }}
            >
              {trend > 0 ? "↑" : "↓"}{Math.abs(trend)}%
            </span>
          )}
          {sub}
        </div>
      )}
    </div>
  );
}

// ─── AVATAR ────────────────────────────────────────────────────────────────
interface AvatarProps {
  name: string;
  size?: number;
  risk?: number;
  className?: string;
}

export function Avatar({ name, size = 36, risk, className }: AvatarProps) {
  const initials = name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const colors = ["#F20000", "#0A84FF", "#34C759", "#BF5AF2", "#FF9F0A"];
  // Simple deterministic color based on name string
  const idx = name.charCodeAt(0) % colors.length;
  const color = colors[idx];

  const dotColor = risk !== undefined && risk >= 4 ? "#F20000" 
                 : risk !== undefined && risk >= 3 ? "#FF9F0A" 
                 : "#34C759";

  return (
    <div className={cn("relative shrink-0", className)}>
      <div 
        className="rounded-full flex items-center justify-center font-bold font-sans"
        style={{
          width: size, 
          height: size,
          backgroundColor: `${color}22`,
          border: `1.5px solid ${color}44`,
          color: color,
          fontSize: size * 0.35,
        }}
      >
        {initials}
      </div>
      
      {risk !== undefined && (
        <div 
          className="absolute rounded-full border-2 border-[#111]"
          style={{
            bottom: -1,
            right: -1,
            width: Math.max(10, size * 0.25),
            height: Math.max(10, size * 0.25),
            backgroundColor: dotColor,
            boxShadow: `0 0 6px ${dotColor}`,
          }} 
        />
      )}
    </div>
  );
}

// ─── PROGRESS BAR ──────────────────────────────────────────────────────────
interface ProgressBarProps {
  value: number;
  max?: number;
  color?: string;
  className?: string;
}

export function ProgressBar({ value, max = 10, color = "#F20000", className }: ProgressBarProps) {
  return (
    <div className={cn("bg-white/5 rounded-full h-1 overflow-hidden", className)}>
      <div 
        className="h-full rounded-full transition-[width] duration-500 ease-out"
        style={{
          width: `${Math.min(100, Math.max(0, (value / max) * 100))}%`,
          background: `linear-gradient(90deg, ${color}, ${color}bb)`,
        }} 
      />
    </div>
  );
}

// ─── SWITCH ────────────────────────────────────────────────────────────────
interface SwitchProps {
  on: boolean;
  onToggle?: (on: boolean) => void;
  className?: string;
}

export function Switch({ on, onToggle, className }: SwitchProps) {
  return (
    <div 
      onClick={() => onToggle && onToggle(!on)}
      className={cn(
        "w-11 h-[26px] rounded-full relative cursor-pointer transition-colors duration-200 border",
        on ? "bg-[#F20000] border-[#F20000]" : "bg-white/10 border-white/10",
        className
      )}
    >
      <div 
        className={cn(
          "absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white transition-all duration-200 shadow-sm",
          on ? "left-[21px]" : "left-[3px]"
        )} 
      />
    </div>
  );
}

// ─── INPUT W/ ICON ─────────────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: string;
}

export function InputField({ label, icon, className, ...props }: InputProps) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label className="text-xs text-white/60 font-medium font-sans tracking-wide">
          {label}
        </label>
      )}
      <div className="flex items-center gap-2.5 bg-white/5 border border-white/10 rounded-xl px-3.5 py-3 focus-within:border-white/30 transition-colors">
        {icon && <span className="text-base opacity-50">{icon}</span>}
        <input 
          className="bg-transparent border-none outline-none text-[15px] text-white font-sans w-full placeholder:text-white/30"
           {...props}
        />
      </div>
    </div>
  );
}
