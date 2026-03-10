"use client";

import React, { useState } from "react";
import { Avatar, Badge, Chip, RiskDot, ProgressBar, InputField } from "@/components/ui/design-system";
import { NavBar } from "@/components/ui/navigation";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { ChevronRight, Filter, SortAsc, Users, AlertCircle, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { EnrichedClient } from "@/lib/api-services";
import { cn } from "@/lib/utils";

interface ClientListViewProps {
  initialClients: EnrichedClient[];
  stats: {
    total: number;
    active: number;
    at_risk: number;
  };
}

type SortOption = "name" | "risk" | "daysLeft" | "energy";

export default function ClientListView({ initialClients, stats }: ClientListViewProps) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState("all");
  const [riskFilter, setRiskFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("name");

  // Filtering Logic
  const filtered = initialClients.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    const matchesRisk = 
      riskFilter === "all" || 
      (riskFilter === "atrisk" && c.risk >= 3) || 
      (riskFilter === "renewal" && c.daysLeft <= 7);
    
    return matchesSearch && matchesStatus && matchesRisk;
  });

  // Sorting Logic
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "risk") return b.risk - a.risk;
    if (sortBy === "daysLeft") return a.daysLeft - b.daysLeft;
    if (sortBy === "energy") return b.energy - a.energy;
    return 0;
  });

  return (
    <div className="flex-1 w-full bg-[#0A0A0A] text-white font-sans overflow-y-auto pb-24">
      <NavBar 
        title="Roster" 
        back="Home" 
        backHref="/dashboard" 
        action="+ Add Client" 
        onAction={() => router.push("/dashboard/intake")}
      />

      {/* ── Stats Header ── */}
      <div className="grid grid-cols-3 gap-3 px-4 py-6 border-b border-white/5 bg-[#0D0D0E]/50">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
            <Users size={12} /> Total
          </div>
          <p className="text-2xl font-bold font-barlow tracking-wider">{stats.total}</p>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
            <div className="w-2 h-2 rounded-full bg-[#34C759]" /> Active
          </div>
          <p className="text-2xl font-bold font-barlow tracking-wider text-[#34C759]">{stats.active}</p>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-white/30 uppercase tracking-widest">
            <AlertCircle size={12} className="text-[#F20000]" /> At Risk
          </div>
          <p className="text-2xl font-bold font-barlow tracking-wider text-[#F20000]">{stats.at_risk}</p>
        </div>
      </div>

      {/* ── Search & Primary Filters ── */}
      <div className="px-4 pt-6 pb-2">
        <InputField 
          placeholder="Find client..." 
          icon="🔍"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ── Status Tabs ── */}
      <div className="flex items-center gap-1 px-4 py-2 overflow-x-auto hide-scrollbar">
        {["all", "active", "trial", "inactive"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={cn(
              "px-4 py-1.5 rounded-full text-xs font-bold font-barlow tracking-widest uppercase transition-all whitespace-nowrap",
              statusFilter === status 
                ? "bg-white/10 text-white border border-white/20" 
                : "text-white/40 hover:text-white/60 border border-transparent"
            )}
          >
            {status}
          </button>
        ))}
      </div>

      {/* ── Sub-Filters & Sort ── */}
      <div className="flex gap-2.5 px-4 pb-4 overflow-x-auto hide-scrollbar">
        <Chip 
          label="Priority" 
          icon="⚡"
          active={riskFilter === "atrisk"} 
          onClick={() => setRiskFilter(riskFilter === "atrisk" ? "all" : "atrisk")} 
        />
        <Chip 
          label="Expiring" 
          icon="⏳"
          active={riskFilter === "renewal"} 
          onClick={() => setRiskFilter(riskFilter === "renewal" ? "all" : "renewal")} 
        />
        <div className="h-8 w-px bg-white/5 mx-1 self-center" />
        <select 
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="bg-white/5 border border-white/10 rounded-full px-3 py-1 text-[11px] font-bold font-barlow tracking-widest uppercase outline-none text-white/60 focus:text-white"
        >
          <option value="name">Sort: A-Z</option>
          <option value="risk">Sort: Risk</option>
          <option value="daysLeft">Sort: Expiry</option>
          <option value="energy">Sort: Energy</option>
        </select>
      </div>

      {/* ── Desktop Table View ── */}
      <div className="hidden md:block px-4">
        <div className="rounded-2xl border border-white/5 bg-[#1C1C1E] overflow-hidden">
          <Table>
            <TableHeader className="bg-white/[0.02]">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-white/30 text-[10px] font-bold uppercase tracking-widest pl-6">Client</TableHead>
                <TableHead className="text-white/30 text-[10px] font-bold uppercase tracking-widest">Program</TableHead>
                <TableHead className="text-white/30 text-[10px] font-bold uppercase tracking-widest">Status</TableHead>
                <TableHead className="text-white/30 text-[10px] font-bold uppercase tracking-widest">Energy</TableHead>
                <TableHead className="text-white/30 text-[10px] font-bold uppercase tracking-widest">Expiry</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((client) => (
                <TableRow 
                  key={client.id}
                  onClick={() => router.push(`/dashboard/clients/${client.id}`)}
                  className="border-white/5 hover:bg-white/[0.02] cursor-pointer transition-colors"
                >
                  <TableCell className="py-4 pl-6">
                    <div className="flex items-center gap-3">
                      <Avatar name={client.name} risk={client.risk} size={36} />
                      <span className="font-bold font-sans text-sm">{client.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-white/50">{client.program}</TableCell>
                  <TableCell>
                    <Badge 
                      label={client.status} 
                      color={client.status === 'active' ? '#34C759' : client.status === 'trial' ? '#BF5AF2' : '#8E8E93'}
                      size="sm"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="w-24">
                      <ProgressBar 
                        value={client.energy} 
                        color={client.energy >= 7 ? "#34C759" : client.energy >= 5 ? "#FF9F0A" : "#F20000"} 
                      />
                      <span className="text-[9px] text-white/30 mt-1 block">Level {client.energy}/10</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-xs text-white/50">
                      <Calendar size={12} className={client.daysLeft <= 7 ? "text-[#FF9F0A]" : ""} />
                      <span className={client.daysLeft <= 7 ? "text-[#FF9F0A] font-bold" : ""}>
                        {client.daysLeft} days
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="pr-6">
                    <ChevronRight className="h-4 w-4 text-white/20 ml-auto" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* ── Mobile List View ── */}
      <div className="flex flex-col gap-2 px-4 md:hidden">
        {sorted.map(client => (
          <div 
            key={client.id} 
            onClick={() => router.push(`/dashboard/clients/${client.id}`)}
            className="flex items-center gap-3 bg-[#1C1C1E] border border-white/5 rounded-2xl p-4 cursor-pointer hover:bg-white/5 transition-colors active:scale-[0.99]"
          >
            <Avatar name={client.name} risk={client.risk} size={44} />
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-0.5">
                <p className="text-[15px] font-bold font-sans truncate pr-2">{client.name}</p>
                <div className="flex gap-1.5 items-center shrink-0">
                  {client.daysLeft <= 7 && <Badge label={`${client.daysLeft}d`} color="#FF9F0A" />}
                  <Badge 
                    label={client.status.charAt(0).toUpperCase()} 
                    color={client.status === 'active' ? '#34C759' : '#8E8E93'} 
                    className="w-5 h-5 p-0 flex items-center justify-center text-[9px]"
                  />
                </div>
              </div>
              
              <div className="flex items-center gap-2 mb-2">
                <p className="text-[10px] text-white/40 font-bold font-barlow tracking-widest uppercase truncate">{client.program}</p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <ProgressBar 
                    value={client.energy} 
                    color={client.energy >= 7 ? "#34C759" : client.energy >= 5 ? "#FF9F0A" : "#F20000"} 
                  />
                </div>
                <span className="text-[10px] font-bold text-white/40 font-barlow">E{client.energy}</span>
              </div>
            </div>
            
            <ChevronRight className="h-5 w-5 text-white/20 shrink-0 ml-1" />
          </div>
        ))}
      </div>

      {/* ── Empty State ── */}
      {sorted.length === 0 && (
        <div className="py-24 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
            <Users className="text-white/20" size={32} />
          </div>
          <p className="text-white/70 font-bold font-barlow tracking-wider uppercase mb-1">No clients found</p>
          <p className="text-sm text-white/40 font-sans max-w-[200px]">
            {initialClients.length === 0 ? "You have no active clients yet." : "No matches for the selected status or filters."}
          </p>
        </div>
      )}
    </div>
  );
}
