"use client";

import { useReveal } from "@/hooks/useReveal";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { KineticText } from "@/components/ui/KineticText";

const NEW_FEATURES = [
    {
        num: "01",
        title: "ONBOARDING IN ONE LINK.",
        description: "Share one link. Your client fills the intake form, picks a program, and pays via UPI or card. They get a WhatsApp welcome automatically. No back-and-forth. No awkward payment conversation.",
        badge: "WHATSAPP NATIVE",
        subFeature: "GST invoice auto-generated · Payment via Razorpay",
        badgeColor: "bg-[rgba(37,211,102,0.1)] text-[#25D366]",
    },
    {
        num: "02",
        title: "CHECK-INS WITHOUT LIFTING A FINGER.",
        description: "Every Sunday at 7 PM, structured check-ins go out to every active client — in your name, from your number. Replies are stored automatically. Monday morning you receive a 2-minute AI summary showing exactly who needs your attention that week.",
        badge: "WHATSAPP NATIVE",
        subFeature: "Gemini AI · Response rate tracking · Priority actions",
        badgeColor: "bg-[rgba(37,211,102,0.1)] text-[#25D366]",
    },
    {
        num: "03",
        title: "NEVER LOSE A RENEWAL AGAIN.",
        description: "7 days before a program ends, a personalised reminder fires with the client's own progress data. If there is no reply in 48 hours, a follow-up goes out. Every payment triggers a GST-compliant invoice, generated and emailed automatically.",
        badge: "WHATSAPP NATIVE",
        subFeature: "T-7 days automatic · Every invoice automatic · Real-time data",
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
            <div className="max-w-[1400px] mx-auto px-4 md:px-12 py-28 md:py-32">
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
                                <div className="pt-6 border-t border-[var(--border)] mt-auto">
                                    <span className="font-sans text-[12px] font-semibold text-[var(--t2)] uppercase tracking-[0.05em]">
                                        {f.subFeature}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
