"use client";

import Link from "next/link";
import { KineticText } from "@/components/ui/KineticText";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { useReveal } from "@/hooks/useReveal";

export function CtaBanner() {
    const textRef1 = useReveal<HTMLParagraphElement>(0);
    const textRef2 = useReveal<HTMLParagraphElement>(100);

    const featureRefs = [
        useReveal<HTMLSpanElement>(0),
        useReveal<HTMLSpanElement>(100),
        useReveal<HTMLSpanElement>(200),
        useReveal<HTMLSpanElement>(300)
    ];

    return (
        <section className="relative z-[1] bg-[#E8001D] py-16 md:py-20 overflow-hidden">
            {/* SVG Grain Filter */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.25] pointer-events-none mix-blend-overlay z-0">
                <filter id="grain">
                    <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" />
                    <feColorMatrix type="matrix" values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 0.5 0" />
                </filter>
                <rect width="100%" height="100%" filter="url(#grain)" />
            </svg>
            {/* Grid pattern overlay */}
            <div className="absolute inset-0 pointer-events-none" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
            }} />

            <div className="max-w-[1400px] mx-auto px-8 md:px-12 py-20 md:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                {/* Left column — headline + body + stats */}
                <div>
                    <p ref={textRef1} className="reveal-on-scroll font-sans text-[13px] font-medium uppercase tracking-[0.08em] text-white/60 mb-8 flex items-center gap-3">
                        <span className="block w-10 h-px bg-white/40" />
                        THE SYSTEM BEHIND THE RESULT.
                    </p>
                    <h2 className="font-display font-medium uppercase tracking-[0.02em] leading-none text-[64px] md:text-[80px] mb-8">
                        <KineticText as="span" className="block text-white" text="STOP" delay={0} charDelay={40} />
                        <span className="block" style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.35)', color: 'transparent' }}>
                            <KineticText as="span" text="MANAGING." delay={160} charDelay={40} />
                        </span>
                        <KineticText as="span" className="block text-white" text="START" delay={520} charDelay={40} />
                        <span className="block" style={{ WebkitTextStroke: '1.5px rgba(255,255,255,0.35)', color: 'transparent' }}>
                            <KineticText as="span" text="COACHING." delay={680} charDelay={40} />
                        </span>
                    </h2>
                    <p ref={textRef2} className="reveal-on-scroll font-sans text-[15px] text-white/70 leading-[1.7] max-w-[480px]">
                        Fitosys automates client onboarding, weekly check-ins, and renewal reminders — natively on WhatsApp. Set up in 30 minutes. Runs on its own after that.
                    </p>

                    {/* Stat strip */}
                    <div className="flex gap-10 mt-10 pt-8 border-t border-white/20">
                        <div>
                            <p className="font-display font-medium text-[28px] text-white leading-none tracking-[0.02em]">
                                30<span className="text-[18px]">min</span>
                            </p>
                            <p className="font-sans text-[11px] uppercase tracking-[0.06em] text-white/50 mt-1">
                                Setup time
                            </p>
                        </div>
                        <div>
                            <p className="font-display font-medium text-[28px] text-white leading-none tracking-[0.02em]">
                                ₹999
                            </p>
                            <p className="font-sans text-[11px] uppercase tracking-[0.06em] text-white/50 mt-1">
                                Starts at / month
                            </p>
                        </div>
                        <div>
                            <p className="font-display font-medium text-[28px] text-white leading-none tracking-[0.02em]">
                                14<span className="text-[18px]">day</span>
                            </p>
                            <p className="font-sans text-[11px] uppercase tracking-[0.06em] text-white/50 mt-1">
                                Free trial
                            </p>
                        </div>
                        <div>
                            <p className="font-display font-medium text-[28px] text-white leading-none tracking-[0.02em]">
                                No
                            </p>
                            <p className="font-sans text-[11px] uppercase tracking-[0.06em] text-white/50 mt-1">
                                Card required
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right column — CTA */}
                <div className="flex flex-col items-start lg:items-end gap-4 w-full">
                    <p className="font-sans text-[11px] uppercase tracking-[0.1em] text-white/50">
                        GET STARTED TODAY
                    </p>
                    <MagneticButton radius={80} strength={0.3} className="w-full lg:max-w-[360px]">
                        <Link href="/signup" className="block w-full">
                            <button className="w-full px-10 py-5 bg-white text-[#E8001D] font-sans font-bold text-[13px] uppercase tracking-[0.06em] rounded-[2px] hover:bg-white/90 transition-colors flex items-center justify-center gap-3">
                                START FREE
                                <span className="text-[16px]">→</span>
                            </button>
                        </Link>
                    </MagneticButton>
                    <p className="font-sans text-[12px] text-white/50 text-center lg:text-right">
                        No credit card. No contract. Cancel any time.
                    </p>
                    <div className="flex flex-wrap justify-center lg:justify-end gap-2 mt-4 font-sans text-[11px] uppercase tracking-[0.1em] text-[rgba(255,255,255,0.45)] w-full">
                        {['DPDP Compliant', 'GST Invoices Auto-Generated', 'Data Stored in India', 'Secured by Razorpay'].map((item, i) => (
                            <span key={i} ref={featureRefs[i]} className="reveal-on-scroll flex items-center gap-2">
                                {item}
                                {i !== 3 && <span className="opacity-50">&middot;</span>}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
