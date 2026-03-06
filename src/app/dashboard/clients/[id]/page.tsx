import React from "react";
import Link from "next/link";
import { Avatar, Badge } from "@/components/ui/design-system";
import { NavBar } from "@/components/ui/navigation";
import { getClientProfile } from "@/lib/api-services";
import { notFound } from "next/navigation";

export default async function ClientDetailScreen({ params }: { params: { id: string } }) {
  const resolvedParams = await params;
  const profile = await getClientProfile(resolvedParams.id);

  if (!profile) {
    notFound();
  }

  // Get the latest check-in for the top stats
  const latestCheckin = profile.recentCheckins[0] || null;
  const energy = latestCheckin?.energy_score || 0;
  
  // Calculate risk safely
  let risk = 1;
  if (energy > 0) {
    if (energy <= 3) risk = 5;
    else if (energy <= 5) risk = 4;
    else if (energy <= 7) risk = 2;
  } else {
    risk = profile.daysLeft < 7 ? 4 : 2;
  }

  // Pad the chart data to 7 weeks if there aren't enough checkins yet
  const chartData = profile.recentCheckins.map(c => c.energy_score || 0).reverse();
  while (chartData.length < 7) {
    chartData.unshift(0); // Insert 0 at the beginning for missing weeks
  }
  
  const barMax = 10;
  
  // Format the enrollment date safely
  const enrolledDate = new Date(profile.created_at).toLocaleDateString('en-US', { 
    month: 'short', day: 'numeric', year: 'numeric' 
  });

  return (
    <div className="flex-1 w-full bg-[#0A0A0A] text-white font-sans overflow-y-auto pb-24">
      <NavBar 
        title="Client Profile" 
        back="Clients" 
        backHref="/dashboard/clients" 
        action="Message" 
      />

      {/* ── Hero Profile ── */}
      <div 
        className="mx-4 mt-2 mb-6 rounded-[20px] p-5 border transition-colors"
        style={{ 
          background: risk >= 4 ? `linear-gradient(135deg, #F2000018, #1C1C1E)` : `linear-gradient(135deg, #34C75918, #1C1C1E)`,
          borderColor: risk >= 4 ? '#F2000033' : '#34C75933'
        }}
      >
        <div className="flex gap-4 items-center">
          <Avatar name={profile.full_name} size={60} risk={risk} />
          <div>
            <h2 className="text-xl font-bold font-sans">{profile.full_name}</h2>
            <p className="text-[13px] text-white/60 font-sans mt-0.5">{profile.program}</p>
            <div className="flex flex-wrap gap-2 mt-2">
              {risk >= 4 && <Badge label="⚠ High Risk" color="#F20000" />}
              {profile.daysLeft <= 14 && <Badge label={`${profile.daysLeft} days left`} color="#FF9F0A" />}
              {profile.status === 'trial' && <Badge label="Trial" color="#0A84FF" />}
            </div>
          </div>
        </div>

        {/* ── AI Insight ── */}
        {(risk >= 4 || profile.daysLeft <= 7) && (
          <div className="mt-5 p-3.5 rounded-xl border border-[#F20000]/20 bg-[#F20000]/5">
            <p className="text-xs text-[#F20000] font-bold mb-1.5 font-sans tracking-wide">🤖 AI INSIGHT</p>
            <p className="text-[13px] text-white/70 leading-relaxed font-sans">
              {profile.daysLeft <= 7 
                ? `${profile.full_name}'s program ends in ${profile.daysLeft} days. Send a renewal link today.` 
                : `${profile.full_name}'s recent check-ins show critically low energy levels. Personal outreach is highly recommended.`}
            </p>
          </div>
        )}
      </div>

      {/* ── Stats Grid ── */}
      <div className="grid grid-cols-3 gap-2 px-4 mb-8 mt-2">
        <div className="bg-[#1C1C1E] border border-white/10 rounded-xl p-3 text-center flex flex-col items-center justify-center h-24">
          <p className="text-xl font-bold text-white font-barlow tracking-wide">
            {energy > 0 ? <span className={energy <= 5 ? "text-[#F20000]" : "text-[#34C759]"}>{energy}</span> : "-"}
            <span className="text-sm text-white/40">/10</span>
          </p>
          <p className="text-[11px] text-white/40 font-sans mt-1 uppercase tracking-wider font-semibold">Energy</p>
        </div>
        <div className="bg-[#1C1C1E] border border-white/10 rounded-xl p-3 text-center flex flex-col items-center justify-center h-24">
          <p className="text-xl font-bold text-white font-barlow tracking-wide">
            {latestCheckin?.sessions_completed !== null ? <span className="text-[#FF9F0A]">{latestCheckin?.sessions_completed}</span> : "-"}
          </p>
          <p className="text-[11px] text-white/40 font-sans mt-1 uppercase tracking-wider font-semibold">Sessions</p>
        </div>
        <div className="bg-[#1C1C1E] border border-white/10 rounded-xl p-3 text-center flex flex-col items-center justify-center h-24">
          <p className="text-xl font-bold text-white font-barlow tracking-wide">
            {profile.weightProgress !== 0 ? (
              <span className={profile.weightProgress < 0 ? "text-[#34C759]" : "text-[#FF9F0A]"}>
                {profile.weightProgress > 0 ? "+" : ""}{profile.weightProgress.toFixed(1)}kg
              </span>
            ) : "-"}
          </p>
          <p className="text-[11px] text-white/40 font-sans mt-1 uppercase tracking-wider font-semibold">Progress</p>
        </div>
      </div>

      {/* ── Energy Trend Chart ── */}
      <div className="mx-4 mb-6 bg-[#1C1C1E] border border-white/10 rounded-2xl p-4">
        <p className="text-[13px] font-semibold mb-6 font-sans text-white/60 uppercase tracking-widest">
          Energy Trend — 7 Weeks
        </p>
        <div className="flex gap-2 items-end h-[72px]">
          {chartData.map((v, i) => {
            const isRed = v > 0 && v <= 4;
            const isOrange = v > 4 && v <= 6;
            const isGreen = v > 6;
            const isEmpty = v === 0;
            const color = isRed ? "#F20000" : isOrange ? "#FF9F0A" : isGreen ? "#34C759" : "#333333";
            
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div 
                  className="w-full rounded-sm transition-all duration-500 max-w-[24px]"
                  style={{
                    height: isEmpty ? '4px' : `${(v / barMax) * 54}px`,
                    background: isEmpty ? color : `linear-gradient(180deg, ${color}, ${color}88)`,
                  }} 
                />
                <span className="text-[9px] text-white/40 font-sans font-medium uppercase tracking-wider">
                  W{i + 1}
                </span>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* ── Client Details Readonly ── */}
      <div className="px-5 mb-8">
         <h3 className="text-sm font-bold font-barlow tracking-wider mb-3 text-white/60">CLIENT INFO</h3>
         <div className="bg-[#1C1C1E] rounded-xl border border-white/10 divide-y divide-white/5 overflow-hidden">
             <div className="p-3.5 flex justify-between items-center">
                 <span className="text-sm text-white/50">Enrolled</span>
                 <span className="text-sm font-medium">{enrolledDate}</span>
             </div>
             <div className="p-3.5 flex justify-between items-center">
                 <span className="text-sm text-white/50">Primary Goal</span>
                 <span className="text-sm font-medium">{profile.primary_goal || "Not specified"}</span>
             </div>
             <div className="p-3.5 flex justify-between items-center">
                 <span className="text-sm text-white/50">WhatsApp</span>
                 <span className="text-sm font-medium">{profile.whatsapp_number}</span>
             </div>
         </div>
      </div>

      {/* ── Action Buttons ── */}
      <div className="px-4 flex gap-2.5">
        <button className="flex-1 bg-[#F20000] hover:bg-[#C20000] border-none rounded-xl p-[14px] text-white text-sm font-bold font-barlow tracking-widest uppercase transition-colors active:scale-[0.98]">
          Send Renewal
        </button>
        <Link 
          href={`/dashboard/checkin?clientId=${profile.id}`}
          className="flex-1 bg-[#1C1C1E] hover:bg-white/10 border border-white/10 rounded-xl p-[14px] text-white text-center text-sm font-semibold font-sans transition-colors active:scale-[0.98]"
        >
          Log Check-in
        </Link>
      </div>
    </div>
  );
}
