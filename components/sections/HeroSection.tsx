"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { KineticText } from "@/components/ui/KineticText";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { CursorSpotlight } from "@/components/ui/CursorSpotlight";
import { useReveal } from "@/hooks/useReveal";
import { useCounter } from "@/hooks/useCounter";

export function HeroSection() {
    const [activeTab, setActiveTab] = useState<"client" | "dashboard">("client");
    const sectionRef = useRef<HTMLElement>(null);
    const statRef = useRef<HTMLDivElement>(null);
    
    const textRef = useReveal<HTMLParagraphElement>(100);

    const stat1 = useCounter(3, 1000, statRef);
    const stat2 = useCounter(72000, 1200, statRef);
    const stat3 = useCounter(30, 800, statRef);

    return (
        <section ref={sectionRef} className="relative pt-[120px] pb-24 md:pt-[160px] md:pb-32 overflow-hidden border-b border-[var(--border)] min-h-[90vh] flex items-center">
            <CursorSpotlight containerRef={sectionRef} />
            {/* Full-Screen Background Video */}
            <video
                src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260306_074215_04640ca7-042c-45d6-bb56-58b1e8a42489.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover z-0"
            />
            {/* Dark tint overlay for video contrast */}
            <div className="absolute inset-0 bg-black/60 z-0 pointer-events-none" />

            <div className="max-w-[1400px] mx-auto px-4 relative z-10 w-full">
                <div className="grid lg:grid-cols-2 gap-20 items-center">

                    {/* Left Column - Copy */}
                    <div className="max-w-[540px]">
                        <Eyebrow label="BUILT FOR INDIA'S COACHES · RUNS ON WHATSAPP" />

                        <h1 className="font-display font-medium uppercase tracking-[0.02em] leading-none text-[44px] md:text-[60px] lg:text-[80px]">
                            <KineticText as="span" className="block text-white" text="GOOD COACHES." delay={0} charDelay={40} />
                            <KineticText as="span" className="block text-[#E8001D]" text="LOST CLIENTS." delay={200} charDelay={40} />
                        </h1>

                        <p ref={textRef} className="reveal-on-scroll font-sans text-[20px] leading-[1.7] text-[var(--grey)] mb-10 max-w-[480px]">
                            Fitosys automates your client check-ins, renewals, and onboarding — <strong>natively on WhatsApp</strong>. 30 minutes to set up. Runs every week without you.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                            <MagneticButton radius={60} strength={0.4} className="w-full sm:w-auto">
                                <Link
                                    href="/signup"
                                    className="bg-[var(--red)] text-white px-8 py-[14px] text-[13px] font-bold uppercase tracking-[0.04em] hover:bg-[#C20000] border-2 border-[var(--red)] hover:border-[#C20000] transition-colors rounded-[2px] block text-center"
                                >
                                    Start Free
                                </Link>
                            </MagneticButton>
                            <Link
                                href="/demo"
                                className="bg-transparent text-white px-8 py-[14px] text-[13px] font-medium uppercase tracking-[0.04em] border-2 border-[rgba(255,255,255,0.12)] hover:border-[rgba(255,255,255,0.4)] transition-colors rounded-[2px] w-full sm:w-auto text-center"
                            >
                                View Demo
                            </Link>
                        </div>
                        <p className="font-sans text-[12px] text-[var(--grey)] mb-14">No card needed · First 5 clients free · Setup in 30 minutes</p>

                        {/* Stat Strip */}
                        <div ref={statRef} className="flex gap-8 md:gap-12 pt-8 border-t border-white/10">
                            <div className="flex flex-col gap-1 min-w-0">
                                <span className="font-display font-medium text-[32px] md:text-[40px] leading-none tracking-[0.02em] uppercase text-[#E8001D]">
                                    2–{stat1}hrs
                                </span>
                                <span className="font-sans text-[13px] text-[#888888] leading-[1.4]">
                                    saved every week
                                </span>
                            </div>
                            <div className="flex flex-col gap-1 min-w-0">
                                <span className="font-display font-medium text-[32px] md:text-[40px] leading-none tracking-[0.02em] uppercase text-[#E8001D]">
                                    ₹{Math.floor(stat2 / 1000)}K+
                                </span>
                                <span className="font-sans text-[13px] text-[#888888] leading-[1.4]">
                                    avg. annual revenue<br />recovered
                                </span>
                            </div>
                            <div className="flex flex-col gap-1 min-w-0">
                                <span className="font-display font-medium text-[32px] md:text-[40px] leading-none tracking-[0.02em] uppercase text-[#E8001D]">
                                    {stat3}min
                                </span>
                                <span className="font-sans text-[13px] text-[#888888] leading-[1.4]">
                                    setup time.<br />zero tech skills needed.
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Mockup & Floaters */}
                    <div className="relative w-full flex flex-col items-center z-10" style={{ color: '#FFFFFF' }}>

                        {/* Float card 1: Response Rate (Top Right) */}
                        <div className="absolute top-[12%] -right-[12%] min-w-[210px] z-20 shadow-2xl animate-[float_4s_ease-in-out_infinite] hidden lg:block bg-[#1A1A1A] border border-white/10 rounded-lg py-3 px-4">
                            <div className="text-[#888888] text-[13px] font-semibold uppercase tracking-widest mb-1.5">This Week&apos;s Response Rate</div>
                            <div className="font-display text-[#E8001D] text-3xl font-medium leading-none">73<span className="text-xl">%</span></div>
                            <div className="text-white/50 text-[13px] mt-1">22 of 30 clients checked in</div>
                            <div className="h-[2px] bg-white/5 rounded-sm mt-2.5 overflow-hidden">
                                <div className="h-full bg-[#E8001D] rounded-sm w-[73%]"></div>
                            </div>
                        </div>

                        {/* Float card 2: Renewal Alert (Bottom Left) */}
                        <div className="absolute bottom-[18%] -left-[12%] min-w-[200px] z-20 shadow-2xl animate-[float_3.5s_ease-in-out_infinite_reverse] hidden lg:block bg-[#1A1A1A] border border-[#E8001D]/20 rounded-lg py-3 px-4">
                            <div className="text-[#888888] text-[13px] font-semibold uppercase tracking-widest mb-1.5">Renewal Alert</div>
                            <div className="font-display text-[#E8001D] text-3xl font-medium leading-none">3 clients</div>
                            <div className="text-white/50 text-[13px] mt-1">programs expiring in 7 days</div>
                            <div className="text-[#25D366] text-[13px] font-semibold uppercase tracking-wider mt-2">Reminders sent automatically ✓</div>
                        </div>

                        {/* Tab Switcher */}
                        <div className="flex bg-[#111111] border border-white/10 rounded-full p-1 mb-4 relative z-20 shadow-lg">
                            <button
                                onClick={() => setActiveTab("client")}
                                className={`relative font-sans uppercase tracking-wider text-[13px] px-5 py-1.5 rounded-full outline-none ${
                                    activeTab === "client"
                                        ? "text-white font-semibold"
                                        : "text-white/50 hover:text-white/80"
                                }`}
                            >
                                {activeTab === "client" && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-[#25D366] rounded-full z-0"
                                        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                                    />
                                )}
                                <span className="relative z-10">Client View</span>
                            </button>
                            <button
                                onClick={() => setActiveTab("dashboard")}
                                className={`relative font-sans uppercase tracking-wider text-[13px] px-5 py-1.5 rounded-full outline-none ${
                                    activeTab === "dashboard"
                                        ? "text-white font-semibold"
                                        : "text-white/50 hover:text-white/80"
                                }`}
                            >
                                {activeTab === "dashboard" && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-[#25D366] rounded-full z-0"
                                        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                                    />
                                )}
                                <span className="relative z-10">Dashboard</span>
                            </button>
                        </div>

                        {/* Phone Mockup Frame */}
                        <div className="w-[360px] bg-[#0A0A0A] border border-white/10 rounded-2xl p-3.5 shadow-[0_48px_96px_rgba(0,0,0,0.9)] relative z-10 scale-[0.85] sm:scale-90 lg:scale-100 origin-center transition-transform">

                            {/* Inner Screen */}
                            <div className="relative rounded-3xl overflow-hidden min-h-[580px] bg-[#111111] text-white">

                                {/* ════ Client View (WhatsApp) ════ */}
                                <div className={`absolute inset-0 transition-opacity duration-300 ease-in-out flex flex-col ${activeTab === "client" ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}>

                                    {/* WA Header */}
                                    <div className="bg-[#0F1F17] p-3.5 flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-[#E8001D] flex items-center justify-center font-display font-medium shrink-0 text-[14px] text-white">
                                            F
                                        </div>
                                        <div>
                                            <div className="text-white font-semibold text-[15px] leading-tight font-sans">Fitosys Bot</div>
                                            <div className="text-white/50 text-[13px] font-sans">for Coach Priya · automated</div>
                                        </div>
                                        <div className="ml-auto bg-[#25D366]/20 text-[#25D366] border border-[#25D366]/30 text-[11px] font-semibold px-2 py-0.5 rounded-sm">
                                            AUTO
                                        </div>
                                    </div>

                                    {/* WA Body */}
                                    <div className="bg-[#111111] p-3 flex flex-col gap-3 flex-1 overflow-hidden">
                                        <AnimatePresence mode="wait">
                                            {activeTab === "client" && (
                                                <motion.div 
                                                    initial="hidden" 
                                                    animate="visible" 
                                                    exit="hidden"
                                                    variants={{
                                                        visible: { transition: { staggerChildren: 0.15 } }
                                                    }}
                                                    className="flex flex-col gap-3"
                                                >
                                                    {/* Sent bubble (coach) */}
                                                    <motion.div 
                                                        variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                                                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                                        className="max-w-[85%] self-start bg-[#25D366]/15 border border-[#25D366]/25 text-white rounded-tl-xl rounded-tr-xl rounded-br-xl rounded-bl-sm p-3 text-[14px] leading-relaxed origin-bottom-left"
                                                    >
                                                        <strong className="text-white">Hi Anjali! 👋</strong><br />
                                                        <span className="text-white">Weekly check-in from Coach Priya:</span><br /><br />
                                                        <span className="text-white">1. Energy this week (1-10)?</span><br />
                                                        <span className="text-white">2. Sessions completed?</span><br />
                                                        <span className="text-white">3. One win? 💪</span>
                                                        <div className="text-white/40 text-[12px] text-right mt-1.5 block">Sun 7:00 PM · Auto-sent</div>
                                                    </motion.div>
                                                    {/* Received bubble (client) */}
                                                    <motion.div 
                                                        variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                                                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                                        className="max-w-[85%] self-end shadow-sm bg-[#1E2420] border border-white/5 text-white/90 rounded-tl-xl rounded-tr-xl rounded-bl-xl rounded-br-sm p-3 text-[14px] leading-relaxed origin-bottom-right"
                                                    >
                                                        <span className="text-white/90">Energy 8/10, 4 sessions done. Win: ran 5km non-stop! 🏃</span>
                                                        <div className="text-white/40 text-[12px] text-left mt-1.5 block">Sun 8:14 PM</div>
                                                    </motion.div>
                                                    {/* Sent bubble (coach) */}
                                                    <motion.div 
                                                        variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                                                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                                        className="max-w-[85%] self-start bg-[#25D366]/15 border border-[#25D366]/25 text-white rounded-tl-xl rounded-tr-xl rounded-br-xl rounded-bl-sm p-3 text-[14px] leading-relaxed origin-bottom-left"
                                                    >
                                                        <span className="text-white">Amazing Anjali! 🔥 5km is a huge milestone. Coach Priya will review this Wednesday.</span>
                                                        <div className="text-white/40 text-[12px] text-right mt-1.5 block">Sun 8:14 PM · AI-generated</div>
                                                    </motion.div>
                                                    {/* Received bubble (client) */}
                                                    <motion.div 
                                                        variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                                                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                                        className="max-w-[85%] self-end shadow-sm bg-[#1E2420] border border-white/5 text-white/90 rounded-tl-xl rounded-tr-xl rounded-bl-xl rounded-br-sm p-3 text-[14px] leading-relaxed mt-1 origin-bottom-right"
                                                    >
                                                        <span className="text-white/90">Thank you! This system is so convenient 😊</span>
                                                        <div className="text-white/40 text-[12px] text-left mt-1.5 block">Sun 8:16 PM</div>
                                                    </motion.div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>


                                {/* ════ Dashboard View (Dark) ════ */}
                                <AnimatePresence mode="wait">
                                    {activeTab === "dashboard" && (
                                        <motion.div 
                                            initial="hidden" 
                                            animate="visible" 
                                            exit="hidden"
                                            variants={{
                                                hidden: { opacity: 0 },
                                                visible: { opacity: 1, transition: { duration: 0.3, staggerChildren: 0.1 } }
                                            }}
                                            className="absolute inset-0 p-4 bg-[#0A0A0A] z-10"
                                        >
                                            <motion.div variants={{ hidden: { opacity: 0, y: -5 }, visible: { opacity: 1, y: 0 } }} className="text-white text-[16px] font-bold mb-4 font-sans">
                                                Clients Overview
                                            </motion.div>

                                            <div className="space-y-3">
                                                <motion.div 
                                                    variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }}
                                                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                                    className="bg-[#161616] border border-white/5 p-3.5 rounded-xl flex items-center justify-between"
                                                >
                                                    <div>
                                                        <p className="text-white text-[14px] font-bold mb-1">Anjali Kapoor</p>
                                                        <p className="text-[#10B981] text-[13px]">Energy: 8/10 • Won: 5km run</p>
                                                    </div>
                                                    <CheckCircle className="w-5 h-5 text-[#10B981]" />
                                                </motion.div>
                                                <motion.div 
                                                    variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }}
                                                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                                    className="bg-[#161616] border border-white/5 p-3.5 rounded-xl flex items-center justify-between"
                                                >
                                                    <div>
                                                        <p className="text-white text-[14px] font-bold mb-1">Vikram Singh</p>
                                                        <p className="text-[#F59E0B] text-[13px]">Renewal in 7 days</p>
                                                    </div>
                                                    <div className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                                                </motion.div>
                                                <motion.div 
                                                    variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }}
                                                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                                    className="bg-[#161616] border border-white/5 p-3.5 rounded-xl flex items-center justify-between"
                                                >
                                                    <div>
                                                        <p className="text-white text-[14px] font-bold mb-1">Priya Sharma</p>
                                                        <p className="text-[#E8001D] text-[13px]">Missed 2 check-ins</p>
                                                    </div>
                                                    <div className="w-2.5 h-2.5 rounded-full bg-[#E8001D]" />
                                                </motion.div>
                                            </div>

                                        </motion.div>
                                    )}
                                </AnimatePresence>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}
