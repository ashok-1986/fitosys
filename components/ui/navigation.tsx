"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";

// ─── NAV BAR (Top) ─────────────────────────────────────────────────────────

interface NavBarProps {
  title: string;
  back?: string;
  backHref?: string;
  action?: string;
  onAction?: () => void;
  transparent?: boolean;
}

export function NavBar({ title, back, backHref, action, onAction, transparent }: NavBarProps) {
  return (
    <div 
      className={cn(
        "flex items-center justify-between px-5 py-4 sticky top-0 z-50",
        transparent ? "bg-transparent" : "bg-[#111111]/95 backdrop-blur-xl border-b border-white/10"
      )}
    >
      <div className="w-20 lg:w-32 flex items-center">
        {back && backHref && (
          <Link 
            href={backHref}
            className="flex items-center gap-1 overflow-hidden"
          >
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-3 py-1 hover:bg-white/10 transition-colors">
                <ChevronLeft className="h-4 w-4 text-white/70 -ml-1" />
                <span className="text-[13px] font-medium text-white/70 font-sans truncate max-w-[80px]">
                    {back}
                </span>
            </div>
          </Link>
        )}
      </div>

      <h1 className="text-[17px] font-semibold text-white font-sans truncate px-2">
        {title}
      </h1>

      <div className="w-20 lg:w-32 flex justify-end">
        {action && (
          <button 
            onClick={onAction}
            className="text-[#F20000] text-[15px] font-medium font-sans hover:opacity-80 transition-opacity"
          >
            {action}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── TAB BAR (Bottom) ──────────────────────────────────────────────────────
interface Tab {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface TabBarProps {
  tabs: Tab[];
}

export function TabBar({ tabs }: TabBarProps) {
  const pathname = usePathname();

  return (
    <div className="flex justify-around items-center px-4 pt-3 pb-[calc(12px+env(safe-area-inset-bottom,0px))] bg-[#111111]/95 backdrop-blur-2xl border-t border-white/10 sticky bottom-0 z-50">
      {tabs.map((tab) => {
        // Simple active state checking
        const isActive = pathname === tab.href || (pathname.startsWith(tab.href) && tab.href !== "/dashboard");

        return (
          <Link 
            key={tab.id} 
            href={tab.href}
            className={cn(
              "flex flex-col items-center gap-1 min-w-[64px] transition-colors duration-200",
              isActive ? "text-[#F20000]" : "text-white/40 hover:text-white/70"
            )}
          >
            <div className="text-[22px] flex items-center justify-center h-7 w-7">
                {tab.icon}
            </div>
            <span className="text-[10px] font-semibold font-sans">
              {tab.label}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
