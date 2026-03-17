"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  MessageCircle,
  RefreshCw,
  CheckCircle,
  Zap,
  Clock,
  Smartphone,
  Brain,
  Bell,
  Activity,
  UserX,
  CreditCard,
  BarChart3,
  TrendingDown,
  ShieldCheck,
  Award,
  Users,
  Heart,
  CalendarDays,
  PlayCircle,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

gsap.registerPlugin(ScrollTrigger);

/* —- HERO SECTION —- */
function HeroSection() {
  const ref = useRef<HTMLDivElement>(null);
  const floatCard1Ref = useRef<HTMLDivElement>(null);
  const floatCard2Ref = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);

  const [activeTab, setActiveTab] = useState<'wa' | 'dashboard'>('wa');
  const [autoCycle, setAutoCycle] = useState(true);

  useEffect(() => {
    if (!autoCycle) return;
    const interval = setInterval(() => {
      setActiveTab(prev => prev === 'wa' ? 'dashboard' : 'wa');
    }, 5000);
    return () => clearInterval(interval);
  }, [autoCycle]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.from("[data-hero-eyebrow]", { x: -40, opacity: 0, duration: 0.8 })
      .from("[data-hero-title-line]", { y: 60, opacity: 0, duration: 1, stagger: 0.15 }, "-=0.4")
      .from("[data-hero-sub]", { y: 30, opacity: 0, duration: 0.7 }, "-=0.6")
      .from("[data-hero-cta]", { y: 30, opacity: 0, duration: 0.6, stagger: 0.15 }, "-=0.5")
      .from("[data-hero-stats]", { y: 30, opacity: 0, duration: 0.7, stagger: 0.1 }, "-=0.4");

    if (floatCard1Ref.current) {
      gsap.from(floatCard1Ref.current, { x: 60, opacity: 0, duration: 1.2, ease: "power3.out", delay: 1 });
      gsap.to(floatCard1Ref.current, { y: -10, duration: 3, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 2 });
    }

    if (floatCard2Ref.current) {
      gsap.from(floatCard2Ref.current, { x: -60, opacity: 0, duration: 1.2, ease: "power3.out", delay: 1.2 });
      gsap.to(floatCard2Ref.current, { y: -8, duration: 2.5, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 2 });
    }

    if (phoneRef.current) {
      gsap.from(phoneRef.current, { scale: 0.9, opacity: 0, duration: 1.4, ease: "power3.out", delay: 0.8 });
      gsap.to(phoneRef.current, { y: -6, duration: 3.5, repeat: -1, yoyo: true, ease: "sine.inOut", delay: 2 });
    }

    gsap.from("[data-chat]", {
      y: 20,
      opacity: 0,
      stagger: 0.2,
      duration: 0.8,
      ease: "power3.out",
      delay: 1.5,
    });
  }, []);

  return (
    <section id="hero" className="relative min-h-screen bg-[#0A0A0A] flex items-center pt-20 overflow-hidden">
      {/* Grid background */}
      <div className="absolute inset-0 z-0" style={{
        backgroundImage: "linear-gradient(rgba(242,0,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(242,0,0,0.04) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
        maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black, transparent)"
      }} />
      
      {/* Glow effect */}
      <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[radial-gradient(circle,rgba(242,0,0,0.12)_0%,transparent_65%)] pointer-events-none z-0" />

      <div ref={ref} className="relative z-10 max-w-[1400px] mx-auto px-4 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left - Copy */}
          <div className="text-left">
            {/* Eyebrow */}
            <div data-hero-eyebrow className="flex items-center gap-3 mb-7">
              <div className="w-10 h-px bg-[#E8001D]" />
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#E8001D]">
                Built for Indian Coaches - Runs on WhatsApp
              </span>
            </div>

            {/* Title */}
            <h1 className="font-display font-medium text-5xl md:text-7xl lg:text-8xl uppercase leading-[0.92] tracking-tight mb-8 overflow-hidden">
              <span data-hero-title-line className="block overflow-hidden">
                <span className="inline-block">THE SYSTEM</span>
              </span>
              <span data-hero-title-line className="block overflow-hidden">
                <span className="inline-block" style={{ WebkitTextStroke: "1.5px rgba(255,255,255,0.3)", color: "transparent" }}>BEHIND</span>
              </span>
              <span data-hero-title-line className="block overflow-hidden">
                <span className="inline-block text-[#E8001D]">THE RESULT.</span>
              </span>
            </h1>

            {/* Subtitle */}
            <p data-hero-sub className="text-lg md:text-[18px] text-[#A0A0A0] leading-relaxed max-w-[520px] mb-12 font-light">
              Stop losing clients to <strong className="text-white font-medium">missed follow-ups</strong>. Fitosys automates client onboarding, weekly check-ins, and renewal reminders - natively on WhatsApp. <strong className="text-white font-medium">30 minutes to set up. Runs automatically after that.</strong>
            </p>

            {/* CTAs */}
            <div data-hero-cta className="flex flex-col items-start gap-4 mb-14">
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-[#E8001D] hover:bg-[#C20000] text-white px-8 h-14 text-[13px] font-bold uppercase tracking-wider border-2 border-[#E8001D]">
                  <Link href="/join">Start Free</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="bg-transparent hover:bg-white/5 text-white px-8 h-14 text-[13px] font-bold uppercase tracking-wider border-2 border-white/15">
                  <Link href="/demo">View Demo</Link>
                </Button>
              </div>
              <p className="text-xs text-[#A0A0A0] font-light">
                No card needed &middot; First 5 clients free &middot; Setup in 10 minutes
              </p>
            </div>

            {/* Stats */}
            <div data-hero-stats className="flex flex-wrap gap-12 pt-10 border-t border-[#222222]">
              <div>
                <div className="font-display text-4xl font-black text-white">2-3<span className="text-[#E8001D]">hrs</span></div>
                <div className="text-xs text-[#A0A0A0] mt-1 font-light">saved per week<br />per coach</div>
              </div>
              <div>
                <div className="font-display text-4xl font-black text-white">₹72<span className="text-[#E8001D]">K+</span></div>
                <div className="text-xs text-[#A0A0A0] mt-1 font-light">avg annual revenue<br />recovered from renewals</div>
              </div>
              <div>
                <div className="font-display text-4xl font-black text-white">30<span className="text-[#E8001D]">min</span></div>
                <div className="text-xs text-[#A0A0A0] mt-1 font-light">setup time.<br />zero tech skills needed.</div>
              </div>
            </div>
          </div>

          {/* Right - Visual */}
          <div className="relative flex justify-center items-center">
            {/* Float Card 1 */}
            <div ref={floatCard1Ref} className="absolute top-[8%] right-[-5%] lg:right-[-8%] bg-[#141414] border border-[#222222] rounded-xl px-5 py-4 z-20 min-w-[200px]">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#A0A0A0] mb-2">This Week&apos;s Response Rate</div>
              <div className="font-display text-3xl font-black text-white">73<span className="text-[#E8001D]">%</span></div>
              <div className="text-[11px] text-[#A0A0A0] mt-1">22 of 30 clients checked in</div>
              <div className="h-0.5 bg-[#222222] rounded-full mt-3 overflow-hidden">
                <div className="h-full w-[73%] bg-[#E8001D] rounded-full" />
              </div>
            </div>

            {/* Tabbed Phone Wrapper */}
            <div ref={phoneRef} className="relative z-10 flex flex-col items-center gap-0">
              
              {/* Tab Switcher */}
              <div className="flex gap-0.5 bg-[#111111] border border-[#222222] rounded-[40px] p-1 mb-4 z-20 relative">
                <button 
                  onClick={() => { setActiveTab('wa'); setAutoCycle(false); }}
                  className={`px-5 py-2 rounded-[36px] font-sans text-[11px] font-bold tracking-[0.08em] uppercase flex items-center gap-1.5 transition-all duration-300 ${activeTab === 'wa' ? 'bg-[#25D366] text-white' : 'bg-transparent text-[#A0A0A0]'}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full transition-opacity duration-300 ${activeTab === 'wa' ? 'bg-white opacity-100' : 'bg-current opacity-50'}`} /> Client View
                </button>
                <button 
                  onClick={() => { setActiveTab('dashboard'); setAutoCycle(false); }}
                  className={`px-5 py-2 rounded-[36px] font-sans text-[11px] font-bold tracking-[0.08em] uppercase flex items-center gap-1.5 transition-all duration-300 ${activeTab === 'dashboard' ? 'bg-[#E8001D] text-white' : 'bg-transparent text-[#A0A0A0]'}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full transition-opacity duration-300 ${activeTab === 'dashboard' ? 'bg-white opacity-100' : 'bg-current opacity-50'}`} /> Dashboard
                </button>
              </div>

              {/* Phone Frame */}
              <div className="relative z-10 w-[290px]">
                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-[38px] p-[13px] shadow-[0_40px_80px_rgba(0,0,0,0.9),0_8px_32px_rgba(242,0,0,0.08),0_0_0_1px_rgba(255,255,255,0.04)]">
                  <div className="rounded-[28px] overflow-hidden min-h-[490px] relative bg-[#0A0A0A]">
                    
                    {/* View: WhatsApp */}
                    <div className={`absolute inset-0 z-20 transition-all duration-[400ms] ease-in-out ${activeTab === 'wa' ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-3 pointer-events-none'}`}>
                      <div className="bg-[#075E54] h-full flex flex-col">
                        {/* WA Header */}
                        <div className="bg-[#075E54] px-[14px] pt-[14px] pb-[12px] flex items-center gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-[#E8001D] flex items-center justify-center font-sans font-bold text-xs text-white shrink-0">F</div>
                          <div>
                            <div className="font-sans text-[13px] font-bold text-white leading-tight">Fitosys Bot</div>
                            <div className="font-sans text-[10px] text-white/60">for Coach Priya · automated</div>
                          </div>
                          <div className="ml-auto bg-[#E8001D]/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full tracking-[0.08em] shrink-0">AUTO</div>
                        </div>

                        {/* WA Body */}
                        <div className="bg-[#ECE5DD] px-[9px] py-2.5 flex-1 flex flex-col gap-[7px]">
                          <div className="max-w-[82%] bg-[#E8D5FF] rounded-lg p-[7px_11px] text-[11px] leading-[1.5] text-[#333] self-start border-l-[3px] border-l-[#E8001D] relative">
                            <strong>Hi Anjali! 👋</strong><br/>
                            Weekly check-in from Coach Priya:<br/><br/>
                            1. Energy this week (1-10)?<br/>
                            2. Sessions completed?<br/>
                            3. One win? 💪
                            <div className="text-[9px] text-[#999] text-right mt-0.5">Sun 7:00 PM · Auto-sent</div>
                          </div>
                          <div className="max-w-[82%] bg-[#DCF8C6] rounded-[8px_8px_0_8px] p-[7px_11px] text-[11px] leading-[1.5] text-[#333] self-end relative">
                            Energy 8/10, 4 sessions done. Win: ran 5km non-stop! 🏃
                            <div className="text-[9px] text-[#999] text-right mt-0.5">Sun 8:14 PM</div>
                          </div>
                          <div className="max-w-[82%] bg-[#E8D5FF] rounded-lg p-[7px_11px] text-[11px] leading-[1.5] text-[#333] self-start border-l-[3px] border-l-[#E8001D] relative">
                            Amazing Anjali! 🔥 5km is a huge milestone. Coach Priya will review this Wednesday. Keep it up!
                            <div className="text-[9px] text-[#999] text-right mt-0.5">Sun 8:14 PM · AI-generated</div>
                          </div>
                          <div className="max-w-[82%] bg-white rounded-[0_8px_8px_8px] p-[7px_11px] text-[11px] leading-[1.5] text-[#333] self-start relative">
                            Thank you! This system is so convenient 😊
                            <div className="text-[9px] text-[#999] text-right mt-0.5">Sun 8:16 PM</div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* View: Dashboard */}
                    <div className={`absolute inset-0 z-10 transition-all duration-[400ms] ease-in-out bg-[#0A0A0A] ${activeTab === 'dashboard' ? 'opacity-100 translate-x-0 z-20' : 'opacity-0 translate-x-3 pointer-events-none'}`}>
                      {/* DB Header */}
                      <div className="bg-[#111111] border-b border-[#222222] px-[14px] py-3 flex items-center justify-between">
                        <div>
                          <div className="font-display text-[13px] font-medium tracking-[0.12em] uppercase text-white">Fitosys</div>
                          <div className="text-[9px] text-[#A0A0A0] mt-px">Coach Priya · Week 12</div>
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-[#22C55E] animate-pulse"></div>
                      </div>

                      <div className="p-[10px_12px] flex flex-col gap-2.5 overflow-hidden">
                        {/* Stat row */}
                        <div className="grid grid-cols-3 gap-1.5">
                          <div className="bg-[#111111] border border-[#222222] p-[8px_6px] text-center rounded-md">
                            <div className="font-display text-[20px] font-medium text-[#22C55E] leading-none tracking-[0.04em]">28</div>
                            <div className="font-sans text-[9px] text-[#A0A0A0] mt-[3px] leading-[1.4] tracking-[0.03em]">Active Clients</div>
                          </div>
                          <div className="bg-[#111111] border border-[#222222] p-[8px_6px] text-center rounded-md">
                            <div className="font-display text-[20px] font-medium text-[#F59E0B] leading-none tracking-[0.04em]">73%</div>
                            <div className="font-sans text-[9px] text-[#A0A0A0] mt-[3px] leading-[1.4] tracking-[0.03em]">Check-in Rate</div>
                          </div>
                          <div className="bg-[#111111] border border-[#222222] p-[8px_6px] text-center rounded-md">
                            <div className="font-display text-[20px] font-medium text-[#E8001D] leading-none tracking-[0.04em]">3</div>
                            <div className="font-sans text-[9px] text-[#A0A0A0] mt-[3px] leading-[1.4] tracking-[0.03em]">Renewals Due</div>
                          </div>
                        </div>

                        {/* Bar chart */}
                        <div>
                          <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-[#A0A0A0] mb-1.5">Check-ins This Week</div>
                          <div className="flex items-end gap-[5px] h-[52px]">
                            {[
                              { day: 'M', h: '80%', color: 'bg-[#22C55E]' },
                              { day: 'T', h: '95%', color: 'bg-[#22C55E]' },
                              { day: 'W', h: '60%', color: 'bg-[#F59E0B]' },
                              { day: 'T', h: '88%', color: 'bg-[#22C55E]' },
                              { day: 'F', h: '45%', color: 'bg-[#F59E0B]' },
                              { day: 'S', h: '30%', color: 'bg-[#E8001D]' },
                              { day: 'S', h: '73%', color: 'bg-[#22C55E]' },
                            ].map((bar, i) => (
                              <div key={i} className="flex flex-col items-center gap-[3px] flex-1">
                                <div className="w-full rounded-t-sm bg-[#222222] relative overflow-hidden h-[52px]">
                                  <div className={`absolute bottom-0 left-0 right-0 rounded-t-sm ${bar.color} transition-all duration-1000 ease-out`} style={{ height: activeTab === 'dashboard' ? bar.h : '0%' }}></div>
                                </div>
                                <div className="text-[8px] text-[#555555]">{bar.day}</div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Timeline */}
                        <div>
                          <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-[#A0A0A0] mb-1.5 mt-1">Automation Timeline · Today</div>
                          <div className="flex flex-col gap-[5px]">
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full shrink-0 bg-[#22C55E]"></div>
                              <div className="flex-1 h-px bg-[#222222] relative overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 bg-[#22C55E] transition-all duration-1000" style={{ width: activeTab === 'dashboard' ? '100%' : '0%' }}></div>
                              </div>
                              <div className="text-[9px] text-[#A0A0A0] whitespace-nowrap"><strong className="text-white font-medium">Check-ins</strong> sent · 28 clients</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full shrink-0 bg-[#22C55E]"></div>
                              <div className="flex-1 h-px bg-[#222222] relative overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 bg-[#22C55E] transition-all duration-1000 delay-150" style={{ width: activeTab === 'dashboard' ? '100%' : '0%' }}></div>
                              </div>
                              <div className="text-[9px] text-[#A0A0A0] whitespace-nowrap"><strong className="text-white font-medium">AI Summary</strong> delivered</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full shrink-0 bg-[#F59E0B]"></div>
                              <div className="flex-1 h-px bg-[#222222] relative overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 bg-[#F59E0B] transition-all duration-1000 delay-300" style={{ width: activeTab === 'dashboard' ? '100%' : '0%' }}></div>
                              </div>
                              <div className="text-[9px] text-[#A0A0A0] whitespace-nowrap"><strong className="text-white font-medium">3 renewals</strong> reminder sent</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full shrink-0 bg-[#E8001D]"></div>
                              <div className="flex-1 h-px bg-[#222222] relative overflow-hidden">
                                <div className="absolute left-0 top-0 bottom-0 bg-[#E8001D] transition-all duration-1000 delay-500" style={{ width: activeTab === 'dashboard' ? '40%' : '0%' }}></div>
                              </div>
                              <div className="text-[9px] text-[#A0A0A0] whitespace-nowrap"><strong className="text-white font-medium">Follow-up</strong> 48h pending</div>
                            </div>
                          </div>
                        </div>

                        {/* Client list */}
                        <div>
                          <div className="text-[9px] font-bold tracking-[0.1em] uppercase text-[#A0A0A0] mb-1 mt-1">Priority Clients</div>
                          <div className="flex flex-col gap-1">
                            <div className="flex items-center gap-2 p-[5px_8px] bg-[#111111] rounded-[5px]">
                              <div className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center font-sans text-[9px] font-bold text-white bg-[#E8001D]">A</div>
                              <div className="text-[10px] text-white font-medium flex-1">Anjali Mehta</div>
                              <div className="text-[8px] font-bold tracking-[0.06em] uppercase px-[6px] py-0.5 rounded-[10px] bg-[#E8001D]/15 text-[#E8001D]">At Risk</div>
                            </div>
                            <div className="flex items-center gap-2 p-[5px_8px] bg-[#111111] rounded-[5px]">
                              <div className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center font-sans text-[9px] font-bold text-white bg-[#22C55E]">R</div>
                              <div className="text-[10px] text-white font-medium flex-1">Rahul Sharma</div>
                              <div className="text-[8px] font-bold tracking-[0.06em] uppercase px-[6px] py-0.5 rounded-[10px] bg-[#22C55E]/10 text-[#22C55E]">Strong</div>
                            </div>
                            <div className="flex items-center gap-2 p-[5px_8px] bg-[#111111] rounded-[5px]">
                              <div className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center font-sans text-[9px] font-bold text-white bg-[#F59E0B]">V</div>
                              <div className="text-[10px] text-white font-medium flex-1">Vikram Joshi</div>
                              <div className="text-[8px] font-bold tracking-[0.06em] uppercase px-[6px] py-0.5 rounded-[10px] bg-[#F59E0B]/10 text-[#F59E0B]">Renewal Due</div>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Float Card 2 */}
            <div ref={floatCard2Ref} className="absolute bottom-[15%] left-[-5%] lg:left-[-8%] bg-[#141414] border border-[#222222] rounded-xl px-5 py-4 z-20 min-w-[180px]">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#A0A0A0] mb-2">Renewal Alert</div>
              <div className="font-display text-xl font-black text-[#F59E0B]">3 clients</div>
              <div className="text-[11px] text-[#A0A0A0] mt-1">programs expiring in 7 days</div>
              <div className="mt-2 text-[10px] text-[#E8001D] font-bold uppercase tracking-wider">Reminders sent automatically ✓</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* - WHATSAPP CONVERSATION MOCKUP - */
function WhatsAppMockup() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    gsap.from(el, {
      x: 60,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
      delay: 0.6,
    });

    gsap.from(el.querySelectorAll("[data-chat]"), {
      y: 30,
      opacity: 0,
      stagger: 0.2,
      duration: 0.7,
      ease: "power3.out",
      delay: 1.0,
    });

    gsap.from(el.querySelector("[data-insight]"), {
      y: 40,
      opacity: 0,
      scale: 0.95,
      duration: 0.8,
      ease: "power3.out",
      delay: 1.8,
    });

    gsap.to(el, {
      y: -8,
      duration: 3.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: 2.5,
    });
  }, []);

  return (
    <div ref={ref} className="relative w-full max-w-sm mx-auto lg:mx-0">
      <div className="rounded-[2rem] bg-[#111111] border border-[#222222] shadow-2xl shadow-black/40 overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-3 pb-1">
          <span className="text-[10px] text-slate-400 font-medium">9:41</span>
          <div className="flex gap-1">
            <div className="w-3.5 h-2 rounded-sm border border-slate-500" />
          </div>
        </div>

        <div className="flex items-center gap-3 px-4 py-2.5 bg-[#0A0A0A] border-b border-[#222222]">
          <div className="h-8 w-8 rounded-full bg-[#E8001D]/20 flex items-center justify-center">
            <span className="text-xs font-bold text-[#E8001D]">F</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Fitosys</p>
            <p className="text-[10px] text-slate-400">Coach Priya&apos;s assistant</p>
          </div>
          <div className="ml-auto flex gap-3 text-slate-400">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" /></svg>
          </div>
        </div>

        <div className="px-3 py-4 space-y-3 bg-[#0A0A0A] min-h-[320px]">
          <div className="flex justify-center">
            <span className="text-[10px] text-[#A0A0A0] bg-[#111111] px-3 py-0.5 rounded-full">Sunday 7:00 PM</span>
          </div>

          <div data-chat className="flex justify-start">
            <div className="max-w-[80%] bg-[#111111] rounded-xl rounded-tl-sm px-3.5 py-2.5 shadow-sm">
              <p className="text-[13px] text-slate-200 leading-relaxed">
                Hey Anjali 👋 Quick weekly check-in from <span className="text-[#E8001D] font-medium">Coach Priya</span>. 4 questions, 2 minutes. How was your week?
              </p>
              <span className="text-[9px] text-[#A0A0A0] mt-1 block text-right">7:00 PM</span>
            </div>
          </div>

          <div data-chat className="flex justify-end">
            <div className="max-w-[80%] bg-[#E8001D]/10 border border-[#E8001D]/20 rounded-xl rounded-tr-sm px-3.5 py-2.5 shadow-sm">
              <p className="text-[13px] text-slate-200 leading-relaxed">
                Energy: 8/10, 4 sessions. Win: ran 5km non-stop! 🏃
              </p>
              <div className="flex items-center justify-end gap-1 mt-1">
                <span className="text-[9px] text-[#A0A0A0]">8:14 PM</span>
                <svg className="w-3 h-3 text-[#E8001D]" fill="currentColor" viewBox="0 0 24 24"><path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z" /></svg>
              </div>
            </div>
          </div>

          <div data-chat className="flex justify-start">
            <div className="max-w-[80%] bg-[#111111] rounded-xl rounded-tl-sm px-3.5 py-2.5 shadow-sm">
              <p className="text-[13px] text-slate-200 leading-relaxed">
                Amazing Anjali! 🔥 That 5km milestone is huge. Coach Priya will review this on Wednesday. See you then!
              </p>
              <span className="text-[9px] text-[#A0A0A0] mt-1 block text-right">8:14 PM · AI-generated</span>
            </div>
          </div>

          <div data-insight className="mt-4">
            <div className="bg-[#111111] border border-[#222222] rounded-xl px-4 py-3 shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-[#E8001D] animate-pulse" />
                <span className="text-xs font-semibold text-white">Anjali — Strong week</span>
              </div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] text-[#A0A0A0] w-12">Energy</span>
                <div className="flex-1 h-1.5 bg-[#222222] rounded-full overflow-hidden">
                  <div className="h-full w-[80%] bg-[#E8001D] rounded-full" />
                </div>
                <span className="text-[10px] text-[#E8001D] font-medium w-8 text-right">8/10</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#E8001D]/5 blur-3xl rounded-full" />
    </div>
  );
}

/* - PAIN TICKER COMPONENT - */
function PainTicker() {
  const items = [
    { severity: "Severity 9/10", text: "Payment collection delays costing ₹500-2,000/coach/year" },
    { severity: "8-12 hrs/week", text: "Lost to manual WhatsApp onboarding and follow-ups" },
    { severity: "10-20% churn", text: "From retention blindness and missed renewal reminders" },
    { severity: "Severity 9/10", text: "Manual onboarding costs ₹200-500/week in lost revenue" },
    { severity: "3-5 hrs/week", text: "Spent managing check-ins for 30+ clients manually" },
    { severity: "Zero visibility", text: "Into which clients are at risk of dropping out" },
  ];

  return (
    <div className="bg-[#111111] border-y border-[#222222] overflow-hidden">
      <div className="flex animate-ticker gap-0 whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center gap-4 px-10 py-4.5 border-r border-[#222222] flex-shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-[#E8001D] flex-shrink-0" />
            <span className="text-[13px] text-[#A0A0A0]">
              <strong className="text-white font-medium">{item.severity}</strong> - {item.text}
            </span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: ticker 30s linear infinite;
        }
      `}</style>
    </div>
  );
}

/* - MAIN LANDING PAGE - */
export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from("[data-hero-badge]", { y: 20, opacity: 0, duration: 0.6 })
      .from("[data-hero-title]", { y: 30, opacity: 0, duration: 0.7 }, "-=0.3")
      .from("[data-hero-desc]", { y: 20, opacity: 0, duration: 0.6 }, "-=0.4")
      .from("[data-hero-cta]", { y: 20, opacity: 0, duration: 0.5 }, "-=0.3")
      .from("[data-hero-proof]", { opacity: 0, duration: 0.5 }, "-=0.2");

    // Handle scroll for navbar
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Counter animation
  useEffect(() => {
    const counters = document.querySelectorAll("[data-counter]");
    counters.forEach((counter) => {
      const target = parseInt(counter.getAttribute("data-counter") || "0");
      const duration = 2;
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = (currentTime - startTime) / 1000;
        const progress = Math.min(elapsed / duration, 1);
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(target * easeProgress);
        counter.textContent = current.toString();
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    });
  }, []);

  return (
    <main className="min-h-screen bg-[#0A0A0A] font-sans selection:bg-[#E8001D]/30 selection:text-white">
      {/* Hero Section */}
      <HeroSection />

      {/* Pain Ticker */}
      <PainTicker />

      {/* Sticky Transparent Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#0A0A0A]/92 backdrop-blur-md border-b border-white/5" : "bg-transparent"}`}>
        <div className="max-w-[1400px] mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 bg-[#E8001D]" style={{ clipPath: "polygon(0 0, 70% 0, 100% 100%, 30% 100%)" }} />
            <span className="font-display font-black text-2xl tracking-tight text-white">FITO<span className="text-[#E8001D]">SYS</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#A0A0A0]">
            <Link href="#features" className="hover:text-white transition-colors">Features</Link>
            <Link href="#how" className="hover:text-white transition-colors">How It Works</Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
            <Link href="#about" className="hover:text-white transition-colors">About</Link>
            <Button asChild className="bg-[#E8001D] hover:bg-[#C20000] text-white rounded-full font-bold px-6 border-0">
              <Link href="/join">Start Free</Link>
            </Button>
          </div>
          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-[#0A0A0A]/98 flex flex-col items-center justify-center gap-8">
          <button className="absolute top-6 right-6 text-white" onClick={() => setMobileMenuOpen(false)}>
            <X className="w-8 h-8" />
          </button>
          <Link href="#features" className="font-display font-black text-3xl uppercase text-white" onClick={() => setMobileMenuOpen(false)}>Features</Link>
          <Link href="#how" className="font-display font-black text-3xl uppercase text-white" onClick={() => setMobileMenuOpen(false)}>How It Works</Link>
          <Link href="#pricing" className="font-display font-black text-3xl uppercase text-white" onClick={() => setMobileMenuOpen(false)}>Pricing</Link>
          <Link href="#about" className="font-display font-black text-3xl uppercase text-white" onClick={() => setMobileMenuOpen(false)}>About</Link>
          <Link href="#contact" className="font-display font-black text-3xl uppercase text-[#E8001D]" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
        </div>
      )}

      {/* Section 2: The Problem */}
      <section id="problem" className="bg-[#0A0A0A] py-32 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-px bg-[#E8001D]" />
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#E8001D]">The Problem</span>
              </div>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-medium text-white leading-tight mb-6">
                YOUR COACHING IS <span className="text-[#E8001D]">EXCELLENT.</span><br />
                <span className="text-white/20">YOUR SYSTEM</span> IS BROKEN.
              </h2>
              <p className="text-lg text-[#A0A0A0] leading-relaxed mb-12 max-w-lg">
                Independent coaches with 20-40 clients face the same operational failures every single month. None of them have anything to do with coaching quality.
              </p>

              <div className="space-y-0">
                <div className="bg-[#111111] border-l-3 border-l-[#E8001D] hover:bg-[#141414] transition-colors p-8 cursor-default">
                  <div className="text-[11px] font-bold tracking-widest uppercase text-[#555555] mb-2">01 - REVENUE LEAKAGE</div>
                  <h3 className="text-xl font-bold text-white mb-2">Renewals Slipping Through Gaps</h3>
                  <p className="text-[#A0A0A0] text-sm leading-relaxed mb-3">Programs expire and coaches find out only when the client stops responding. No system. No reminders. No recovery.</p>
                  <div className="inline-flex items-center gap-2 bg-[#E8001D]/10 border border-[#E8001D]/20 px-3 py-1 rounded-full text-[#E8001D] text-xs font-bold">₹72K-₹1.08L lost annually per coach</div>
                </div>
                <div className="bg-[#111111] border-l-[3px] border-l-transparent hover:border-l-[#E8001D] hover:bg-[#141414] transition-colors p-8 cursor-default">
                  <div className="text-[11px] font-bold tracking-widest uppercase text-[#555555] mb-2">02 - ENGAGEMENT BLIND SPOT</div>
                  <h3 className="text-xl font-bold text-white mb-2">No Early Warning for Disengagement</h3>
                  <p className="text-[#A0A0A0] text-sm leading-relaxed mb-3">Without structured check-ins, coaches have no data on client progress until the client complains or drops out.</p>
                  <div className="inline-flex items-center gap-2 bg-[#E8001D]/10 border border-[#E8001D]/20 px-3 py-1 rounded-full text-[#E8001D] text-xs font-bold">10-20% annual churn from retention blindness</div>
                </div>
                <div className="bg-[#111111] border-l-[3px] border-l-transparent hover:border-l-[#E8001D] hover:bg-[#141414] transition-colors p-8 cursor-default">
                  <div className="text-[11px] font-bold tracking-widest uppercase text-[#555555] mb-2">03 - ADMIN BURNOUT</div>
                  <h3 className="text-xl font-bold text-white mb-2">2-4 Hours Per Week on Non-Coaching Work</h3>
                  <p className="text-[#A0A0A0] text-sm leading-relaxed mb-3">WhatsApp follow-ups. Payment reconciliation. Manual onboarding. Time that should go to clients, content, or recovery.</p>
                  <div className="inline-flex items-center gap-2 bg-[#E8001D]/10 border border-[#E8001D]/20 px-3 py-1 rounded-full text-[#E8001D] text-xs font-bold">8-12 hours/week average admin overhead</div>
                </div>
              </div>
            </div>

            <div className="pl-10">
              <div className="text-[120px] leading-none text-[#E8001D]/30 font-serif mb-6">&quot;</div>
              <blockquote className="font-serif text-2xl md:text-3xl text-white leading-relaxed mb-8 italic">
                I was spending every Sunday sending check-in messages manually to 28 clients. By Monday morning I was already exhausted before the week started.
              </blockquote>
              <div className="text-sm text-[#A0A0A0] mb-10">
                <strong className="text-white">Priya Sharma</strong> - Independent Fitness Coach, Mumbai<br />
                <span className="text-[#E8001D] text-xs">2.5 hours recovered per week after Fitosys</span>
              </div>
              <div className="bg-[#111111] border-l-[3px] border-l-[#E8001D] p-7">
                <p className="text-[#A0A0A0] text-sm leading-relaxed">
                  Fitosys gives a coach the ability to manage <strong className="text-white">40 clients</strong> with the same effort it currently takes to manage <strong className="text-white">15</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Features */}
      <section id="features" className="bg-[#111111] py-32">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 mb-20">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-px bg-[#E8001D]" />
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#E8001D]">Core Features</span>
              </div>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-medium text-white leading-tight">
                THREE THINGS.<br />
                <span className="text-white/20">ZERO</span><br />
                <span className="text-[#E8001D]">MANUAL WORK.</span>
              </h2>
            </div>
            <p className="text-lg text-[#A0A0A0] leading-relaxed self-end max-w-lg">
              Fitosys automates exactly three workflows - the three that eat the most time and cost the most revenue. Nothing more. Nothing less.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-0.5">
            {[
              { num: "01", icon: Users, title: "Automated Client Onboarding", desc: "Share one link. Client fills a form, pays via Razorpay UPI/card, and gets a WhatsApp welcome message - all automatically.", tag: "WhatsApp Native", tagColor: "text-[#25D366] bg-[#25D366]/10 border-[#25D366]/25" },
              { num: "02", icon: MessageCircle, title: "Weekly Check-in System", desc: "Every Sunday, every active client gets a structured check-in message. Their reply is stored automatically. You review a clean summary on Monday.", tag: "WhatsApp Native", tagColor: "text-[#25D366] bg-[#25D366]/10 border-[#25D366]/25" },
              { num: "03", icon: RefreshCw, title: "Renewal Reminder System", desc: "Programs expiring in 7 days trigger automatic WhatsApp reminders. A follow-up fires after 48 hours if no reply. Never lose a renewal again.", tag: "WhatsApp Native", tagColor: "text-[#25D366] bg-[#25D366]/10 border-[#25D366]/25" },
              { num: "04", icon: Brain, title: "AI Monday Summary", desc: "Gemini AI reads all check-ins and sends you a 150-word brief every Monday at 7AM. Response rates, energy trends, at-risk clients - prioritised.", tag: "AI Powered", tagColor: "text-[#E8001D] bg-[#E8001D]/10 border-[#E8001D]/25" },
              { num: "05", icon: CreditCard, title: "GST Invoice Generation", desc: "Every Razorpay payment automatically generates a GST-compliant invoice delivered via email. No manual invoice creation.", tag: "Compliance Built-in", tagColor: "text-[#E8001D] bg-[#E8001D]/10 border-[#E8001D]/25" },
              { num: "06", icon: BarChart3, title: "Coach Dashboard", desc: "Every client's status, check-in history, payment timeline, and renewal date - in one clean view. No spreadsheets. No app switching.", tag: "Real-time Data", tagColor: "text-[#E8001D] bg-[#E8001D]/10 border-[#E8001D]/25" },
            ].map((feature, i) => (
              <div key={i} className="group bg-[#0A0A0A] p-10 hover:bg-[#141414] transition-colors relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-transparent group-hover:bg-[#E8001D] transition-colors" />
                <div className="font-display text-6xl font-black text-[#222222] mb-6 group-hover:text-[#E8001D]/15 transition-colors">{feature.num}</div>
                <div className={`w-11 h-11 rounded-lg flex items-center justify-center mb-5 bg-[#E8001D]/10 border border-[#E8001D]/20 group-hover:bg-[#E8001D]/20 transition-colors`}>
                  <feature.icon className="w-5 h-5 text-[#E8001D]" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-[#A0A0A0] text-sm leading-relaxed mb-5">{feature.desc}</p>
                <span className={`inline-block text-[11px] font-bold tracking-wider uppercase px-3 py-1 rounded-full border ${feature.tagColor}`}>{feature.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 4: How It Works */}
      <section id="how" className="bg-[#0A0A0A] py-32">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 mb-16">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-px bg-[#E8001D]" />
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#E8001D]">How It Works</span>
              </div>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-medium text-white leading-tight">
                FOUR STEPS TO<br />
                <span className="text-[#E8001D]">FULL</span><br />
                <span className="text-white/20">AUTOMATION.</span>
              </h2>
            </div>
            <p className="text-lg text-[#A0A0A0] leading-relaxed self-end max-w-lg">
              From sign-up to a fully automated coaching business. The average setup time is 28 minutes. No technical knowledge required.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-0.5 relative">
            <div className="absolute left-9 top-16 bottom-16 w-0.5 bg-gradient-to-b from-[#E8001D] to-[#E8001D]/10 hidden lg:block" />
            {[
              { num: "01", step: "1", title: "Sign Up & Create Profile", desc: "Create your Fitosys account. Add your coaching type, WhatsApp business number, and Razorpay details.", time: "5 minutes" },
              { num: "02", step: "2", title: "Create Your First Program", desc: "Define your coaching program - name, duration, price, and check-in schedule. Get your unique onboarding link.", time: "8 minutes" },
              { num: "03", step: "3", title: "Share Your Onboarding Link", desc: "Send your link to new clients. They fill details, pay via UPI/card, get a WhatsApp welcome. You get notified.", time: "15 min to first client" },
              { num: "04", step: "4", title: "Fitosys Runs the Rest", desc: "Check-ins fire every Sunday. AI summary arrives Monday. Renewal reminders go out 7 days before program ends.", time: "Runs forever" },
            ].map((item, i) => (
              <div key={i} className="relative bg-[#111111] p-10 group hover:bg-[#141414] transition-colors">
                <div className="absolute top-1/2 right-0 w-6 h-0.5 bg-[#E8001D] transform translate-x-1/2 -translate-y-1/2 hidden lg:block" />
                <div className="font-display text-7xl font-black text-[#E8001D]/8 mb-4">{item.num}</div>
                <div className="w-8 h-8 rounded-full bg-[#E8001D] flex items-center justify-center text-white font-black text-sm mb-5">{item.step}</div>
                <h3 className="text-lg font-bold text-white mb-3">{item.title}</h3>
                <p className="text-[#A0A0A0] text-sm leading-relaxed mb-5">{item.desc}</p>
                <div className="flex items-center gap-2 text-[#E8001D] text-xs font-bold uppercase tracking-wider">
                  <Clock className="w-3 h-3" /> {item.time}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: WhatsApp Showcase */}
      <section id="whatsapp" className="bg-[#111111] py-32 overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-px bg-[#E8001D]" />
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#E8001D]">WhatsApp Native</span>
              </div>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-medium text-white leading-tight mb-6">
                YOUR CLIENTS<br />
                <span className="text-white/20">NEVER</span><br />
                NEED AN<br />
                <span className="text-[#E8001D]">APP.</span>
              </h2>
              <p className="text-lg text-[#A0A0A0] leading-relaxed mb-12 max-w-lg">
                95% of coach-client communication in India happens on WhatsApp. Fitosys works inside the channel your clients already use. No downloads. No logins. No friction.
              </p>

              <div className="space-y-6">
                {[
                  { icon: MessageCircle, title: "Messages Come From Your Number", desc: "Every automated message is sent from your registered WhatsApp business number - in your name." },
                  { icon: ShieldCheck, title: "Approved Message Templates", desc: "All WhatsApp messages use Meta-approved templates. Fully compliant with WhatsApp Business Policy." },
                  { icon: CheckCircle, title: "Replies Are Auto-Captured", desc: "When a client replies to a check-in, their response is automatically stored in Fitosys." },
                  { icon: Zap, title: "Cost Per Message: ₹1.09", desc: "WhatsApp Business API charges ₹1.09 per marketing message. For 30 clients, monthly cost is under ₹300.", highlight: true },
                ].map((item, i) => (
                  <div key={i} className="flex gap-5 items-start">
                    <div className={`w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0 ${item.highlight ? "bg-[#25D366]/15 border border-[#25D366]/30" : "bg-[#25D366]/10 border border-[#25D366]/25"}`}>
                      <item.icon className={`w-5 h-5 ${item.highlight ? "text-[#25D366]" : "text-[#25D366]"}`} />
                    </div>
                    <div>
                      <h3 className="text-[15px] font-bold text-white mb-1">{item.title}</h3>
                      <p className="text-[#A0A0A0] text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <WhatsAppMockup />
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: AI Intelligence */}
      <section id="ai" className="bg-[#0A0A0A] py-32 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 font-display text-[200px] md:text-[320px] font-black text-[#E8001D]/3 uppercase whitespace-nowrap pointer-events-none select-none">INTELLIGENCE</div>
        <div className="max-w-[1400px] mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-px bg-[#E8001D]" />
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#E8001D]">AI Intelligence</span>
              </div>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-medium text-white leading-tight mb-6">
                YOUR AI<br />
                <span className="text-[#E8001D]">COACH</span><br />
                <span className="text-white/20">ASSISTANT.</span>
              </h2>
              <p className="text-lg text-[#A0A0A0] leading-relaxed mb-12 max-w-lg">
                Gemini AI reads every client check-in, identifies patterns, flags risks, and delivers a prioritised brief to your WhatsApp every Monday morning.
              </p>

              <div className="space-y-4">
                {[
                  { icon: Brain, title: "Monday Summary Delivery", desc: "Every Monday at 7AM, an AI-generated summary of all client check-ins arrives on your WhatsApp." },
                  { icon: Bell, title: "At-Risk Client Flagging", desc: "Clients showing low energy scores or missed check-ins are flagged before they drop out." },
                  { icon: Award, title: "Weekly Priority Surface", desc: "AI identifies the one specific thing you should prioritise this week." },
                ].map((item, i) => (
                  <div key={i} className="group bg-[#111111] border border-[#222222] hover:border-[#E8001D]/40 transition-colors p-7 flex gap-5 cursor-default">
                    <div className="w-10 h-10 bg-[#E8001D]/10 border border-[#E8001D]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#E8001D]/20 transition-colors">
                      <item.icon className="w-5 h-5 text-[#E8001D]" />
                    </div>
                    <div>
                      <h3 className="text-[15px] font-bold text-white mb-2">{item.title}</h3>
                      <p className="text-[#A0A0A0] text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#111111] border border-[#222222] rounded-sm overflow-hidden">
              <div className="bg-[#141414] px-6 py-4 flex items-center justify-between border-b border-[#222222]">
                <span className="text-xs font-bold text-white">Monday AI Summary - Week 12</span>
                <span className="bg-[#E8001D]/15 border border-[#E8001D]/30 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider text-[#E8001D]">Gemini Powered</span>
              </div>
              <div className="p-6">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#A0A0A0] mb-4">March 3-9, 2026 · 28 active clients</div>
                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div className="bg-[#0A0A0A] p-3.5 text-center">
                    <div className="font-display text-2xl font-black text-[#22C55E]">73%</div>
                    <div className="text-[10px] text-[#A0A0A0] mt-1">Response Rate</div>
                  </div>
                  <div className="bg-[#0A0A0A] p-3.5 text-center">
                    <div className="font-display text-2xl font-black text-[#F59E0B]">7.1</div>
                    <div className="text-[10px] text-[#A0A0A0] mt-1">Avg Energy</div>
                  </div>
                  <div className="bg-[#0A0A0A] p-3.5 text-center">
                    <div className="font-display text-2xl font-black text-[#E8001D]">3</div>
                    <div className="text-[10px] text-[#A0A0A0] mt-1">Need Attention</div>
                  </div>
                </div>
                <div className="bg-[#E8001D]/6 border border-[#E8001D]/15 p-4 mb-3">
                  <div className="text-[10px] font-black uppercase tracking-wider text-[#E8001D] mb-2">⚡ This Week&apos;s Priority</div>
                  <p className="text-[#A0A0A0] text-sm">Anjali, Vikram, and Meera have not responded to check-ins for 2 consecutive weeks. Send a personal message this week - these clients are showing early churn signals.</p>
                </div>
                <div className="bg-[#22C55E]/6 border border-[#22C55E]/15 p-4 mb-5">
                  <div className="text-[10px] font-black uppercase tracking-wider text-[#22C55E] mb-2">🏆 Strong This Week</div>
                  <p className="text-[#A0A0A0] text-sm">Rahul hit a 5km personal best. Deepa completed all 5 sessions for the second week running. Both are strong renewal candidates.</p>
                </div>
                <div className="space-y-2">
                  {[
                    { name: "Anjali Mehta", status: "At Risk", statusClass: "bg-[#E8001D]/15 text-[#E8001D]" },
                    { name: "Rahul Sharma", status: "Strong", statusClass: "bg-[#22C55E]/10 text-[#22C55E]" },
                    { name: "Deepa Nair", status: "Champion", statusClass: "bg-[#22C55E]/10 text-[#22C55E]" },
                    { name: "Vikram Joshi", status: "Watch", statusClass: "bg-[#F59E0B]/10 text-[#F59E0B]" },
                  ].map((client, i) => (
                    <div key={i} className="flex items-center justify-between bg-[#0A0A0A] px-4 py-2.5">
                      <span className="text-sm font-medium text-white">{client.name}</span>
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${client.statusClass}`}>{client.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: Pricing */}
      <section id="pricing" className="bg-[#111111] py-32">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-10 h-px bg-[#E8001D]" />
              <span className="text-[11px] font-bold tracking-widest uppercase text-[#E8001D]">Pricing</span>
              <div className="w-10 h-px bg-[#E8001D]" />
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-medium text-white leading-tight mb-6">
              BUILT FOR<br />
              <span className="text-[#E8001D]">INDIA.</span><br />
              <span className="text-white/20">PRICED FOR</span><br />
              COACHES.
            </h2>
            <p className="text-lg text-[#A0A0A0] leading-relaxed">
              Client-count based pricing. You pay more only as your business grows.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-0.5">
            {[
              { tier: "Starter", price: "999", clients: "Up to 10 clients", featured: false, features: ["WhatsApp check-ins (auto)", "Razorpay payment onboarding", "Renewal reminders", "GST invoice generation", "Coach dashboard", { text: "AI Monday summary", locked: true }, { text: "Custom check-in questions", locked: true }] },
              { tier: "Basic", price: "1,499", clients: "Up to 25 clients", featured: true, features: ["Everything in Starter", "AI Monday summary", "At-risk client flagging", "AI coach insight", "Full check-in history", { text: "Custom check-in questions", locked: true }, { text: "Priority support", locked: true }] },
              { tier: "Pro", price: "2,999", clients: "Up to 50 clients", featured: false, features: ["Everything in Basic", "Custom check-in questions", "Program-specific templates", "Renewal analytics", "Churn reason tracking", "WhatsApp priority support"] },
              { tier: "Studio", price: "5,999", clients: "Unlimited clients", featured: false, features: ["Everything in Pro", "Multi-location management", "White-label onboarding", "API access", "Dedicated onboarding call", "1-hour priority support"] },
            ].map((plan, i) => (
              <div key={i} className={`relative p-10 ${plan.featured ? "bg-[#141414] border-t-2 border-t-[#E8001D]" : "bg-[#0A0A0A]"}`}>
                {plan.featured && <span className="absolute top-4 right-4 bg-[#E8001D] text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full">Most Popular</span>}
                <div className="text-[11px] font-black uppercase tracking-widest text-[#E8001D] mb-3">{plan.tier}</div>
                <div className="font-display text-5xl font-black text-white mb-1">
                  <sub className="text-lg align-middle text-[#A0A0A0]">₹</sub>{plan.price}
                </div>
                <div className="text-sm text-[#A0A0A0] mb-2">per month</div>
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-7 ${plan.featured ? "bg-[#E8001D]/8 text-white" : "bg-[#E8001D]/8 text-[#E8001D]"}`}>{plan.clients}</div>
                <div className="h-px bg-[#222222] mb-7" />
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className={`flex items-start gap-2.5 text-sm ${typeof f === "object" && f.locked ? "text-[#555555]" : "text-[#A0A0A0]"}`}>
                      <span className={typeof f === "object" && f.locked ? "text-[#555555]" : "text-[#22C55E]"}>{typeof f === "object" && f.locked ? "✗" : "✓"}</span>
                      <span>{typeof f === "object" ? f.text : f}</span>
                    </li>
                  ))}
                </ul>
                <Button asChild className={`w-full ${plan.featured ? "bg-[#E8001D] hover:bg-[#C20000] text-white" : "bg-transparent border border-[#222222] text-[#A0A0A0] hover:border-white hover:text-white"}`}>
                  <Link href="/join">Start Free</Link>
                </Button>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-[#A0A0A0] mt-10">14-day free trial on all plans. No credit card required. <Link href="#contact" className="text-white underline">Annual plans available</Link> - 2 months free.</p>
        </div>
      </section>

      {/* Section 8: Testimonials */}
      <section id="testimonials" className="bg-[#0A0A0A] py-32">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 mb-16">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-px bg-[#E8001D]" />
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#E8001D]">Coach Stories</span>
              </div>
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-medium text-white leading-tight">
                COACHES WHO<br />
                <span className="text-[#E8001D]">GOT THEIR</span><br />
                <span className="text-white/20">SUNDAYS BACK.</span>
              </h2>
            </div>
            <p className="text-lg text-[#A0A0A0] leading-relaxed self-end max-w-lg">
              Real coaches. Real numbers. These are the outcomes that happen when systems replace spreadsheets.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-0.5">
            {[
              { quote: "I used to spend every Sunday sending check-in messages manually to 28 clients. Now I wake up Monday morning to an AI summary and spend the time on an actual rest day.", roi: "2.5h", roiDesc: "saved every week. 130 hours per year given back to coaching.", name: "Priya Sharma", role: "Fitness Coach · Mumbai · 28 active clients", initial: "P", gradient: "from-[#E8001D] to-[#7C0000]" },
              { quote: "I was losing 2-3 renewals per month simply because I forgot to follow up. Fitosys caught 4 renewals in the first month alone. That's more than ₹15,000 in revenue.", roi: "₹1.8L", roiDesc: "annual renewal revenue recovered. ROI in the first week.", name: "Rahul Verma", role: "Yoga Instructor · Delhi · 22 active clients", initial: "R", gradient: "from-[#0F3460] to-[#0A1628]" },
              { quote: "My clients actually comment that the check-in system feels personal. They don't know it's automated. The AI replies match the tone I set - it genuinely feels like a message from me. That's the detail that matters.", roi: "94%", roiDesc: "check-in response rate. Up from 60% with manual messages.", name: "Ananya Krishnan", role: "Nutrition Coach · Bangalore · 35 active clients", initial: "A", gradient: "from-[#166534] to-[#052E16]" },
            ].map((testi, i) => (
              <div key={i} className="bg-[#111111] p-10 hover:bg-[#141414] transition-colors group">
                <div className="font-display text-6xl font-black text-[#E8001D]/15 mb-5 leading-none">&quot;</div>
                <p className="text-[#A0A0A0] text-sm leading-relaxed italic mb-7 font-serif">{testi.quote}</p>
                <div className="bg-[#E8001D]/8 border border-[#E8001D]/15 px-4 py-2.5 mb-6 flex items-center gap-3">
                  <span className="font-display text-2xl font-black text-[#E8001D]">{testi.roi}</span>
                  <span className="text-xs text-[#A0A0A0]">{testi.roiDesc}</span>
                </div>
                <div className="flex items-center gap-3.5">
                  <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${testi.gradient} flex items-center justify-center font-display font-black text-white text-sm`}>{testi.initial}</div>
                  <div>
                    <div className="text-sm font-bold text-white">{testi.name}</div>
                    <div className="text-xs text-[#A0A0A0]">{testi.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 9: About */}
      <section id="about" className="bg-[#111111] py-32">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-px bg-[#E8001D]" />
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#E8001D]">About Fitosys</span>
              </div>
              <div className="font-serif text-2xl md:text-3xl text-white leading-relaxed italic mb-10">
                Fitosys exists because <span className="text-[#E8001D] font-display font-black not-italic uppercase">India&apos;s best coaches</span> shouldn&apos;t be drowning in WhatsApp messages. The system should run. <span className="text-[#E8001D] font-display font-black not-italic uppercase">You should coach.</span>
              </div>
              <p className="text-lg text-[#A0A0A0] leading-relaxed mb-12 max-w-lg">
                Built by Alchemetryx, a technology company that builds systems for independent professionals. We saw coaches with real skill and genuine client impact - operating on spreadsheets, memory, and manual follow-ups. Fitosys is the fix.
              </p>

              <div className="space-y-0 border-t border-b border-[#222222]">
                {[
                  { num: "01", title: "India-First, Always", desc: "Razorpay UPI built in. GST invoices generated automatically. WhatsApp as primary communication. We built for how India actually works - not how Silicon Valley assumes it does." },
                  { num: "02", title: "Systems Over Features", desc: "Fitosys does three things. Perfectly. It does not try to be a CRM, a scheduling tool, a content platform, or an analytics suite. Three workflows. Zero manual work." },
                  { num: "03", title: "Coach Revenue is Sacred", desc: "Every feature is measured against one question: does this protect or grow the coach's revenue? If the answer is no, it does not ship." },
                ].map((item, i) => (
                  <div key={i} className="flex gap-5 py-6 border-b border-[#222222] last:border-b-0">
                    <span className="font-display text-sm font-black text-[#E8001D] w-8 flex-shrink-0">{item.num}</span>
                    <div>
                      <h3 className="text-sm font-bold text-white mb-1">{item.title}</h3>
                      <p className="text-sm text-[#A0A0A0]">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="font-display text-[120px] md:text-[160px] font-black text-transparent leading-none tracking-tighter" style={{ WebkitTextStroke: "1px rgba(255,255,255,0.08)" }}>
                FITO<span className="text-[#E8001D]/15" style={{ WebkitTextStrokeColor: "rgba(242,0,0,0.15)" }}>SYS</span>
              </div>
              <div className="space-y-0.5 mt-[-20px]">
                {[
                  { num: "₹72K", label: "Average annual revenue recovered per coach" },
                  { num: "130+", label: "Hours saved per year from admin automation" },
                  { num: "30min", label: "Average setup time for new coaches" },
                  { num: "₹999", label: "Starting price - less than one skipped session" },
                ].map((stat, i) => (
                  <div key={i} className="bg-[#0A0A0A] px-7 py-6 flex items-center justify-between">
                    <span className="font-display text-4xl font-black text-white">{stat.num}</span>
                    <span className="text-sm text-[#A0A0A0] text-right max-w-[160px]">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 10: CTA Banner */}
      <section id="cta-banner" className="bg-[#E8001D] py-20 md:py-28 relative overflow-hidden">
        <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="max-w-[1400px] mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-10">
            <div>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-medium text-white uppercase leading-none tracking-tight">
                STOP MANAGING.<br />
                <span className="opacity-40">START COACHING.</span>
              </h2>
              <p className="text-white/70 text-sm mt-3 font-light">No card needed · First 5 clients free · Setup in 10 minutes</p>
            </div>
            <Button asChild size="lg" className="bg-white text-[#E8001D] hover:bg-white/90 text-white px-10 h-14 text-sm font-black uppercase tracking-wider border-2 border-white">
              <Link href="/join">Start Free</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Section 11: Contact */}
      <section id="contact" className="bg-[#0A0A0A] py-32">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-px bg-[#E8001D]" />
                <span className="text-[11px] font-bold tracking-widest uppercase text-[#E8001D]">Get In Touch</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-medium text-white leading-tight mb-6">
                LET&apos;S BUILD YOUR<br />
                <span className="text-[#E8001D]">SYSTEM.</span>
              </h2>
              <p className="text-lg text-[#A0A0A0] leading-relaxed mb-10 max-w-md">
                Questions about Fitosys? Reach out and we'll get back to you.
              </p>

              <div className="space-y-4">
                {[
                  { icon: Heart, label: "Email", value: "hello@fitosys.com", href: "mailto:hello@fitosys.com" },
                ].map((item, i) => (
                  <a key={i} href={item.href} className="group flex items-center gap-4 p-5 bg-[#111111] border border-[#222222] hover:border-[#E8001D] transition-colors">
                    <div className="w-10 h-10 bg-[#E8001D]/10 border border-[#E8001D]/20 flex items-center justify-center">
                      <item.icon className="w-4 h-4 text-[#E8001D]" />
                    </div>
                    <div>
                      <div className="text-[11px] font-black uppercase tracking-wider text-[#A0A0A0]">{item.label}</div>
                      <div className="text-sm font-bold text-white group-hover:text-[#E8001D] transition-colors">{item.value}</div>
                    </div>
                  </a>
                ))}
              </div>
            </div>


          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#111111] border-t border-[#222222] py-16">
        <div className="max-w-[1400px] mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-[#222222] mb-8">
            <div>
              <div className="font-display font-black text-2xl tracking-tight text-white mb-4">FITO<span className="text-[#E8001D]">SYS</span></div>
              <p className="text-sm text-[#A0A0A0] leading-relaxed max-w-[260px]">The system behind the result. Built for independent coaches in India. Runs on WhatsApp.</p>
              <div className="mt-5 text-xs text-[#555555]">A product by <strong className="text-[#A0A0A0]">Alchemetryx</strong></div>
            </div>
            <div>
              <div className="text-[11px] font-black uppercase tracking-widest text-white mb-5">Product</div>
              <div className="space-y-2.5">
                <Link href="#features" className="block text-sm text-[#A0A0A0] hover:text-white transition-colors">Features</Link>
                <Link href="#pricing" className="block text-sm text-[#A0A0A0] hover:text-white transition-colors">Pricing</Link>
                <Link href="#how" className="block text-sm text-[#A0A0A0] hover:text-white transition-colors">How It Works</Link>
                <Link href="#demo" className="block text-sm text-[#A0A0A0] hover:text-white transition-colors">Live Demo</Link>
              </div>
            </div>
            <div>
              <div className="text-[11px] font-black uppercase tracking-widest text-white mb-5">Company</div>
              <div className="space-y-2.5">
                <Link href="#about" className="block text-sm text-[#A0A0A0] hover:text-white transition-colors">About</Link>
                <Link href="#testimonials" className="block text-sm text-[#A0A0A0] hover:text-white transition-colors">Stories</Link>
                <Link href="#contact" className="block text-sm text-[#A0A0A0] hover:text-white transition-colors">Contact</Link>
                <Link href="/privacy" className="block text-sm text-[#A0A0A0] hover:text-white transition-colors">Privacy</Link>
              </div>
            </div>
            <div>
              <div className="text-[11px] font-black uppercase tracking-widest text-white mb-5">Legal</div>
              <div className="space-y-2.5">
                <Link href="/terms" className="block text-sm text-[#A0A0A0] hover:text-white transition-colors">Terms of Service</Link>
                <Link href="/privacy" className="block text-sm text-[#A0A0A0] hover:text-white transition-colors">Privacy Policy</Link>
                <Link href="/refund" className="block text-sm text-[#A0A0A0] hover:text-white transition-colors">Refund Policy</Link>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-[#555555]">© 2026 <strong className="text-[#A0A0A0]">Alchemetryx</strong>. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <Link href="/terms" className="text-xs text-[#555555] hover:text-[#A0A0A0] transition-colors">Terms</Link>
              <Link href="/privacy" className="text-xs text-[#555555] hover:text-[#A0A0A0] transition-colors">Privacy</Link>
              <Link href="/cookies" className="text-xs text-[#555555] hover:text-[#A0A0A0] transition-colors">Cookies</Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
