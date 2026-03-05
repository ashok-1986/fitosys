"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
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
  PlayCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ScrollReveal,
  StaggerReveal,
} from "@/components/gsap-provider";

gsap.registerPlugin(ScrollTrigger);

/* ── WhatsApp Conversation Mockup ─────────────────────── */

function WhatsAppMockup() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Float in from right
    gsap.from(el, {
      x: 60,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
      delay: 0.6,
    });

    // Stagger the chat bubbles
    gsap.from(el.querySelectorAll("[data-chat]"), {
      y: 30,
      opacity: 0,
      stagger: 0.2,
      duration: 0.7,
      ease: "power3.out",
      delay: 1.0,
    });

    // Float the dashboard card in last
    gsap.from(el.querySelector("[data-insight]"), {
      y: 40,
      opacity: 0,
      scale: 0.95,
      duration: 0.8,
      ease: "power3.out",
      delay: 1.8,
    });

    // Continuous subtle float
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
      {/* Phone Frame */}
      <div className="rounded-[2rem] bg-[#111111] border border-[#222222] shadow-2xl shadow-black/40 overflow-hidden">
        {/* Phone Status Bar */}
        <div className="flex items-center justify-between px-6 pt-3 pb-1">
          <span className="text-[10px] text-slate-400 font-medium">9:41</span>
          <div className="flex gap-1">
            <div className="w-3.5 h-2 rounded-sm border border-slate-500" />
          </div>
        </div>

        {/* WhatsApp Header */}
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

        {/* Chat Area */}
        <div className="px-3 py-4 space-y-3 bg-[#0A0A0A] min-h-[320px]">
          {/* Timestamp */}
          <div className="flex justify-center">
            <span className="text-[10px] text-[#A0A0A0] bg-[#111111] px-3 py-0.5 rounded-full">Sunday 7:00 PM</span>
          </div>

          {/* Fitosys message */}
          <div data-chat className="flex justify-start">
            <div className="max-w-[80%] bg-[#111111] rounded-xl rounded-tl-sm px-3.5 py-2.5 shadow-sm">
              <p className="text-[13px] text-slate-200 leading-relaxed">
                Hey Rohan 👋 Quick weekly check-in from <span className="text-[#E8001D] font-medium">Coach Priya</span>. 4 questions, 2 minutes. How was your week?
              </p>
              <span className="text-[9px] text-[#A0A0A0] mt-1 block text-right">7:00 PM</span>
            </div>
          </div>

          {/* Rohan's reply */}
          <div data-chat className="flex justify-end">
            <div className="max-w-[80%] bg-[#E8001D]/10 border border-[#E8001D]/20 rounded-xl rounded-tr-sm px-3.5 py-2.5 shadow-sm">
              <p className="text-[13px] text-slate-200 leading-relaxed">
                Lost 1.2 kg this week! Energy 8/10. Crushed all 4 sessions 💪 Struggled with meal prep on Thursday though.
              </p>
              <div className="flex items-center justify-end gap-1 mt-1">
                <span className="text-[9px] text-[#A0A0A0]">7:12 PM</span>
                <svg className="w-3 h-3 text-[#E8001D]" fill="currentColor" viewBox="0 0 24 24"><path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z" /></svg>
              </div>
            </div>
          </div>

          {/* AI Insight Card — floating below */}
          <div data-insight className="mt-4">
            <div className="bg-[#111111] border border-[#222222] rounded-xl px-4 py-3 shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-[#E8001D] animate-pulse" />
                <span className="text-xs font-semibold text-white">Rohan — Strong week</span>
              </div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] text-[#A0A0A0] w-12">Energy</span>
                <div className="flex-1 h-1.5 bg-[#222222] rounded-full overflow-hidden">
                  <div className="h-full w-[80%] bg-[#E8001D] rounded-full" />
                </div>
                <span className="text-[10px] text-[#E8001D] font-medium w-8 text-right">8/10</span>
              </div>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-amber-400 text-xs">⚠️</span>
                <span className="text-[11px] text-amber-300/80">Flag: nutrition gap — meal prep</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Glow behind phone */}
      <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[#E8001D]/5 blur-3xl rounded-full" />
    </div>
  );
}

