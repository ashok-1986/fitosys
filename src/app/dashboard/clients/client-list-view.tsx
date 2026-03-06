"use client";

import React, { useState } from "react";
import { Avatar, Badge, Chip, RiskDot, ProgressBar, InputField } from "@/components/ui/design-system";
import { NavBar } from "@/components/ui/navigation";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { EnrichedClient } from "@/lib/api-services";

interface ClientListViewProps {
  initialClients: EnrichedClient[];
}

export default function ClientListView({ initialClients }: ClientListViewProps) {
  const router = useRouter();
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = initialClients.filter(c =>
    (filter === "all" || (filter === "atrisk" && c.risk >= 3) || (filter === "renewal" && c.daysLeft <= 7)) &&
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 w-full bg-[#0A0A0A] text-white font-sans overflow-y-auto pb-24">
      <NavBar 
        title="Clients" 
        back="Home" 
        backHref="/dashboard" 
        action="+ Add" 
        onAction={() => router.push("/dashboard/intake")}
      />

      {/* ── Search ── */}
      <div className="px-4 py-3">
        <InputField 
          placeholder="Search clients..." 
          icon="🔍"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ── Filter Chips ── */}
      <div className="flex gap-2.5 px-4 pb-4 overflow-x-auto hide-scrollbar snap-x">
        <Chip 
          label="All Clients" 
          active={filter === "all"} 
          onClick={() => setFilter("all")} 
          className="snap-start"
        />
        <Chip 
          label="At Risk" 
          icon="🔴"
          active={filter === "atrisk"} 
          onClick={() => setFilter("atrisk")} 
          className="snap-start"
        />
        <Chip 
          label="Renewal Due" 
          icon="🔔"
          active={filter === "renewal"} 
          onClick={() => setFilter("renewal")} 
          className="snap-start"
        />
      </div>

      {/* ── Client Rows ── */}
      <div className="flex flex-col gap-2 px-4">
        {filtered.map(client => (
          <div 
            key={client.id} 
            onClick={() => router.push(`/dashboard/clients/${client.id}`)}
            className="flex items-center gap-3 bg-[#1C1C1E] border border-white/5 rounded-2xl p-3.5 cursor-pointer hover:bg-white/5 transition-colors active:scale-[0.99]"
          >
            <Avatar name={client.name} risk={client.risk} size={44} />
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-0.5">
                <p className="text-[15px] font-semibold font-sans truncate pr-2">{client.name}</p>
                <div className="flex gap-1.5 items-center shrink-0">
                  {client.daysLeft <= 7 && <Badge label={`${client.daysLeft}d`} color="#FF9F0A" />}
                  {client.risk >= 4 && <RiskDot score={client.risk} />}
                </div>
              </div>
              
              <p className="text-xs text-white/50 font-sans mb-2 truncate">{client.program}</p>
              
              <div>
                <ProgressBar 
                  value={client.energy} 
                  color={client.energy >= 7 ? "#34C759" : client.energy >= 5 ? "#FF9F0A" : "#F20000"} 
                />
                <p className="text-[10px] text-white/40 mt-1.5 font-sans font-medium">Energy {client.energy}/10</p>
              </div>
            </div>
            
            <ChevronRight className="h-5 w-5 text-white/30 shrink-0" />
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <span className="text-4xl mb-4">🔍</span>
            <p className="text-white/70 font-medium font-sans mb-1">No clients found</p>
            <p className="text-sm text-white/40 font-sans">
              {initialClients.length === 0 ? "You have no active clients yet." : "Try adjusting your search or filters."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
