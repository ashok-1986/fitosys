"use client";

import { useReveal } from "@/hooks/useReveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { KineticText } from "@/components/ui/KineticText";

import { CreditCard, FileText, Bot, BarChart2, Bell, Zap } from "lucide-react";

const NEW_FEATURES = [
    {
        num: "01",
        title: "ONBOARDING IN ONE LINK.",
        description: "Share one link. Clients select programs and pay via UPI/Card. They get an automatic WhatsApp welcome. Zero friction.",
        badge: "WHATSAPP NATIVE",
        subFeatures: [
            { icon: CreditCard, text: "Razorpay Ready" },
            { icon: FileText, text: "Auto Invoices" }
        ],
        badgeColor: "bg-[rgba(37,211,102,0.1)] text-[#25D366]",
    },
    {
        num: "02",
        title: "CHECK-INS WITHOUT LIFTING A FINGER.",
        description: "Automated check-ins fire every Sunday. On Monday, get a 2-minute AI summary highlighting exactly who needs attention.",
        badge: "WHATSAPP NATIVE",
        subFeatures: [
            { icon: Bot, text: "Fitosys AI" },
            { icon: BarChart2, text: "Response Tracking" }
        ],
        badgeColor: "bg-[rgba(37,211,102,0.1)] text-[#25D366]",
    },
    {
        num: "03",
        title: "NEVER LOSE A RENEWAL AGAIN.",
        description: "Personalised reminders fire 7 days before expiry, with an auto follow-up if ignored. Payments auto-generate GST invoices.",
        badge: "WHATSAPP NATIVE",
        subFeatures: [
            { icon: Bell, text: "T-7 Automations" },
            { icon: Zap, text: "Real-time sync" }
        ],
        badgeColor: "bg-[rgba(37,211,102,0.1)] text-[#25D366]",
    },
];

export function FeaturesSection() {
    const headingRef = useReveal<HTMLHeadingElement>(0);
    const textRef = useReveal<HTMLParagraphElement>(100);
    const cardRefs = [
        useReveal<HTMLDivElement>(0),
        useReveal<HTMLDivElement>(100),
        useReveal<HTMLDivElement>(200)
    ];

    return (
        <section id="features">
            <div className="max-w-[1400px] mx-auto px-4 md:px-12 py-32 lg:py-40">
                <div className="grid lg:grid-cols-2 gap-12 mb-16 items-end">
                    <div>
                        <Eyebrow label="CORE FEATURES" />
                        <h2 ref={headingRef} className="reveal-on-scroll font-display font-medium text-[36px] md:text-[44px] lg:text-[56px] leading-none tracking-[0.02em] uppercase text-white mt-6">
                            <span className="block">THREE THINGS.</span>
                            <span className="block text-[#E8001D]">ZERO MANUAL WORK.</span>
                        </h2>
                    </div>
                    <p ref={textRef} className="reveal-on-scroll font-sans text-[20px] text-[var(--grey)] leading-[1.7] self-end max-w-[500px]">
                        Fitosys does exactly three things — the three that drain the most time and cost the most revenue. Nothing more. Nothing less.
                    </p>
                </div>

                {/* Feature Grid — 3 columns */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {NEW_FEATURES.map((f, i) => {
                        return (
                            <div key={i} ref={cardRefs[i]} className="reveal-on-scroll bg-[var(--surface)] border border-[var(--border)] rounded-2xl p-10 flex flex-col relative overflow-hidden group transition-colors hover:bg-[var(--surface2)]">
                                {/* Hover top line */}
                                <div className="absolute top-0 left-0 right-0 h-[2px] bg-[var(--red)] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

                                <div className="font-display font-medium text-[72px] leading-none text-[rgba(232,0,29,0.06)] mb-6 group-hover:text-[rgba(232,0,29,0.12)] transition-colors">
                                    {f.num}
                                </div>
                                <h4 className="font-display font-medium text-[28px] md:text-[32px] leading-[1.1] tracking-[0.02em] uppercase text-white mb-4">
                                    {f.title}
                                </h4>
                                <div className="mb-6">
                                    <span className={`inline-block font-sans font-bold text-[10px] uppercase tracking-[0.1em] px-3 py-1.5 rounded-[4px] ${f.badgeColor}`}>
                                        {f.badge}
                                    </span>
                                </div>
                                <p className="font-sans text-[16px] text-[var(--grey)] leading-[1.7] mb-8 flex-grow">
                                    {f.description}
                                </p>
                                <div className="pt-6 border-t border-[var(--border)] mt-auto flex flex-wrap gap-2.5">
                                    {f.subFeatures.map((sf, idx) => {
                                        const Icon = sf.icon;
                                        return (
                                            <div key={idx} className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-md">
                                                <Icon className="w-3.5 h-3.5 text-[var(--t2)]" />
                                                <span className="font-sans text-[11px] font-semibold text-[var(--t2)] uppercase tracking-[0.05em]">
                                                    {sf.text}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
