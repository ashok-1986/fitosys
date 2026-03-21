"use client";

import { Search, User, Layout, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useState, useMemo, useRef, useEffect } from "react";
import { useDashboard } from "@/hooks/use-dashboard";

interface TopbarProps {
  coachName?: string;
  coachInitials?: string;
}

export function Topbar({ coachName = "Coach", coachInitials = "C" }: TopbarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const { data } = useDashboard();
  const searchRef = useRef<HTMLDivElement>(null);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // Handle click outside to close results
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const results = useMemo(() => {
    if (!searchQuery.trim() || !data) return [];

    const query = searchQuery.toLowerCase();
    const searchItems: any[] = [];

    // Search in programs
    data.programs?.forEach(p => {
      if (p.name.toLowerCase().includes(query)) {
        searchItems.push({ id: p.id, title: p.name, type: "Program", href: "/dashboard/programs", icon: <Layout className="h-3 w-3" /> });
      }
    });

    // Search in recent updates (representing clients for now)
    const uniqueClients = new Set();
    data.recent_updates?.forEach(u => {
      if (u.client_name.toLowerCase().includes(query) && !uniqueClients.has(u.client_name)) {
        uniqueClients.add(u.client_name);
        searchItems.push({ id: u.id, title: u.client_name, type: "Client", href: "/dashboard/clients", icon: <User className="h-3 w-3" /> });
      }
    });

    return searchItems.slice(0, 5);
  }, [searchQuery, data]);

  return (
    <div className="topbar">
      <div className="topbar-greet">
        <h1>{coachName}</h1>
        <p>{today}</p>
      </div>

      <div className="topbar-search relative" ref={searchRef}>
        <Search className="h-3.5 w-3.5 text-[#444444]" />
        <input
          type="text"
          placeholder="Search clients, programs…"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={() => setShowResults(true)}
        />

        {/* Search Results Dropdown */}
        {showResults && searchQuery.trim() && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[#111111]/95 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden shadow-2xl z-[100]">
            {results.length > 0 ? (
              <div className="py-2">
                {results.map((result) => (
                  <Link
                    key={`${result.type}-${result.id}`}
                    href={result.href}
                    className="flex items-center justify-between px-4 py-2.5 hover:bg-white/5 transition-colors group"
                    onClick={() => setShowResults(false)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-muted-foreground group-hover:text-brand transition-colors">
                        {result.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white group-hover:text-brand transition-colors">{result.title}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{result.type}</p>
                      </div>
                    </div>
                    <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            ) : (
              <div className="px-4 py-8 text-center">
                <p className="text-sm text-muted-foreground">No matches found for "{searchQuery}"</p>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="topbar-avatar">
        {coachInitials}
      </div>
    </div>
  );
}