/* ── Main Landing Page ────────────────────────────────── */

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;

    // Hero text stagger — left column
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.from("[data-hero-badge]", { y: 20, opacity: 0, duration: 0.6 })
      .from("[data-hero-title]", { y: 30, opacity: 0, duration: 0.7 }, "-=0.3")
      .from("[data-hero-desc]", { y: 20, opacity: 0, duration: 0.6 }, "-=0.4")
      .from("[data-hero-cta]", { y: 20, opacity: 0, duration: 0.5 }, "-=0.3")
      .from("[data-hero-proof]", { opacity: 0, duration: 0.5 }, "-=0.2");
  }, []);

  return (
    <main className="min-h-screen bg-[#0A0A0A] font-sans selection:bg-[#E8001D]/30 selection:text-white">
      {/* ── Sticky Transparent Navbar ───────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/60 backdrop-blur-md border-b border-white/5 transition-all duration-300">
        <div className="max-w-[1240px] mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <img 
              src="/fitosys-logo.png" 
              alt="Fitosys" 
              className="h-24 w-auto object-contain"
            />
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-[#A0A0A0]">
            <Link href="#features" className="hover:text-white transition-colors">How it Works</Link>
            <Link href="/demo" className="hover:text-[#E8001D] transition-colors flex items-center gap-1.5">
              <Brain className="h-4 w-4" /> Live AI Demo
            </Link>
            <Link href="#pricing" className="hover:text-white transition-colors">Pricing</Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold text-white hover:text-[#A0A0A0] transition-colors hidden sm:block">
              Log in
            </Link>
            <Link href="/signup">
              <Button className="bg-[#E8001D] hover:bg-[#9E0014] text-white rounded-full font-bold px-6 border-0">
                Start Free
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero — Section 1 */}
      <section ref={heroRef} className="relative overflow-hidden bg-[#0A0A0A] pt-40 pb-20 md:pt-48 md:pb-32">
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, #94a3b8 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
        {/* Gradient glow */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#E8001D]/[0.04] to-transparent" />
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0A0A0A] to-transparent" />

        <div className="relative max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left — Copy */}
            <div className="text-left flex flex-col items-start pt-8 lg:pt-0">
              <h1
                data-hero-title
                className="text-4xl md:text-[56px] font-bold leading-[1.05] text-white tracking-tight"
              >
                You became a coach to change lives. <span className="text-[#A0A0A0]">Not to spend Sunday nights chasing check-ins.</span>
              </h1>

              <p
                data-hero-desc
                className="text-lg text-[#A0A0A0] mt-6 max-w-lg leading-relaxed font-sans"
              >
                Fitosys runs your client follow-ups, weekly check-ins, and renewal reminders on autopilot — so Monday morning starts with a clear plan, not a pile of missed messages.
              </p>

              <div
                data-hero-cta
                className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mt-8 w-full sm:w-auto"
              >
                <Link href="/signup" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto bg-[#E8001D] hover:bg-[#9E0014] text-white px-8 h-14 text-base font-semibold shadow-lg shadow-[#E8001D]/20 transition-all rounded-full"
                  >
                    Start Free — No Card Needed
                  </Button>
                </Link>
                <Link href="/demo" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="w-full sm:w-auto h-14 text-base border-[#222222] text-[#A0A0A0] hover:bg-white/5 hover:text-white hover:border-[#A0A0A0] rounded-full transition-all"
                  >
                    <PlayCircle className="h-5 w-5 mr-2" />
                    See It Work in 60 Seconds <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>

              <div data-hero-proof className="mt-8 flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-8 w-8 rounded-full border-2 border-[#0A0A0A] bg-[#222222]" />
                  ))}
                </div>
                <p className="text-xs text-[#A0A0A0]/80">
                  Used by coaches in Mumbai · London · Toronto · Bangalore
                </p>
              </div>
            </div>

            {/* Right — WhatsApp Mockup */}
            <div className="flex justify-center w-full lg:justify-end mt-8 lg:mt-0 lg:order-last order-first mb-8 lg:mb-0">
              <WhatsAppMockup />
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: The Sunday Evening Scene */}
      <section className="bg-[#111111] py-24 relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4">
          <ScrollReveal className="text-center mb-16">
            <span className="text-[#E8001D] text-sm font-bold tracking-widest uppercase block mb-4">THE REAL COST OF DOING IT MANUALLY</span>
            <h2 className="text-3xl md:text-5xl font-black text-white max-w-3xl mx-auto leading-tight">
              Every week you lose time, money, and clients — not because you&apos;re a bad coach. Because you have no system.
            </h2>
          </ScrollReveal>

          <StaggerReveal className="grid md:grid-cols-3 gap-6 mb-16" stagger={0.15}>
            {/* Tile 1 */}
            <div className="bg-[#1A0003] border border-[#E8001D]/20 rounded-2xl p-8 hover:border-[#E8001D]/40 transition-colors group">
              <Clock className="h-10 w-10 text-[#E8001D] mb-6 opacity-80 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-white mb-3">2–3 hours every Sunday</h3>
              <p className="text-[#A0A0A0] leading-relaxed">
                You copy-paste check-in messages one by one. Edit the name. Hit send. Repeat for every client. Then wait to see who actually replies.
              </p>
            </div>
            {/* Tile 2 */}
            <div className="bg-[#1A0003] border border-[#E8001D]/20 rounded-2xl p-8 hover:border-[#E8001D]/40 transition-colors group">
              <UserX className="h-10 w-10 text-[#E8001D] mb-6 opacity-80 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-white mb-3">2–3 clients quietly disappear each month</h3>
              <p className="text-[#A0A0A0] leading-relaxed">
                Their program ended. You meant to follow up. Life got in the way. By the time you noticed, they had moved on.
              </p>
            </div>
            {/* Tile 3 */}
            <div className="bg-[#1A0003] border border-[#E8001D]/20 rounded-2xl p-8 hover:border-[#E8001D]/40 transition-colors group">
              <TrendingDown className="h-10 w-10 text-[#E8001D] mb-6 opacity-80 group-hover:scale-110 transition-transform" />
              <h3 className="text-xl font-bold text-white mb-3">Zero visibility until it&apos;s too late</h3>
              <p className="text-[#A0A0A0] leading-relaxed">
                You find out a client is struggling when they ask for a refund — not when their energy score dropped to 3 out of 10 for three weeks straight.
              </p>
            </div>
          </StaggerReveal>

          <ScrollReveal>
            <div className="text-center">
              <p className="text-2xl md:text-4xl font-black text-white px-4 py-8 rounded-2xl bg-[#E8001D]/5 border border-[#E8001D]/10">
                The average coach loses <span className="text-[#E8001D]">₹72,000</span> a year to admin gaps. Not bad coaching. Bad systems.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Section 3: Social Proof (Moved up) */}
      <section className="py-24 bg-[#0A0A0A] border-y border-[#222222]">
        <div className="max-w-6xl mx-auto px-4">
          <ScrollReveal className="text-center mb-16">
            <span className="text-[#A0A0A0] text-sm font-bold tracking-widest uppercase block mb-4">COACHES WHO MADE THE SWITCH</span>
            <h2 className="text-3xl md:text-5xl font-black text-white">
              Real coaches. Real results. No stock photos.
            </h2>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
            {/* Left — Before */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-px bg-[#E8001D]/50" />
                <span className="text-[#E8001D] font-bold tracking-widest uppercase text-sm">Before Fitosys</span>
                <div className="flex-1 h-px bg-[#E8001D]/20" />
              </div>
              <StaggerReveal stagger={0.1}>
                <div className="relative pl-6 border-l-2 border-[#E8001D]/30 py-2">
                  <p className="text-[#A0A0A0] italic mb-3">&quot;I was spending 3 hours every Sunday sending check-in messages manually. I dreaded it every single week.&quot;</p>
                  <p className="text-sm font-medium text-white">— Priya M., Fitness Coach, Mumbai</p>
                </div>
                <div className="relative pl-6 border-l-2 border-[#E8001D]/30 py-2">
                  <p className="text-[#A0A0A0] italic mb-3">&quot;A client dropped off and I only noticed when she posted about a different coach on Instagram. That was my wake-up call.&quot;</p>
                  <p className="text-sm font-medium text-white">— Rahul S., Yoga Instructor, Bangalore</p>
                </div>
                <div className="relative pl-6 border-l-2 border-[#E8001D]/30 py-2">
                  <p className="text-[#A0A0A0] italic mb-3">&quot;Six Excel tabs, four WhatsApp groups, and I still had no idea who was about to quit.&quot;</p>
                  <p className="text-sm font-medium text-white">— Anjali K., Wellness Coach, Delhi</p>
                </div>
              </StaggerReveal>
            </div>

            {/* Right — After */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-px bg-green-500/50" />
                <span className="text-green-500 font-bold tracking-widest uppercase text-sm">After Fitosys</span>
                <div className="flex-1 h-px bg-green-500/20" />
              </div>
              <StaggerReveal stagger={0.1}>
                <div className="flex gap-4 items-start bg-green-500/5 border border-green-500/10 rounded-xl p-5 hover:bg-green-500/10 transition-colors">
                  <CheckCircle className="h-6 w-6 text-green-500 shrink-0 mt-0.5" />
                  <p className="text-white">Sunday evenings are free again. Check-ins go out at 7 PM without touching the phone.</p>
                </div>
                <div className="flex gap-4 items-start bg-green-500/5 border border-green-500/10 rounded-xl p-5 hover:bg-green-500/10 transition-colors">
                  <RefreshCw className="h-6 w-6 text-green-500 shrink-0 mt-0.5" />
                  <p className="text-white">3 renewals recovered in month one that would have been forgotten.</p>
                </div>
                <div className="flex gap-4 items-start bg-green-500/5 border border-green-500/10 rounded-xl p-5 hover:bg-green-500/10 transition-colors">
                  <Brain className="h-6 w-6 text-green-500 shrink-0 mt-0.5" />
                  <p className="text-white">Knows exactly which 2 clients to call every Monday. The AI tells them before they ask.</p>
                </div>
              </StaggerReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: How It Actually Works */}
      <section className="py-24 bg-[#111111] relative">
        <div className="max-w-4xl mx-auto px-4">
          <ScrollReveal className="text-center mb-16">
            <span className="text-[#A0A0A0] text-sm font-bold tracking-widest uppercase block mb-4">THREE THINGS. FULLY AUTOMATED.</span>
            <h2 className="text-3xl md:text-5xl font-black text-white">
              Set it up once. It runs while you coach.
            </h2>
          </ScrollReveal>

          <div className="space-y-12 relative">
            {/* Connecting line for desktop */}
            <div className="absolute left-[2.25rem] top-10 bottom-10 w-0.5 bg-gradient-to-b from-[#E8001D] to-[#E8001D]/10 hidden md:block" />

            {/* Step 1 */}
            <ScrollReveal className="relative flex flex-col md:flex-row gap-6 md:gap-8 items-start">
              <div className="w-16 h-16 rounded-full bg-[#E8001D]/20 border-2 border-[#E8001D] text-[#E8001D] flex items-center justify-center text-2xl font-black shrink-0 relative z-10 mx-auto md:mx-0 shadow-[0_0_15px_rgba(232,0,29,0.3)]">
                01
              </div>
              <div className="bg-[#0A0A0A] border border-[#222222] rounded-2xl p-8 flex-1">
                <h3 className="text-2xl font-bold text-white mb-3">Your clients pay and onboard in one link</h3>
                <p className="text-[#A0A0A0] text-lg leading-relaxed">
                  Share your personal Fitosys link anywhere — WhatsApp, Instagram, email. Your client fills one form, picks a program, pays. They appear in your dashboard in 2 minutes. You did nothing.
                </p>
              </div>
            </ScrollReveal>

            {/* Step 2 */}
            <ScrollReveal className="relative flex flex-col md:flex-row gap-6 md:gap-8 items-start">
              <div className="w-16 h-16 rounded-full bg-[#E8001D]/20 border-2 border-[#E8001D] text-[#E8001D] flex items-center justify-center text-2xl font-black shrink-0 relative z-10 mx-auto md:mx-0 shadow-[0_0_15px_rgba(232,0,29,0.3)]">
                02
              </div>
              <div className="bg-[#0A0A0A] border border-[#222222] rounded-2xl p-8 flex-1">
                <h3 className="text-2xl font-bold text-white mb-3">Every Sunday, your clients get a check-in. Automatically.</h3>
                <p className="text-[#A0A0A0] text-lg leading-relaxed">
                  A personalised WhatsApp goes out to every active client at 7 PM. They reply naturally — weight, sessions, energy, wins, struggles. Every Monday at 7 AM, the AI sends you a 150-word summary: who&apos;s struggling, who&apos;s thriving, who hasn&apos;t replied.
                </p>
              </div>
            </ScrollReveal>

            {/* Step 3 */}
            <ScrollReveal className="relative flex flex-col md:flex-row gap-6 md:gap-8 items-start">
              <div className="w-16 h-16 rounded-full bg-[#E8001D]/20 border-2 border-[#E8001D] text-[#E8001D] flex items-center justify-center text-2xl font-black shrink-0 relative z-10 mx-auto md:mx-0 shadow-[0_0_15px_rgba(232,0,29,0.3)]">
                03
              </div>
              <div className="bg-[#0A0A0A] border border-[#222222] rounded-2xl p-8 flex-1">
                <h3 className="text-2xl font-bold text-white mb-3">Renewals go out before you remember to send them</h3>
                <p className="text-[#A0A0A0] text-lg leading-relaxed">
                  7 days before a program ends, your client gets a personalised message with their progress stats and a payment link. No manual work. No forgotten follow-ups. Just a notification that ₹15,000 just renewed.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Section 5: The AI Difference */}
      <section className="py-24 bg-[#0A0A0A] border-y border-[#222222]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <ScrollReveal>
                <span className="text-blue-500 text-sm font-bold tracking-widest uppercase block mb-4 flex items-center gap-2">
                  <Brain className="h-4 w-4" /> POWERED BY AI
                </span>
                <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-6">
                  Your Monday morning used to be chaos. Now it&apos;s a briefing.
                </h2>
                <p className="text-[#A0A0A0] text-lg leading-relaxed mb-8">
                  Every Monday at 7 AM, before you open your first WhatsApp chat, Fitosys delivers your weekly coaching pulse. AI-generated. Data-driven. Under 2 minutes to read.
                </p>
                <Link href="/demo">
                  <Button variant="outline" className="text-blue-400 border-blue-500/30 hover:bg-blue-500/10 rounded-full">
                    See What Your Monday Summary Looks Like <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </ScrollReveal>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <StaggerReveal stagger={0.1}>
                {/* Card 1 */}
                <div className="bg-[#111111] border border-[#222222] p-6 rounded-2xl bg-gradient-to-br from-[#111111] to-[#111111] hover:to-blue-900/10 transition-colors">
                  <div className="h-10 w-10 bg-blue-500/20 text-blue-500 rounded-xl flex items-center justify-center mb-4">
                    <Activity className="h-5 w-5" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">Weekly Summary</h4>
                  <p className="text-sm text-[#A0A0A0]">Response rate, energy averages, clients needing attention — delivered to your WhatsApp before your first coffee.</p>
                </div>
                {/* Card 2 */}
                <div className="bg-[#111111] border border-[#222222] p-6 rounded-2xl bg-gradient-to-br from-[#111111] to-[#111111] hover:to-red-900/10 transition-colors mt-0 sm:mt-8">
                  <div className="h-10 w-10 bg-red-500/20 text-red-500 rounded-xl flex items-center justify-center mb-4">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">Client Risk Score</h4>
                  <p className="text-sm text-[#A0A0A0]">Fitosys flags clients showing early churn signals — dropping energy, missed sessions, no replies — before they leave.</p>
                </div>
                {/* Card 3 */}
                <div className="bg-[#111111] border border-[#222222] p-6 rounded-2xl bg-gradient-to-br from-[#111111] to-[#111111] hover:to-purple-900/10 transition-colors">
                  <div className="h-10 w-10 bg-purple-500/20 text-purple-500 rounded-xl flex items-center justify-center mb-4">
                    <MessageCircle className="h-5 w-5" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">Personalised Renewals</h4>
                  <p className="text-sm text-[#A0A0A0]">Every renewal message is written by AI using the client&apos;s actual stats. Not a template. A message that feels personal.</p>
                </div>
                {/* Card 4 */}
                <div className="bg-[#111111] border border-[#222222] p-6 rounded-2xl bg-gradient-to-br from-[#111111] to-[#111111] hover:to-green-900/10 transition-colors sm:mt-8">
                  <div className="h-10 w-10 bg-green-500/20 text-green-500 rounded-xl flex items-center justify-center mb-4">
                    <BarChart3 className="h-5 w-5" />
                  </div>
                  <h4 className="text-lg font-bold text-white mb-2">Business Insights</h4>
                  <p className="text-sm text-[#A0A0A0]">Monthly pattern analysis. Which programs retain best. Which clients are most at risk. One clear action for you to take.</p>
                </div>
              </StaggerReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Section 6: Who This Is For */}
      <section className="py-24 bg-[#111111]">
        <div className="max-w-6xl mx-auto px-4">
          <ScrollReveal className="text-center mb-16">
            <span className="text-[#A0A0A0] text-sm font-bold tracking-widest uppercase block mb-4">BUILT FOR COACHES LIKE YOU</span>
            <h2 className="text-3xl md:text-5xl font-black text-white max-w-2xl mx-auto">
              If you manage more than 15 clients on WhatsApp, this is for you.
            </h2>
          </ScrollReveal>

          <StaggerReveal className="grid md:grid-cols-3 gap-6 mb-16" stagger={0.15}>
            <div className="bg-[#0A0A0A] border border-[#222222] rounded-2xl p-8 hover:border-[#E8001D]/30 transition-colors">
              <Award className="h-8 w-8 text-[#E8001D] mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Fitness Coaches</h3>
              <p className="text-[#A0A0A0]">Managing 20–40 clients. Running transformation programs. Tired of chasing renewals and copy-pasting check-in messages every Sunday.</p>
            </div>
            <div className="bg-[#0A0A0A] border border-[#222222] rounded-2xl p-8 hover:border-[#E8001D]/30 transition-colors">
              <Heart className="h-8 w-8 text-[#E8001D] mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Yoga Instructors</h3>
              <p className="text-[#A0A0A0]">Teaching individual and small group sessions. Building long-term client relationships. Need a system that matches your practice&apos;s energy — calm, intentional, not chaotic.</p>
            </div>
            <div className="bg-[#0A0A0A] border border-[#222222] rounded-2xl p-8 hover:border-[#E8001D]/30 transition-colors">
              <Brain className="h-8 w-8 text-[#E8001D] mb-4" />
              <h3 className="text-xl font-bold text-white mb-3">Wellness Coaches</h3>
              <p className="text-[#A0A0A0]">Working with mental, physical, and spiritual health. Your clients need consistent check-ins and accountability. Your tool should make that effortless, not add to your plate.</p>
            </div>
          </StaggerReveal>

          <ScrollReveal>
            <div className="bg-[#0A0A0A] p-6 rounded-2xl border border-[#222222] text-center max-w-3xl mx-auto">
              <p className="font-bold text-white mb-2">Not for you if:</p>
              <p className="text-[#A0A0A0] text-sm">You run a gym with 200+ members, need a booking calendar for classes, or want a complex enterprise platform. Fitosys is for the independent coach who wants one clean system, not ten complicated tools.</p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Section 7: Founder Credibility */}
      <section className="py-24 bg-[#0A0A0A] border-y border-[#222222]">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <ScrollReveal>
            <span className="text-[#A0A0A0] text-sm font-bold tracking-widest uppercase block mb-4">WHY WE BUILT THIS</span>
            <h2 className="text-3xl md:text-5xl font-black text-white leading-tight mb-8">
              We talked to 50 coaches. Every single one managed clients on WhatsApp.
            </h2>
            <p className="text-lg text-[#A0A0A0] leading-relaxed mb-6">
              Not because they wanted to. Because nothing existed that was simple enough, affordable enough, and actually designed for how coaches work in India — on their phones, on WhatsApp, between sessions.
            </p>
            <p className="text-lg text-[#A0A0A0] leading-relaxed mb-10">
              Fitosys is built by Alchemetryx, a team that builds practical tools for real businesses. We are not a VC-funded startup promising to disrupt everything. We are builders who saw a clear problem and built the simplest possible solution.
            </p>
            {/* Note: Placeholder for a real founder/team image as requested */}
            <div className="w-24 h-24 rounded-full border-4 border-[#111111] bg-[#222222] mx-auto overflow-hidden shadow-xl mb-4">
              <div className="w-full h-full bg-gradient-to-tr from-[#333] to-[#555] flex items-center justify-center">
                <Users className="text-[#888] h-10 w-10" />
              </div>
            </div>
            <p className="text-sm font-bold text-white">
              Created by <a href="https://alchemetryx.com" target="_blank" rel="noopener noreferrer" className="hover:underline text-white">Alchemetryx</a>
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Section 8: Pricing */}
      <section className="py-24 bg-[#111111]" id="pricing">
        <div className="max-w-6xl mx-auto px-4">
          <ScrollReveal className="text-center mb-16">
            <span className="text-[#A0A0A0] text-sm font-bold tracking-widest uppercase block mb-4">SIMPLE PRICING</span>
            <h2 className="text-3xl md:text-5xl font-black text-white">
              One plan. Everything included. No surprises.
            </h2>
          </ScrollReveal>

          <ScrollReveal className="max-w-md mx-auto">
            <Card className="border-[#E8001D] ring-2 ring-[#E8001D] shadow-[0_0_30px_rgba(232,0,29,0.15)] bg-[#0A0A0A] rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 right-[-40px] bg-[#E8001D] text-white text-xs font-bold py-1.5 px-10 rotate-45 transform origin-bottom border-y border-[#E8001D]">
                ALL INCLUSIVE
              </div>
              <CardContent className="p-8">
                <p className="text-xl font-bold text-white mb-2">Fitosys Basic</p>
                <div className="flex items-baseline mb-2">
                  <span className="text-5xl font-black text-white tracking-tight">₹1,499</span>
                  <span className="text-[#A0A0A0] ml-2">/month</span>
                </div>
                <p className="text-sm text-[#A0A0A0] mb-8 pb-8 border-b border-[#222222]">
                  £11/month · $14/month
                </p>

                <ul className="space-y-4 mb-8">
                  {[
                    "Client onboarding with payment link",
                    "Weekly WhatsApp check-ins — automated",
                    "AI Monday summary",
                    "Client risk scoring",
                    "Renewal reminders with personalised messages",
                    "Coach dashboard",
                    "Unlimited active clients"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-[#E8001D] shrink-0" />
                      <span className="text-white text-sm">{item}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/signup">
                  <Button className="w-full h-14 bg-[#E8001D] hover:bg-[#9E0014] text-white rounded-full text-base font-bold shadow-lg shadow-[#E8001D]/20">
                    Start Free for 14 Days
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <div className="mt-8 space-y-3 text-center">
              <p className="flex items-center justify-center gap-2 text-sm text-[#A0A0A0]">
                <CreditCard className="h-4 w-4" /> No credit card needed to start
              </p>
              <p className="flex items-center justify-center gap-2 text-sm text-[#A0A0A0]">
                <Zap className="h-4 w-4" /> Up and running in 15 minutes
              </p>
              <p className="flex items-center justify-center gap-2 text-sm text-[#A0A0A0]">
                <ShieldCheck className="h-4 w-4" /> If it doesn&apos;t recover one renewal in your first month, we will refund you in full
              </p>
            </div>

            <div className="mt-8 bg-[#1A0003] border border-[#E8001D]/20 p-4 rounded-xl text-center">
              <p className="text-[#A0A0A0] text-sm">
                One recovered renewal pays for 2 months of Fitosys. The average coach recovers 3 in their first month.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Section 9: Final CTA */}
      <section className="py-28 bg-[#E8001D] relative overflow-hidden">
        {/* Abstract pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle, #fff 2px, transparent 2px)", backgroundSize: "40px 40px" }} />
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            Your clients chose you because you show up for them.
          </h2>
          <p className="text-xl md:text-2xl text-white/90 font-medium mb-6">
            Now build a system that shows up for you.
          </p>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-10">
            Fitosys is currently onboarding the first 25 beta coaches. Free for 30 days. No complicated setup. Full support from our team.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link href="/signup">
              <Button size="lg" className="h-16 px-10 rounded-full bg-white text-[#E8001D] hover:bg-slate-100 font-bold text-lg shadow-xl shrink-0 w-full sm:w-auto">
                Claim Your Beta Spot
              </Button>
            </Link>
            <a href="mailto:fitosys@alchemetryx.com">
              <Button variant="outline" size="lg" className="h-16 px-8 rounded-full border-white text-[#000000] hover:bg-white/10 hover:text-white font-medium w-full sm:w-auto mt-4 sm:mt-0 bg-[#ffffff]">
                Talk to the Team First <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </a>
          </div>
          <div className="inline-flex items-center gap-2 bg-black/20 px-4 py-2 rounded-full border border-white/20">
            <div className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />
            <p className="text-sm font-bold text-white tracking-widest uppercase">19 of 25 beta spots remaining</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#222222] bg-[#0A0A0A] py-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-[#A0A0A0]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white" style={{ textTransform: 'none' }}>
              <span className="text-[#E8001D]">Fito</span>sys
            </span>
            <span>· Business OS for Fitness Coaches</span>
          </div>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy
            </Link>
            <a
              href="mailto:fitosys@alchemetryx.com"
              className="hover:text-white transition-colors"
            >
              Contact
            </a>
          </div>
          <p>© 2026 Alchemetryx. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
