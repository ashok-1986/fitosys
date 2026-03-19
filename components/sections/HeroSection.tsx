"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle, Bell } from "lucide-react";
import { StatPair } from "@/components/ui/StatPair";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { HERO_STATS } from "@/lib/constants";

export function HeroSection() {
    const [activeTab, setActiveTab] = useState<"client" | "dashboard">("client");

    return (
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
            <div className="max-w-[1400px] mx-auto px-4 relative z-10">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Left Column - Copy */}
                    <div className="max-w-xl">
                        <Eyebrow label="Business OS for Fitness Coaches" />

                        <h1 className="font-display font-medium text-[44px] md:text-[60px] lg:text-[80px] leading-none tracking-[0.02em] uppercase text-white mt-6 mb-8">
                            The System <br />
                            <span className="text-[var(--red)]">Behind</span> <br />
                            The Result
                        </h1>

                        <p className="font-sans text-[18px] md:text-[19px] lg:text-[20px] leading-[1.7] text-[var(--grey)] mb-10">
                            Automate client onboarding, weekly check-ins, and renewals. Manage 40 clients with the effort of 15. Everything runs on WhatsApp.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-16">
                            <Link
                                href="/signup"
                                className="bg-[var(--red)] text-white px-8 py-4 text-[13px] font-bold uppercase tracking-wider hover:bg-[#C20000] transition-colors flex items-center justify-center gap-2 group"
                            >
                                Start 14-Day Free Trial
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        {/* Stat Strip */}
                        <div className="grid grid-cols-3 gap-8 py-8 border-y border-[var(--border)]">
                            <StatPair value={HERO_STATS.responseRate.value} label={HERO_STATS.responseRate.label} valueColor="text-[var(--red)]" />
                            <StatPair value={HERO_STATS.avgEnergy.value} label={HERO_STATS.avgEnergy.label} />
                            <StatPair value={HERO_STATS.atRisk.value} label={HERO_STATS.atRisk.label} valueColor="text-[var(--red)]" />
                        </div>
                    </div>

                    {/* Right Column - Mockup & Floaters */}
                    <div className="relative w-full aspect-[4/5] lg:aspect-square flex justify-center items-center">

                        {/* Background Glow */}
                        <div className="absolute inset-0 bg-[var(--red-dim)] rounded-full blur-[120px] opacity-70" />

                        {/* Phone Mockup Window */}
                        <div className="relative w-[300px] sm:w-[340px] bg-[var(--surface)] border border-[var(--border)] rounded-[40px] shadow-2xl overflow-hidden z-10 flex flex-col h-[600px]">

                            {/* Tab Switcher */}
                            <div className="flex border-b border-[var(--border)] bg-[var(--surface2)]">
                                <button
                                    onClick={() => setActiveTab("client")}
                                    className={`flex-1 py-4 text-[13px] font-sans font-bold uppercase tracking-wider transition-colors ${activeTab === "client" ? "text-white border-b-2 border-[var(--red)] bg-[#1A1A1A]" : "text-[var(--grey)] hover:text-white"
                                        }`}
                                >
                                    Client View
                                </button>
                                <button
                                    onClick={() => setActiveTab("dashboard")}
                                    className={`flex-1 py-4 text-[13px] font-sans font-bold uppercase tracking-wider transition-colors ${activeTab === "dashboard" ? "text-white border-b-2 border-[var(--red)] bg-[#1A1A1A]" : "text-[var(--grey)] hover:text-white"
                                        }`}
                                >
                                    Dashboard
                                </button>
                            </div>

                            {/* Mockup Content */}
                            <div className="flex-1 bg-[var(--black)] p-4 relative overflow-hidden">
                                {/* Client View Content */}
                                <div className={`absolute inset-0 p-5 transition-opacity duration-300 ease-in-out ${activeTab === "client" ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}>
                                    <div className="space-y-4">
                                        <div className="bg-[var(--surface)] border border-[var(--border)] p-4 rounded-xl rounded-tl-sm w-[85%]">
                                            <p className="text-[13px] text-[var(--grey)] leading-[1.4]">Hey Rahul! Weekly check-in time. On a scale of 1-10, how are your energy levels this week?</p>
                                            <span className="text-[10px] text-[var(--grey-mid)] mt-2 block">10:00 AM</span>
                                        </div>
                                        <div className="bg-[rgba(232,0,29,0.15)] border border-[var(--red-border)] p-4 rounded-xl rounded-tr-sm w-[85%] ml-auto">
                                            <p className="text-[13px] text-white leading-[1.4]">Feeling great actually! Solid 8. Hit all my prescribed macros too.</p>
                                            <span className="text-[10px] text-[var(--brand-glow)] mt-2 block text-right">10:45 AM</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Dashboard View Content */}
                                <div className={`absolute inset-0 p-5 transition-opacity duration-300 ease-in-out ${activeTab === "dashboard" ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}>
                                    <div className="space-y-3">
                                        <div className="bg-[var(--surface)] border border-[var(--border)] p-3 rounded-lg flex items-center justify-between">
                                            <div>
                                                <p className="text-[13px] font-bold text-white mb-0.5">Rahul Verma</p>
                                                <p className="text-[12px] text-[#10B981]">Energy: 8/10</p>
                                            </div>
                                            <CheckCircle className="w-4 h-4 text-[#10B981]" />
                                        </div>
                                        <div className="bg-[var(--surface)] border border-[var(--border)] p-3 rounded-lg flex items-center justify-between">
                                            <div>
                                                <p className="text-[13px] font-bold text-white mb-0.5">Priya Sharma</p>
                                                <p className="text-[12px] text-[var(--red)]">Missed 2 check-ins</p>
                                            </div>
                                            <div className="w-2 h-2 rounded-full bg-[var(--red)]" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Float Card 1: Response Rate (Top Right) */}
                        <div className="absolute top-10 right-0 lg:-right-12 z-20 bg-[var(--surface)] border border-[var(--border)] p-4 shadow-2xl flex items-center gap-4 animate-[float_6s_ease-in-out_infinite]">
                            <div className="w-10 h-10 rounded-full bg-[rgba(16,185,129,0.15)] border border-[rgba(16,185,129,0.3)] flex items-center justify-center flex-shrink-0">
                                <CheckCircle className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="text-[13px] font-bold text-white mb-1">Response Rate</p>
                                <p className="text-[12px] text-[#10B981]">Up 14% this week</p>
                            </div>
                        </div>

                        {/* Float Card 2: Renewal Alert (Bottom Left) */}
                        <div className="absolute bottom-20 left-0 lg:-left-12 z-20 bg-[var(--surface)] border border-[var(--red-border)] p-4 shadow-2xl flex items-center gap-4 animate-[float_5s_ease-in-out_infinite_reverse]">
                            <div className="w-10 h-10 rounded-full bg-[var(--red-dim)] border border-[var(--red-border)] flex items-center justify-center flex-shrink-0">
                                <Bell className="w-5 h-5 text-[var(--red)]" />
                            </div>
                            <div>
                                <p className="text-[13px] font-bold text-white mb-1">Renewal Due</p>
                                <p className="text-[12px] text-[var(--grey)]">Vikram's 12-wk plan</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
