"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  ArrowRight,
  Users,
  MessageCircle,
  RefreshCw,
  CheckCircle,
  Zap,
  Clock,
  Star,
  Smartphone,
  Brain,
  Bell,
  MessageSquare,
  CalendarX,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ScrollReveal,
  StaggerReveal,
  CountUp,
  ImageReveal,
} from "@/components/gsap-provider";

gsap.registerPlugin(ScrollTrigger);

/* ── Data ─────────────────────────────────────────────── */

const FEATURES = [
  {
    icon: Users,
    illustrationIcon: Smartphone,
    title: "Client Onboarding",
    description:
      "One link, one form, one payment. New clients onboard themselves in under 5 minutes.",
    highlights: [
      "Shareable onboarding link",
      "Razorpay-powered payments",
      "Instant WhatsApp confirmation",
    ],
    image: "/images/feature-onboarding.svg",
  },
  {
    icon: MessageCircle,
    illustrationIcon: Brain,
    title: "Weekly Check-ins",
    description:
      "Automated WhatsApp check-ins with AI-powered summaries delivered to you every Monday.",
    highlights: [
      "4-question structured check-in",
      "Gemini AI weekly summaries",
      "Non-responder alerts",
    ],
    image: "/images/feature-checkins.svg",
  },
  {
    icon: RefreshCw,
    illustrationIcon: Bell,
    title: "Renewal Reminders",
    description:
      "Never lose a client to a forgotten follow-up. Automated renewal reminders with one-tap payment.",
    highlights: [
      "7-day advance reminders",
      "Progress-based messaging",
      "One-tap renewal links",
    ],
    image: "/images/feature-renewals.svg",
  },
];

const PRICING = [
  { region: "India", price: "₹1,499", period: "/month", popular: true },
  { region: "UK", price: "£11", period: "/month", popular: false },
  { region: "USA / Canada", price: "$14", period: "/month", popular: false },
];

const TESTIMONIALS = [
  {
    name: "Priya S.",
    role: "Fitness Coach, Mumbai",
    text: "I went from spending 4 hours every Sunday on admin to zero. Fitosys handles everything while I focus on coaching.",
    rating: 5,
  },
  {
    name: "Rahul K.",
    role: "Yoga Instructor, Delhi",
    text: "The AI weekly summaries are magic. I know exactly which clients need my attention before Monday morning tea.",
    rating: 5,
  },
  {
    name: "Sarah M.",
    role: "Wellness Coach, London",
    text: "My clients love the professional onboarding flow. It elevated my brand perception from day one.",
    rating: 5,
  },
];

/* ── Feature Illustration Component ───────────────────── */

