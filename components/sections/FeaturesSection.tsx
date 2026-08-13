"use client";

import { useReveal } from "@/hooks/useReveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { KineticText } from "@/components/ui/KineticText";

import { CreditCard, FileText, Bot, BarChart2, Bell, Zap } from "lucide-react";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const NEW_FEATURES = [
    {
        num: "01",
        title: "ONBOARDING IN ONE LINK.",
        shortTitle: "ONBOARDING",
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
        shortTitle: "CHECK-INS",
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
        shortTitle: "RENEWALS",
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
    const [activeTab, setActiveTab] = useState(0);

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
                    <p ref={textRef} className="reveal-on-scroll font-sans text-lg text-[var(--grey)] leading-[1.7] self-end max-w-[500px]">
                        Fitosys does exactly three things — the three that drain the most time and cost the most revenue. Nothing more. Nothing less.
                    </p>
                </div>

                {/* Tabbed Interface */}
                <div className="grid lg:grid-cols-[300px_1fr] gap-8 lg:gap-16">
                    {/* Tabs on Left */}
                    <div className="flex flex-col gap-2">
                        {NEW_FEATURES.map((f, i) => {
                            const isActive = activeTab === i;
                            return (
                                <button
                                    key={i}
                                    onClick={() => setActiveTab(i)}
                                    className={`relative text-left px-6 py-5 rounded-xl transition-all duration-300 ${isActive ? 'bg-white/5 text-white' : 'text-white/40 hover:text-white/80 hover:bg-white/5'}`}
                                >
                                    {isActive && (
                                        <motion.div 
                                            layoutId="activeTabIndicator"
                                            className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--red)] rounded-l-xl"
                                        />
                                    )}
                                    <div className="font-display text-xs font-semibold tracking-[0.15em] uppercase mb-1 opacity-60">
                                        FEATURE {f.num}
                                    </div>
                                    <div className="font-display font-medium text-xl leading-tight">
                                        {f.shortTitle}
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* Active Content on Right */}
                    <div className="relative min-h-[400px] bg-[var(--surface)] border border-[var(--border)] rounded-2xl overflow-hidden shadow-2xl">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="p-8 md:p-12 lg:p-16 h-full flex flex-col"
                            >
                                <div className="font-display font-medium text-[72px] md:text-[96px] leading-none text-[rgba(232,0,29,0.06)] mb-6">
                                    {NEW_FEATURES[activeTab].num}
                                </div>
                                <h4 className="font-display font-medium text-[32px] md:text-[40px] leading-[1.1] tracking-[0.02em] uppercase text-white mb-6">
                                    {NEW_FEATURES[activeTab].title}
                                </h4>
                                <div className="mb-8">
                                    <span className={`inline-block font-sans font-bold text-xs uppercase tracking-[0.1em] px-3 py-1.5 rounded-[4px] ${NEW_FEATURES[activeTab].badgeColor}`}>
                                        {NEW_FEATURES[activeTab].badge}
                                    </span>
                                </div>
                                <p className="font-sans text-[18px] md:text-lg text-[var(--grey)] leading-[1.7] mb-12 max-w-2xl">
                                    {NEW_FEATURES[activeTab].description}
                                </p>
                                <div className="pt-8 border-t border-[var(--border)] mt-auto flex flex-wrap gap-4">
                                    {NEW_FEATURES[activeTab].subFeatures.map((sf, idx) => {
                                        const Icon = sf.icon;
                                        return (
                                            <div key={idx} className="flex items-center gap-2.5 bg-white/5 border border-white/10 px-4 py-2.5 rounded-lg">
                                                <Icon className="w-4 h-4 text-[var(--t2)]" />
                                                <span className="font-sans text-xs font-semibold text-[var(--t2)] uppercase tracking-[0.05em]">
                                                    {sf.text}
                                                </span>
                                            </div>
                                        )
                                    })}
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
}
