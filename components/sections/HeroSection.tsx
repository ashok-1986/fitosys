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

                        <div className="flex flex-col sm:flex-row items-center gap-4 mb-3">
                            <Link
                                href="/signup"
                                className="bg-[var(--red)] text-white px-8 py-4 text-[13px] font-bold uppercase tracking-wider hover:bg-[#C20000] transition-colors flex items-center justify-center gap-2 group w-full sm:w-auto text-center"
                            >
                                Start Free
                            </Link>
                            <Link
                                href="/demo"
                                className="bg-transparent border border-[var(--border)] text-white px-8 py-4 text-[13px] font-bold uppercase tracking-wider hover:bg-[#111] transition-colors flex items-center justify-center w-full sm:w-auto text-center"
                            >
                                View Demo
                            </Link>
                        </div>
                        <p className="font-sans text-[13px] text-[#888888] mb-14">No card needed · First 5 clients free · Setup in 10 minutes</p>

                        {/* Stat Strip */}
                        <div className="flex gap-12 pt-10 border-t border-white/6 mt-14">
                            {[
                                { num: '2–3hrs', label: 'saved per week\nper coach' },
                                { num: '₹72K+', label: 'avg annual revenue\nrecovered from renewals' },
                                { num: '30min', label: 'setup time.\nzero tech skills needed.' },
                            ].map((stat, i) => (
                                <div key={i}>
                                    <div className="font-display font-medium text-4xl text-[#E8001D] leading-none tracking-tight">
                                        {stat.num}
                                    </div>
                                    <div className="font-sans font-normal text-[13px] text-[#888888] mt-1 leading-[1.4] whitespace-pre-line">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column - Mockup & Floaters */}
                    <div className="relative w-full aspect-[4/5] lg:aspect-square flex justify-center items-center">

                        {/* Background Glow */}
                        <div className="absolute inset-0 bg-[var(--red-dim)] rounded-full blur-[120px] opacity-70" />

                        {/* Phone Mockup Chrome */}
                        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-[38px] p-2 relative z-10 shadow-2xl">
                            {/* Inner Screen */}
                            <div className="relative w-[300px] sm:w-[320px] bg-[var(--surface)] rounded-[30px] overflow-hidden flex flex-col h-[600px]">

                                {/* Tab Switcher */}
                                <div className="flex border-b border-[var(--border)] bg-[var(--surface2)] z-20 relative">
                                    <button
                                        onClick={() => setActiveTab("client")}
                                        className={`flex-1 py-4 text-[13px] font-sans font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === "client" ? "text-white border-[var(--red)] bg-[#1A1A1A]" : "text-[var(--grey)] border-transparent hover:text-white"
                                            }`}
                                    >
                                        Client View
                                    </button>
                                    <button
                                        onClick={() => setActiveTab("dashboard")}
                                        className={`flex-1 py-4 text-[13px] font-sans font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === "dashboard" ? "text-white border-[var(--red)] bg-[#1A1A1A]" : "text-[var(--grey)] border-transparent hover:text-white"
                                            }`}
                                    >
                                        Dashboard
                                    </button>
                                </div>

                                {/* Mockup Content Container */}
                                <div className="flex-1 bg-[var(--black)] relative overflow-hidden">

                                    {/* Client View Content */}
                                    <div className={`absolute inset-0 p-5 transition-opacity duration-300 ease-in-out flex flex-col justify-end gap-4 ${activeTab === "client" ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}>
                                        <div className="bg-[var(--surface)] border border-[var(--border)] p-4 rounded-xl rounded-tl-sm w-[85%]">
                                            <p className="text-[13px] text-[var(--grey)] leading-[1.4]">Hey Rahul! Weekly check-in time. On a scale of 1-10, how are your energy levels this week?</p>
                                            <span className="text-[10px] text-[var(--grey-mid)] mt-2 block">10:00 AM</span>
                                        </div>
                                        <div className="bg-[rgba(232,0,29,0.15)] border border-[var(--red-border)] p-4 rounded-xl rounded-tr-sm w-[85%] self-end">
                                            <p className="text-[13px] text-white leading-[1.4]">Feeling great actually! Solid 8. Hit all my prescribed macros too.</p>
                                            <span className="text-[10px] text-[var(--red-border)] mt-2 block text-right">10:45 AM</span>
                                        </div>
                                    </div>

                                    {/* Dashboard View Content */}
                                    <div className={`absolute inset-0 p-5 transition-opacity duration-300 ease-in-out ${activeTab === "dashboard" ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}>
                                        <div className="space-y-3 pt-4">
                                            <div className="bg-[var(--surface)] border border-[var(--border)] p-4 rounded-lg flex items-center justify-between">
                                                <div>
                                                    <p className="text-[14px] font-bold text-white mb-1">Rahul Verma</p>
                                                    <p className="text-[12px] text-[#10B981]">Energy: 8/10 • Prescribed Complete</p>
                                                </div>
                                                <CheckCircle className="w-5 h-5 text-[#10B981]" />
                                            </div>
                                            <div className="bg-[var(--surface)] border border-[var(--border)] p-4 rounded-lg flex items-center justify-between">
                                                <div>
                                                    <p className="text-[14px] font-bold text-white mb-1">Priya Sharma</p>
                                                    <p className="text-[12px] text-[var(--red)]">Missed 2 check-ins</p>
                                                </div>
                                                <div className="w-3 h-3 rounded-full bg-[var(--red)]" />
                                            </div>
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
