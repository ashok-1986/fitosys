"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { CheckCircle } from "lucide-react";
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
            {/* A subtle dark tint overlay just in case the old UI text needs contrast, though I'll leave it very subtle */}
            <div className="absolute inset-0 bg-black/40 z-0 pointer-events-none" />

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
                        <div className="absolute top-[12%] -right-[12%] min-w-[190px] z-20 shadow-2xl animate-[float_4s_ease-in-out_infinite] hidden lg:block" style={{ background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, padding: '12px 16px' }}>
                            <div style={{ color: '#888888', fontSize: 10, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: 6 }}>This Week&apos;s Response Rate</div>
                            <div className="font-display" style={{ color: '#E8001D', fontSize: 28, fontWeight: 500, lineHeight: 1 }}>73<span style={{ color: '#E8001D', fontSize: 16 }}>%</span></div>
                            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 3 }}>22 of 30 clients checked in</div>
                            <div className="h-[2px] bg-[rgba(255,255,255,0.06)] rounded-sm mt-[10px] overflow-hidden">
                                <div className="h-full bg-[#E8001D] rounded-sm" style={{ width: '73%' }}></div>
                            </div>
                        </div>

                        {/* Float card 2: Renewal Alert (Bottom Left) */}
                        <div className="absolute bottom-[18%] -left-[12%] min-w-[180px] z-20 shadow-2xl animate-[float_3.5s_ease-in-out_infinite_reverse] hidden lg:block" style={{ background: '#1A1A1A', border: '1px solid rgba(232,0,29,0.2)', borderRadius: 8, padding: '12px 16px' }}>
                            <div style={{ color: '#888888', fontSize: 10, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: 6 }}>Renewal Alert</div>
                            <div className="font-display" style={{ color: '#E8001D', fontFamily: 'var(--fd)', fontSize: 28, fontWeight: 500, lineHeight: 1 }}>3 clients</div>
                            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 3 }}>programs expiring in 7 days</div>
                            <div style={{ color: '#25D366', fontSize: 11, fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginTop: 8 }}>Reminders sent automatically ✓</div>
                        </div>

                        {/* Tab Switcher */}
                        <div className="flex gap-[2px] bg-[#111111] border border-white/10 rounded-[40px] p-1 mb-4 relative z-20">
                            <button
                                onClick={() => setActiveTab("client")}
                                style={activeTab === "client"
                                    ? { background: '#25D366', color: '#FFFFFF', fontSize: 12, fontWeight: 600, padding: '6px 14px', borderRadius: 20 }
                                    : { background: 'transparent', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.15)', fontSize: 12, padding: '6px 14px', borderRadius: 20 }
                                }
                                className="font-sans uppercase tracking-[0.08em] transition-all duration-250"
                            >
                                {activeTab === "client" ? "● " : "○ "}Client View
                            </button>
                            <button
                                onClick={() => setActiveTab("dashboard")}
                                style={activeTab === "dashboard"
                                    ? { background: '#25D366', color: '#FFFFFF', fontSize: 12, fontWeight: 600, padding: '6px 14px', borderRadius: 20 }
                                    : { background: 'transparent', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.15)', fontSize: 12, padding: '6px 14px', borderRadius: 20 }
                                }
                                className="font-sans uppercase tracking-[0.08em] transition-all duration-250"
                            >
                                {activeTab === "dashboard" ? "● " : "○ "}Dashboard
                            </button>
                        </div>

                        {/* Phone Mockup Frame */}
                        <div style={{ width: 300, background: '#0A0A0A', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 16, padding: 14 }} className="shadow-[0_48px_96px_rgba(0,0,0,0.9)] relative z-10">

                            {/* Inner Screen */}
                            <div className="relative rounded-[28px] overflow-hidden" style={{ minHeight: 500, background: '#111111', color: '#FFFFFF' }}>

                                {/* ════ Client View (WhatsApp) ════ */}
                                <div className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${activeTab === "client" ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`}>

                                    {/* WA Header */}
                                    <div style={{ background: '#0F1F17', padding: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <div className="w-[36px] h-[36px] rounded-full bg-[#E8001D] flex items-center justify-center font-display font-medium shrink-0" style={{ fontSize: 13, color: '#FFFFFF' }}>
                                            F
                                        </div>
                                        <div>
                                            <div style={{ color: '#FFFFFF', fontWeight: 600, fontSize: 14, lineHeight: 1.2 }} className="font-sans">Fitosys Bot</div>
                                            <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }} className="font-sans">for Coach Priya · automated</div>
                                        </div>
                                        <div className="ml-auto" style={{ background: 'rgba(37,211,102,0.2)', color: '#25D366', border: '1px solid rgba(37,211,102,0.35)', fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 3 }}>
                                            AUTO
                                        </div>
                                    </div>

                                    {/* WA Body */}
                                    <div style={{ background: '#111111', padding: 10, display: 'flex', flexDirection: 'column' as const, gap: 8, minHeight: 440 }}>
                                        {/* Sent bubble (coach) */}
                                        <div className="max-w-[84%] self-start reveal-slide-right" style={{ background: 'rgba(37,211,102,0.15)', border: '1px solid rgba(37,211,102,0.25)', color: '#FFFFFF', borderRadius: '12px 12px 2px 12px', padding: '10px 14px', fontSize: 13, lineHeight: 1.5, transitionDelay: '200ms' }}>
                                            <strong style={{ color: '#FFFFFF' }}>Hi Anjali! 👋</strong><br />
                                            <span style={{ color: '#FFFFFF' }}>Weekly check-in from Coach Priya:</span><br /><br />
                                            <span style={{ color: '#FFFFFF' }}>1. Energy this week (1-10)?</span><br />
                                            <span style={{ color: '#FFFFFF' }}>2. Sessions completed?</span><br />
                                            <span style={{ color: '#FFFFFF' }}>3. One win? 💪</span>
                                            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, textAlign: 'right' as const, marginTop: 4, display: 'block' }}>Sun 7:00 PM · Auto-sent</div>
                                        </div>
                                        {/* Received bubble (client) */}
                                        <div className="max-w-[84%] self-end shadow-sm reveal-slide-left" style={{ background: '#1E2420', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.85)', borderRadius: '12px 12px 12px 2px', padding: '10px 14px', fontSize: 13, lineHeight: 1.5, transitionDelay: '400ms' }}>
                                            <span style={{ color: 'rgba(255,255,255,0.85)' }}>Energy 8/10, 4 sessions done. Win: ran 5km non-stop! 🏃</span>
                                            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, textAlign: 'left' as const, marginTop: 4, display: 'block' }}>Sun 8:14 PM</div>
                                        </div>
                                        {/* Sent bubble (coach) */}
                                        <div className="max-w-[84%] self-start reveal-slide-right" style={{ background: 'rgba(37,211,102,0.15)', border: '1px solid rgba(37,211,102,0.25)', color: '#FFFFFF', borderRadius: '12px 12px 2px 12px', padding: '10px 14px', fontSize: 13, lineHeight: 1.5, transitionDelay: '600ms' }}>
                                            <span style={{ color: '#FFFFFF' }}>Amazing Anjali! 🔥 5km is a huge milestone. Coach Priya will review this Wednesday.</span>
                                            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, textAlign: 'right' as const, marginTop: 4, display: 'block' }}>Sun 8:14 PM · AI-generated</div>
                                        </div>
                                        {/* Received bubble (client) */}
                                        <div className="max-w-[84%] self-end shadow-sm reveal-slide-right" style={{ background: '#1E2420', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.85)', borderRadius: '12px 12px 12px 2px', padding: '10px 14px', fontSize: 13, lineHeight: 1.5, marginTop: 4, transitionDelay: '800ms' }}>
                                            <span style={{ color: 'rgba(255,255,255,0.85)' }}>Thank you! This system is so convenient 😊</span>
                                            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, textAlign: 'left' as const, marginTop: 4, display: 'block' }}>Sun 8:16 PM</div>
                                        </div>
                                    </div>
                                </div>


                                {/* ════ Dashboard View (Dark) ════ */}
                                <div className={`absolute inset-0 p-4 transition-opacity duration-300 ease-in-out ${activeTab === "dashboard" ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"}`} style={{ background: '#0A0A0A' }}>
                                    <div style={{ color: '#FFFFFF', fontSize: 15, fontWeight: 700, marginBottom: 16 }} className="font-sans">Clients Overview</div>

                                    <div className="space-y-3">
                                        <div style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.08)', padding: 12, borderRadius: 8 }} className="flex items-center justify-between">
                                            <div>
                                                <p style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 700, marginBottom: 2 }}>Anjali Kapoor</p>
                                                <p style={{ color: '#10B981', fontSize: 11 }}>Energy: 8/10 • Won: 5km run</p>
                                            </div>
                                            <CheckCircle className="w-4 h-4" style={{ color: '#10B981' }} />
                                        </div>
                                        <div style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.08)', padding: 12, borderRadius: 8 }} className="flex items-center justify-between">
                                            <div>
                                                <p style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 700, marginBottom: 2 }}>Vikram Singh</p>
                                                <p style={{ color: '#F59E0B', fontSize: 11 }}>Renewal in 7 days</p>
                                            </div>
                                            <div className="w-2 h-2 rounded-full" style={{ background: '#F59E0B' }} />
                                        </div>
                                        <div style={{ background: '#161616', border: '1px solid rgba(255,255,255,0.08)', padding: 12, borderRadius: 8 }} className="flex items-center justify-between">
                                            <div>
                                                <p style={{ color: '#FFFFFF', fontSize: 13, fontWeight: 700, marginBottom: 2 }}>Priya Sharma</p>
                                                <p style={{ color: '#E8001D', fontSize: 11 }}>Missed 2 check-ins</p>
                                            </div>
                                            <div className="w-2 h-2 rounded-full" style={{ background: '#E8001D' }} />
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