function FeatureIllustration({
  feature,
  index,
}: {
  feature: (typeof FEATURES)[0];
  index: number;
}) {
  const colors = [
    { bg: "#1A0003", accent: "#E8001D", ring: "#3D0008" },
    { bg: "#021A0E", accent: "#16A34A", ring: "#04331C" },
    { bg: "#1A1200", accent: "#D97706", ring: "#332400" },
  ];
  const c = colors[index % 3];

  return (
    <div className="relative w-full h-48 flex items-center justify-center mb-6 rounded-xl overflow-hidden" style={{ background: c.bg }}>
      <div
        className="absolute w-32 h-32 rounded-full opacity-30"
        style={{ background: c.ring, top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
      />
      <div
        className="relative z-10 h-16 w-16 rounded-2xl flex items-center justify-center shadow-lg"
        style={{ background: c.accent }}
      >
        <feature.illustrationIcon className="h-8 w-8 text-white" />
      </div>
      {/* Decorative dots */}
      <div className="absolute top-4 right-4 grid grid-cols-3 gap-1">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="h-1.5 w-1.5 rounded-full opacity-30" style={{ background: c.accent }} />
        ))}
      </div>
      <div className="absolute bottom-4 left-4 flex gap-1">
        <div className="h-2 w-8 rounded-full opacity-40" style={{ background: c.accent }} />
        <div className="h-2 w-4 rounded-full opacity-25" style={{ background: c.accent }} />
      </div>
    </div>
  );
}

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
    <div className="min-h-screen bg-background">
      {/* Navigation — transparent over dark hero */}
      <nav className="absolute top-0 left-0 right-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <h1 className="text-xl font-bold tracking-tight" style={{ textTransform: 'none' }}>
              <span className="text-[#E8001D]">Fito</span>
              <span className="text-white">sys</span>
            </h1>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-[#A0A0A0] hover:text-white hover:bg-white/10">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                size="sm"
                className="bg-[#E8001D] hover:bg-[#9E0014] text-white"
              >
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero — "The Inbox That Never Sleeps" */}
      <section ref={heroRef} className="relative overflow-hidden" style={{ background: "#0A0A0A" }}>
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

        <div className="relative max-w-6xl mx-auto px-4 pt-28 pb-20 md:pt-32 md:pb-28">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left — Copy */}
            <div className="text-left">
              <div
                data-hero-badge
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E8001D]/10 border border-[#E8001D]/20 text-[#E8001D] text-sm font-medium mb-6"
              >
                <Zap className="h-3.5 w-3.5" />
                For fitness · wellness · yoga coaches
              </div>

              <h1
                data-hero-title
                className="text-4xl md:text-[56px] font-bold leading-[1.05] text-white tracking-tight"
              >
                Your clients are active.{" "}
                <span className="text-[#A0A0A0]">Your admin shouldn&apos;t be.</span>
              </h1>

              <p
                data-hero-desc
                className="text-lg text-[#A0A0A0] mt-6 max-w-lg leading-relaxed" style={{ textTransform: 'none', fontFamily: 'var(--font-sans)', letterSpacing: 'normal' }}
              >
                Fitosys automates your check-ins, renewals, and client tracking — so you spend your energy coaching, not chasing.
              </p>

              <div
                data-hero-cta
                className="flex flex-col sm:flex-row items-start gap-3 mt-8"
              >
                <Link href="/signup">
                  <Button
                    size="lg"
                    className="bg-[#E8001D] hover:bg-[#9E0014] text-white px-8 h-12 text-base font-semibold shadow-lg shadow-[#E8001D]/20"
                  >
                    Start Free Trial
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button
                    variant="outline"
                    size="lg"
                    className="h-12 text-base border-[#222222] text-[#A0A0A0] hover:bg-white/5 hover:text-white hover:border-[#A0A0A0]"
                  >
                    See How It Works
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>

              <p
                data-hero-proof
                className="text-sm text-[#A0A0A0]/60 mt-6" style={{ textTransform: 'none', fontFamily: 'var(--font-sans)', letterSpacing: 'normal' }}
              >
                Trusted by coaches in{" "}
                <span className="text-[#A0A0A0]">Mumbai</span> ·{" "}
                <span className="text-[#A0A0A0]">London</span> ·{" "}
                <span className="text-[#A0A0A0]">Toronto</span>
              </p>
            </div>

            {/* Right — WhatsApp Mockup */}
            <div className="flex justify-center lg:justify-end">
              <WhatsAppMockup />
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: The Problem Banner */}
      <section style={{ background: "#111111" }} className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-20 md:py-28">
          {/* Header */}
          <ScrollReveal className="text-center mb-12">
            <div className="inline-flex items-center justify-center px-4 py-1.5 mb-5 rounded-full bg-[#E8001D]/10 text-[#E8001D] text-xs font-bold uppercase tracking-wider">
              The Reality Check
            </div>
            <h2 className="text-3xl md:text-5xl font-black leading-tight tracking-tight text-white mb-4">
              Every Sunday evening, you&apos;re doing this manually.
            </h2>
            <p className="text-lg text-[#A0A0A0] leading-relaxed max-w-2xl mx-auto" style={{ textTransform: 'none', fontFamily: 'var(--font-sans)', letterSpacing: 'normal' }}>
              You didn&apos;t become a coach to spend your weekends buried in spreadsheets.
            </p>
          </ScrollReveal>

          {/* The Sunday Dread */}
          <div className="max-w-4xl mx-auto">
            <ScrollReveal className="flex flex-col gap-2 mb-8">
              <h3 className="text-2xl font-bold text-[#E8001D]">
                The Sunday Dread
              </h3>
              <div className="h-1 w-12 bg-[#E8001D] rounded-full" />
            </ScrollReveal>

            {/* Problem Tiles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Tile 1 — WhatsApp Scroll Fatigue */}
              <ScrollReveal>
                <div className="group relative flex flex-col gap-3 rounded-xl border border-[#222222] bg-[#0A0A0A] p-5 shadow-sm transition-all hover:shadow-md hover:border-[#E8001D]/40">
                  <div className="absolute right-4 top-4 opacity-10">
                    <MessageCircle className="h-14 w-14 text-[#E8001D]" />
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full text-[#E8001D]" style={{ background: "#1A0003" }}>
                    <MessageSquare className="h-6 w-6" />
                  </div>
                  <div className="relative z-10 flex flex-col gap-1">
                    <h4 className="text-lg font-bold leading-tight text-white">
                      Sending 30 check-in messages by hand
                    </h4>
                    <p className="text-sm font-medium text-[#A0A0A0]" style={{ textTransform: 'none', fontFamily: 'var(--font-sans)', letterSpacing: 'normal' }}>
                      WhatsApp Scroll Fatigue
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              {/* Tile 2 — Revenue Leaks */}
              <ScrollReveal>
                <div className="group relative flex flex-col gap-3 rounded-xl border border-[#222222] bg-[#0A0A0A] p-5 shadow-sm transition-all hover:shadow-md hover:border-[#E8001D]/40">
                  <div className="absolute right-4 top-4 opacity-10">
                    <CalendarX className="h-14 w-14 text-[#E8001D]" />
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full text-[#E8001D]" style={{ background: "#1A0003" }}>
                    <CalendarX className="h-6 w-6" />
                  </div>
                  <div className="relative z-10 flex flex-col gap-1">
                    <h4 className="text-lg font-bold leading-tight text-white">
                      Missing renewals you didn&apos;t even know expired
                    </h4>
                    <p className="text-sm font-medium text-[#A0A0A0]" style={{ textTransform: 'none', fontFamily: 'var(--font-sans)', letterSpacing: 'normal' }}>
                      Revenue Leaks
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              {/* Tile 3 — Client Churn */}
              <ScrollReveal>
                <div className="group relative flex flex-col gap-3 rounded-xl border border-[#222222] bg-[#0A0A0A] p-5 shadow-sm transition-all hover:shadow-md hover:border-[#E8001D]/40">
                  <div className="absolute right-4 top-4 opacity-10">
                    <Users className="h-14 w-14 text-[#E8001D]" />
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-full text-[#E8001D]" style={{ background: "#1A0003" }}>
                    <HelpCircle className="h-6 w-6" />
                  </div>
                  <div className="relative z-10 flex flex-col gap-1">
                    <h4 className="text-lg font-bold leading-tight text-white">
                      No idea who&apos;s struggling until it&apos;s too late
                    </h4>
                    <p className="text-sm font-medium text-[#A0A0A0]" style={{ textTransform: 'none', fontFamily: 'var(--font-sans)', letterSpacing: 'normal' }}>
                      Client Churn
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Revenue Loss Stat Card */}
            <ScrollReveal className="mt-8">
              <div className="relative overflow-hidden rounded-xl border border-[#E8001D]/20 shadow-xl bg-[#0A0A0A]">
                <div className="relative p-8 text-center">
                  {/* Decorative glows */}
                  <div className="absolute -top-10 -left-10 h-32 w-32 rounded-full bg-[#E8001D] blur-3xl opacity-20" />
                  <div className="absolute -bottom-10 -right-10 h-32 w-32 rounded-full bg-[#E8001D] blur-3xl opacity-20" />
                  <p className="relative text-sm font-medium text-[#A0A0A0] mb-2" style={{ textTransform: 'none', fontFamily: 'var(--font-sans)', letterSpacing: 'normal' }}>
                    Annual Revenue Lost to Admin Gaps
                  </p>
                  <p className="relative text-5xl md:text-6xl font-black text-[#E8001D] tracking-tight">
                    ₹72,000
                  </p>
                  <p className="relative mt-2 text-xs text-[#A0A0A0]" style={{ textTransform: 'none', fontFamily: 'var(--font-sans)', letterSpacing: 'normal' }}>
                    Based on average coach data
                  </p>
                </div>
                <Link href="/signup">
                  <div className="bg-[#E8001D]/20 p-3.5 text-center cursor-pointer hover:bg-[#E8001D]/30 transition-colors">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#E8001D]">Stop the bleed</span>
                  </div>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="border-y border-border bg-card">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <StaggerReveal className="flex flex-wrap items-center justify-center gap-8 md:gap-16 text-sm text-muted-foreground" stagger={0.1}>
            <div className="text-center">
              <span className="block text-2xl font-bold text-foreground">
                <CountUp end={500} suffix="+" />
              </span>
              Coaches
            </div>
            <div className="text-center">
              <span className="block text-2xl font-bold text-foreground">
                <CountUp end={12000} suffix="+" />
              </span>
              Clients Managed
            </div>
            <div className="text-center">
              <span className="block text-2xl font-bold text-foreground">
                <CountUp end={24} prefix="₹" suffix="L+" duration={2.5} />
              </span>
              Revenue Tracked
            </div>
            <div className="text-center">
              <span className="block text-2xl font-bold text-foreground">
                <CountUp end={82} suffix="%" />
              </span>
              Avg Check-in Rate
            </div>
          </StaggerReveal>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 md:py-28">
        <div className="max-w-6xl mx-auto px-4">
          <ScrollReveal className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Three automations. Zero admin work.
            </h2>
            <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
              Fitosys replaces WhatsApp groups, Excel sheets, and memory with
              one automated system.
            </p>
          </ScrollReveal>

          <StaggerReveal className="grid md:grid-cols-3 gap-8" stagger={0.2}>
            {FEATURES.map((feature, i) => (
              <Card
                key={feature.title}
                className="group hover:shadow-xl transition-all duration-300 border-border/50 hover:border-brand/20 overflow-hidden"
              >
                <CardContent className="p-6">
                  <FeatureIllustration feature={feature} index={i} />
                  <div className="h-12 w-12 rounded-xl bg-brand/10 text-brand flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {feature.description}
                  </p>
                  <ul className="space-y-2">
                    {feature.highlights.map((h) => (
                      <li
                        key={h}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <CheckCircle className="h-3.5 w-3.5 text-success shrink-0" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-card border-y border-border">
        <div className="max-w-6xl mx-auto px-4">
          <ScrollReveal className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">
              Set up in 10 minutes
            </h2>
          </ScrollReveal>
          <StaggerReveal className="grid md:grid-cols-3 gap-8 max-w-3xl mx-auto" stagger={0.2}>
            {[
              {
                step: "01",
                title: "Create your programs",
                desc: "Set name, duration, price. Takes 2 minutes.",
              },
              {
                step: "02",
                title: "Share your link",
                desc: "Clients onboard and pay themselves.",
              },
              {
                step: "03",
                title: "Coach. That's it.",
                desc: "Check-ins, summaries, renewals — all automated.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="h-14 w-14 rounded-full bg-brand text-white flex items-center justify-center text-lg font-bold mx-auto mb-4 shadow-lg shadow-brand/20">
                  {item.step}
                </div>
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {item.desc}
                </p>
              </div>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <ScrollReveal className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">
              Trusted by coaches
            </h2>
          </ScrollReveal>
          <StaggerReveal className="grid md:grid-cols-3 gap-6" stagger={0.15}>
            {TESTIMONIALS.map((t) => (
              <Card key={t.name} className="border-border/50 hover:shadow-lg transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-warning text-warning"
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground italic mb-4">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-brand/10 text-brand flex items-center justify-center text-xs font-bold">
                      {t.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-card border-y border-border" id="pricing">
        <div className="max-w-6xl mx-auto px-4">
          <ScrollReveal className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Simple pricing</h2>
            <p className="text-muted-foreground mt-2">
              One plan. Everything included. Pays for itself with one saved client.
            </p>
          </ScrollReveal>
          <StaggerReveal className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto" stagger={0.15}>
            {PRICING.map((p) => (
              <Card
                key={p.region}
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${p.popular
                  ? "border-brand ring-1 ring-brand"
                  : "border-border/50"
                  }`}
              >
                {p.popular && (
                  <div className="absolute top-0 left-0 w-full h-1 bg-brand" />
                )}
                <CardContent className="p-6 text-center">
                  <p className="text-sm font-medium text-muted-foreground">
                    {p.region}
                  </p>
                  <div className="flex items-baseline justify-center mt-3">
                    <span className="text-4xl font-bold">{p.price}</span>
                    <span className="text-muted-foreground ml-1">
                      {p.period}
                    </span>
                  </div>
                  <Link href="/signup">
                    <Button
                      className={`w-full mt-6 ${p.popular
                        ? "bg-brand hover:bg-brand/90 text-white"
                        : ""
                        }`}
                      variant={p.popular ? "default" : "outline"}
                    >
                      Get Started
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </StaggerReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-28">
        <ScrollReveal className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">
            Stop losing clients to admin gaps
          </h2>
          <p className="text-muted-foreground mt-4 text-lg">
            Join 500+ coaches who automated their business with Fitosys.
          </p>
          <Link href="/signup">
            <Button
              size="lg"
              className="mt-8 bg-brand hover:bg-brand/90 text-white px-10 h-12 text-base"
            >
              <Clock className="h-4 w-4 mr-2" />
              Start Your Free Trial
            </Button>
          </Link>
        </ScrollReveal>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-10">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground" style={{ textTransform: 'none' }}>
              <span className="text-brand">Fito</span>sys
            </span>
            <span>· Business OS for Fitness Coaches</span>
          </div>
          <div className="flex gap-6">
            <Link href="/terms" className="hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">
              Privacy
            </Link>
            <a
              href="mailto:hello@fitosys.com"
              className="hover:text-foreground transition-colors"
            >
              Contact
            </a>
          </div>
          <p>© 2026 Alchemetryx. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
