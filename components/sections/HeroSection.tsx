"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle, Bell } from "lucide-react";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function HeroSection() {
    const [activeTab, setActiveTab] = useState<"client" | "dashboard">("client");

    return (
        <section className="relative pt-32 pb-20 lg:pt-44 lg:pb-32 overflow-hidden min-h-screen flex items-center">
            {/* Background Glow */}
            <div className="absolute top-[-300px] left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-[radial-gradient(ellipse,rgba(232,0,29,0.07)_0%,transparent_65%)] pointer-events-none z-0" />

            <div className="max-w-[1400px] mx-auto px-4 relative z-10 w-full">
                <div className="grid lg:grid-cols-2 gap-20 items-center">

                    {/* Left Column - Copy */}
                    <div className="max-w-[540px]">
                        <Eyebrow label="India's Coaching Business OS · Runs on WhatsApp" />

                        <h1 className="font-display font-medium text-[56px] md:text-[64px] lg:text-[80px] leading-none tracking-[0.02em] uppercase text-white mt-8 mb-8">
                            The System<br />
                            <span className="text-transparent" style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.2)' }}>Behind</span><br />
                            <span className="text-[var(--red)]">The Result.</span>
                        </h1>

                        <p className="font-sans text-[18px] md:text-[20px] leading-[1.7] text-[var(--grey)] mb-10 max-w-[480px]">
                            Automate your client check-ins, renewals, and onboarding — <strong className="text-white font-medium">natively on WhatsApp</strong>. Set up in 30 minutes. Runs every week without you.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                            <Link
                                href="/signup"
                                className="bg-[var(--red)] text-white px-8 py-[14px] text-[13px] font-bold uppercase tracking-[0.04em] hover:bg-[#C20000] border-2 border-[var(--red)] hover:border-[#C20000] transition-colors rounded-[2px] w-full sm:w-auto text-center"
                            >
                                Start Free
                            </Link>
                            <Link
                                href="/demo"
                                className="bg-transparent text-white px-8 py-[14px] text-[13px] font-medium uppercase tracking-[0.04em] border-2 border-[rgba(255,255,255,0.12)] hover:border-[rgba(255,255,255,0.4)] transition-colors rounded-[2px] w-full sm:w-auto text-center"
                            >
                                View Demo
                            </Link>
                        </div>
                        <p className="font-sans text-[12px] text-[var(--grey)] mb-14">No card needed · First 5 clients free · Setup in 10 minutes</p>

                        {/* Stat Strip */}
                        <div className="flex gap-12 pt-10 border-t border-[rgba(255,255,255,0.06)]">
                            {[
                                { num: '2–3hrs', label: 'saved per week\nper coach' },
                                { num: '₹72K+', label: 'avg annual revenue\nrecovered from renewals' },
                                { num: '30min', label: 'setup time.\nzero tech skills needed.' },
                            ].map((stat, i) => (
                                <div key={i}>
                                    <div className="font-display font-medium text-[36px] text-white leading-none tracking-[0.02em]">
                                        <span className={stat.num.includes('hr') || stat.num.includes('min') ? 'text-[var(--red)]' : 'text-white'}>
                                            {stat.num.includes('K') ? `₹72K+` : stat.num}
                                        </span>
                                    </div>
                                    <div className="font-sans font-normal text-[13px] text-[#888888] mt-[4px] leading-[1.4] whitespace-pre-line">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Mockup & Floaters */}
                    <div className="relative w-full flex flex-col items-center z-10">

                        {/* Float card 1: Response Rate (Top Right) */}
                        <div className="absolute top-[12%] -right-[12%] bg-[var(--surface)] border border-[var(--border)] rounded-xl py-4 px-5 min-w-[190px] z-20 shadow-2xl animate-[float_4s_ease-in-out_infinite] hidden lg:block">
                            <div className="font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--grey)] mb-[6px]">This Week's Response Rate</div>
                            <div className="font-display font-medium text-[28px] leading-none tracking-[0.02em] text-[var(--red)]">73<span className="text-[20px]">%</span></div>
                            <div className="font-sans text-[11px] text-[var(--grey)] mt-[3px]">22 of 30 clients checked in</div>
                            <div className="h-[2px] bg-[rgba(255,255,255,0.06)] rounded-sm mt-[10px] overflow-hidden">
                                <div className="h-full bg-[var(--red)] rounded-sm" style={{ width: '73%' }}></div>
                            </div>
                        </div>

                        {/* Float card 2: Renewal Alert (Bottom Left) */}
                        <div className="absolute bottom-[18%] -left-[12%] bg-[var(--surface)] border border-[var(--border)] rounded-xl py-4 px-5 min-w-[180px] z-20 shadow-2xl animate-[float_3.5s_ease-in-out_infinite_reverse] hidden lg:block">
                            <div className="font-sans text-[10px] font-bold uppercase tracking-[0.12em] text-[var(--grey)] mb-[6px]">Renewal Alert</div>
                            <div className="font-display font-medium text-[28px] leading-none tracking-[0.02em] text-[#F59E0B]">3 clients</div>
                            <div className="font-sans text-[11px] text-[var(--grey)] mt-[3px]">programs expiring in 7 days</div>
                            <div className="font-sans text-[10px] font-bold uppercase tracking-[0.08em] text-[var(--red)] mt-[8px]">Reminders sent automatically ✓</div>
                        </div>

                        {/* Tab Switcher */}
                        <div className="flex gap-[2px] bg-[var(--surface)] border border-[var(--border)] rounded-[40px] p-1 mb-4 relative z-20">
                            <button
                                onClick={() => setActiveTab("client")}
                                className={`font-sans font-bold text-[11px] uppercase tracking-[0.08em] px-5 py-2 rounded-[36px] transition-all duration-250 ${activeTab === "client" ? "bg-[#25D366] text-white" : "bg-transparent text-[var(--grey)] hover:text-white"
                                    }`}
                            >
                                {activeTab === "client" ? "● " : "○ "}Client View
                            </button>
                            <button
                                onClick={() => setActiveTab("dashboard")}
                                className={`font-sans font-bold text-[11px] uppercase tracking-[0.08em] px-5 py-2 rounded-[36px] transition-all duration-250 ${activeTab === "dashboard" ? "bg-[var(--surface2)] text-white" : "bg-transparent text-[var(--grey)] hover:text-white"
                                    }`}
                            >
                                {activeTab === "dashboard" ? "● " : "○ "}Dashboard
                            </button>
                        </div>

                        {/* Phone Mockup Frame */}
                        <div className="w-[300px] bg-[#1A1A1A] border border-[rgba(255,255,255,0.08)] rounded-[40px] p-[14px] shadow-[0_48px_96px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.03)] relative z-10 transition-all duration-300">

                            {/* Inner Screen */}
                            <div className="relative bg-[var(--black)] rounded-[30px] overflow-hidden min-h-[500px]">

                                {/* ════ Client View (WhatsApp) ════ */}
                                <div className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${activeTab === "client" ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}>

                                    {/* WA Header */}
                                    <div className="bg-[#075E54] p-[14px] flex items-center gap-[10px]">
                                        <div className="w-[36px] h-[36px] rounded-full bg-[var(--red)] flex items-center justify-center font-display font-bold text-[13px] text-white shrink-0">
                                            F
                                        </div>
                                        <div>
                                            <div className="font-sans text-[13px] font-bold text-white leading-[1.2]">Fitosys Bot</div>
                                            <div className="font-sans text-[10px] text-[rgba(255,255,255,0.6)]">for Coach Priya · automated</div>
                                        </div>
                                        <div className="ml-auto bg-[rgba(232,0,29,0.9)] text-white text-[9px] font-bold px-2 py-0.5 rounded-full tracking-[0.06em]">
                                            AUTO
                                        </div>
                                    </div>

                                    {/* WA Body */}
                                    <div className="bg-[#ECE5DD] p-[10px] flex flex-col gap-[8px] min-h-[440px]">
                                        <div className="max-w-[84%] p-[8px_12px] text-[12px] leading-[1.5] text-[#333] rounded-lg bg-[#E8D5FF] self-start border-l-4 border-[var(--red)]">
                                            <strong>Hi Anjali! 👋</strong><br />
                                            Weekly check-in from Coach Priya:<br /><br />
                                            1. Energy this week (1-10)?<br />
                                            2. Sessions completed?<br />
                                            3. One win? 💪
                                            <div className="text-[9px] text-[#999] text-right mt-[2px]">Sun 7:00 PM · Auto-sent</div>
                                        </div>
                                        <div className="max-w-[84%] p-[8px_12px] text-[12px] leading-[1.5] text-[#333] rounded-[8px_8px_0_8px] bg-[#DCF8C6] self-end shadow-sm">
                                            Energy 8/10, 4 sessions done. Win: ran 5km non-stop! 🏃
                                            <div className="text-[9px] text-[#999] text-right mt-[2px]">Sun 8:14 PM</div>
                                        </div>
                                        <div className="max-w-[84%] p-[8px_12px] text-[12px] leading-[1.5] text-[#333] rounded-lg bg-[#E8D5FF] self-start border-l-4 border-[var(--red)]">
                                            Amazing Anjali! 🔥 5km is a huge milestone. Coach Priya will review this Wednesday.
                                            <div className="text-[9px] text-[#999] text-right mt-[2px]">Sun 8:14 PM · AI-generated</div>
                                        </div>
                                        <div className="max-w-[84%] p-[8px_12px] text-[12px] leading-[1.5] text-[#333] rounded-[0_8px_8px_8px] bg-white self-start shadow-sm mt-1">
                                            Thank you! This system is so convenient 😊
                                            <div className="text-[9px] text-[#999] text-right mt-[2px]">Sun 8:16 PM</div>
                                        </div>
                                    </div>
                                </div>


                                {/* ════ Dashboard View (Dark) ════ */}
                                <div className={`absolute inset-0 bg-[var(--black)] p-4 transition-opacity duration-300 ease-in-out ${activeTab === "dashboard" ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}>
                                    <div className="font-sans font-bold text-white text-[15px] mb-4">Clients Overview</div>

                                    <div className="space-y-3">
                                        <div className="bg-[var(--surface)] border border-[var(--border)] p-3 rounded-lg flex items-center justify-between">
                                            <div>
                                                <p className="text-[13px] font-bold text-white mb-0.5">Anjali Kapoor</p>
                                                <p className="text-[11px] text-[#10B981]">Energy: 8/10 • Won: 5km run</p>
                                            </div>
                                            <CheckCircle className="w-4 h-4 text-[#10B981]" />
                                        </div>
                                        <div className="bg-[var(--surface)] border border-[var(--border)] p-3 rounded-lg flex items-center justify-between">
                                            <div>
                                                <p className="text-[13px] font-bold text-white mb-0.5">Vikram Singh</p>
                                                <p className="text-[11px] text-[#F59E0B]">Renewal in 7 days</p>
                                            </div>
                                            <div className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                                        </div>
                                        <div className="bg-[var(--surface)] border border-[var(--border)] p-3 rounded-lg flex items-center justify-between">
                                            <div>
                                                <p className="text-[13px] font-bold text-white mb-0.5">Priya Sharma</p>
                                                <p className="text-[11px] text-[var(--red)]">Missed 2 check-ins</p>
                                            </div>
                                            <div className="w-2 h-2 rounded-full bg-[var(--red)]" />
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
