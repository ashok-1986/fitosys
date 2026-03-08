import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCurrentCoachId, getRecentCheckins, getLatestAiSummary } from "@/lib/api-services";
import WeeklyProgressCard from "@/components/weekly-progress-card";

// Extract the custom Desktop StatCard and Avatar to match the screenshot exactly
const DashboardAvatar = ({ name, risk, size = 40 }: { name: string, risk?: number, size?: number }) => {
  const isRed = risk && risk >= 4;
  const isOrange = risk === 3;
  return (
    <div className="relative">
      <div 
        className={cn(
          "rounded-full flex items-center justify-center font-bold text-white font-barlow tracking-wider",
          isRed ? "bg-[#F20000]/10 border border-[#F20000]/30 text-[#F20000]" : 
          isOrange ? "bg-[#FF9F0A]/10 border border-[#FF9F0A]/30 text-[#FF9F0A]" :
          "bg-[#1C1C1E] border border-white/10"
        )}
        style={{ width: size, height: size, fontSize: size * 0.35 }}
      >
        {name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
      </div>
      {risk && (
        <div 
          className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[#111] z-10"
          style={{ background: isRed ? "#F20000" : isOrange ? "#FF9F0A" : "#34C759" }}
        />
      )}
    </div>
  );
};

export default async function DashboardScreen() {
  const coachId = await getCurrentCoachId();
  const checkins = await getRecentCheckins(coachId, 5);
  const summary = await getLatestAiSummary(coachId);

  // Map the live Supabase data to the UI elements
  const activeClients = summary ? summary.total_clients : 0;
  
  // Parse the summary text roughly to see if there are "Needs Attention" clients mentioned
  // (In a fuller version, we'd parse the structured string from Qwen)
  const needsAttentionCount = summary && summary.summary_text.includes('NEEDS ATTENTION') ? 
    (summary.summary_text.match(/Needs Attention/g) || []).length : 0; 
  
  const displayCheckins = checkins || [];

  return (
    <div className="flex-1 w-full bg-[#0A0A0A] text-white font-sans p-6 md:p-10 max-w-5xl">
      {/* Header */}
      <div className="flex justify-between items-start mb-10 mt-2">
        <div>
          <p className="text-sm text-white/40 mb-1">Monday, 3 March</p>
          <h1 className="text-3xl font-bold font-barlow tracking-wider uppercase">
            MORNING, <span className="text-[#F20000]">COACH ASHOK</span> 👋
          </h1>
        </div>
        <DashboardAvatar name="Ashok Kumar" size={48} risk={0} />
      </div>

      {/* AI Pulse Banner */}
      <Link href="/dashboard/summary" className="block w-full mb-8 cursor-pointer transition-transform hover:scale-[1.01] active:scale-[0.99]">
        <div className="relative overflow-hidden rounded-2xl border border-[#F20000]/30 p-5 flex items-center justify-between shadow-[0_8px_32px_rgba(242,0,0,0.05)]"
             style={{ background: 'linear-gradient(90deg, #F2000015 0%, #111111 80%)' }}>
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="h-12 w-12 rounded-xl bg-[#F20000]/10 border border-[#F20000]/20 flex items-center justify-center text-2xl shadow-[0_0_16px_rgba(242,0,0,0.2)]">
              🤖
            </div>
            <div>
              <h3 className="font-bold text-[17px] mb-0.5 font-barlow tracking-wide">Monday AI Pulse Ready</h3>
              <p className="text-sm text-white/50">{activeClients} clients · {needsAttentionCount > 0 ? `${needsAttentionCount} needs attention` : 'All looking good'}</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-[#F20000]" />
        </div>
      </Link>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        {/* Active Clients */}
        <div className="bg-[#1C1C1E] border border-white/5 rounded-2xl p-5 relative overflow-hidden group hover:border-white/10 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-white/30 uppercase tracking-widest font-sans group-hover:text-white/50 transition-colors">Active Clients</span>
            <div className="opacity-40 text-[#5E5CE6]">👥</div>
          </div>
          <div className="flex items-baseline gap-3">
             <span className="text-4xl font-bold font-barlow tracking-widest text-[#5E5CE6]">{activeClients}</span>
             <span className="text-xs font-semibold text-[#34C759] bg-[#34C759]/10 px-1.5 py-0.5 rounded tracking-wide">+8% <span className="text-white/40 font-normal">vs last month</span></span>
          </div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#5E5CE6] to-transparent opacity-50" />
        </div>

        {/* Check-in Rate */}
        <div className="bg-[#1C1C1E] border border-white/5 rounded-2xl p-5 relative overflow-hidden group hover:border-white/10 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-white/30 uppercase tracking-widest font-sans group-hover:text-white/50 transition-colors">Check-in Rate</span>
            <div className="opacity-40 text-[#34C759]">✅</div>
          </div>
          <div className="flex items-baseline gap-3">
             <span className="text-4xl font-bold font-barlow tracking-widest text-[#34C759]">
               {summary && summary.total_clients > 0 ? `${Math.round((summary.responded_count / summary.total_clients) * 100)}%` : "0%"}
             </span>
             <span className="text-xs font-semibold text-[#34C759] bg-[#34C759]/10 px-1.5 py-0.5 rounded tracking-wide">+3% <span className="text-white/40 font-normal">this week</span></span>
          </div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#34C759] to-transparent opacity-50" />
        </div>

        {/* Renewals */}
        <div className="bg-[#1C1C1E] border border-white/5 rounded-2xl p-5 relative overflow-hidden group hover:border-white/10 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-white/30 uppercase tracking-widest font-sans group-hover:text-white/50 transition-colors">Renewals Due</span>
            <div className="opacity-40 text-[#FF9F0A]">🔔</div>
          </div>
          <div className="flex items-baseline gap-3">
             <span className="text-4xl font-bold font-barlow tracking-widest text-[#FF9F0A]">3</span>
             <span className="text-xs text-white/40 tracking-wide">next 7 days</span>
          </div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FF9F0A] to-transparent opacity-50" />
        </div>

        {/* MRR - Hardcoded for MVP */}
        <div className="bg-[#1C1C1E] border border-white/5 rounded-2xl p-5 relative overflow-hidden group hover:border-white/10 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-white/30 uppercase tracking-widest font-sans group-hover:text-white/50 transition-colors">MRR</span>
            <div className="opacity-40 text-[#0A84FF]">💰</div>
          </div>
          <div className="flex items-baseline gap-3">
             <span className="text-4xl font-bold font-barlow tracking-widest text-[#0A84FF]">₹36K</span>
             <span className="text-xs font-semibold text-[#34C759] bg-[#34C759]/10 px-1.5 py-0.5 rounded tracking-wide">↑12% <span className="text-white/40 font-normal">vs last month</span></span>
          </div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#0A84FF] to-transparent opacity-50" />
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div className="mb-10">
        <WeeklyProgressCard />
      </div>

      {/* Needs Attention / Recent Check-ins */}
      <div className="flex justify-between items-end mb-4">
        <h3 className="font-bold font-barlow tracking-widest uppercase text-base">Needs Attention</h3>
        <Link href="/dashboard/clients" className="text-xs font-bold text-[#F20000] hover:underline font-barlow tracking-widest uppercase">
          See All
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {displayCheckins.length === 0 ? (
           <div className="bg-[#1C1C1E] border border-white/5 rounded-2xl p-8 text-center">
             <p className="text-white/50">No check-ins received yet this week.</p>
           </div>
        ) : (
          displayCheckins.map(checkin => {
            const riskLevel = checkin.energy_score && checkin.energy_score <= 4 ? 4 : checkin.energy_score === 5 ? 3 : 1;
            const isAtRisk = riskLevel >= 3;
            
            return (
              <Link href={`/dashboard/clients/${checkin.client_id}`} key={checkin.id} 
                className={cn(
                  "bg-[#1C1C1E] border rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all hover:bg-white/5 active:scale-[0.99]",
                  isAtRisk ? "border-[#F20000]/20" : "border-white/5"
                )}
              >
                <div className="flex items-center gap-4">
                  <DashboardAvatar name={checkin.clients?.full_name || "Client"} risk={riskLevel} size={48} />
                  <div>
                    <h4 className="font-bold text-[15px] font-sans">{checkin.clients?.full_name || "Client"}</h4>
                    <p className="text-xs text-white/40 mt-0.5 mb-2 truncate">Week {checkin.week_number} Check-in</p>
                    <div className="flex gap-4">
                      <span className="text-xs text-white/50 flex items-center gap-1.5">
                        <span className="text-[#FF9F0A]">⚡</span> {checkin.energy_score || 0}/10
                      </span>
                      <span className="text-xs text-white/50 flex items-center gap-1.5">
                        <span className="text-white/30">🏋️</span> {checkin.sessions_completed || 0} sessions
                      </span>
                    </div>
                  </div>
                </div>

                {isAtRisk && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-barlow tracking-widest uppercase text-[#F20000]">Risk {riskLevel}/5</span>
                  </div>
                )}
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
