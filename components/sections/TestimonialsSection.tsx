"use client";

import { Eyebrow } from "@/components/ui/Eyebrow";
import { useReveal } from "@/hooks/useReveal";

const TESTIMONIALS = [
    {
        quote: "I used to spend every Sunday sending check-in messages manually to 28 clients. Now I wake up Monday to an AI summary and spend the time on an actual rest day.",
        roi: "2.5hrs",
        roiLabel: "saved every week — 130 hours per year back",
        name: "Fitness Coach, Mumbai",
        role: "",
        avatarColor: "bg-[#E8001D]",
        initial: "F",
    },
    {
        quote: "I was losing 2 to 3 renewals a month because I forgot to follow up. Fitosys caught 4 renewals in the first month. That is more than ₹15,000 in one month alone.",
        roi: "₹1.8L",
        roiLabel: "annual renewal revenue recovered",
        name: "Yoga Instructor, Delhi",
        role: "",
        avatarColor: "bg-[#1A1A3E]",
        initial: "Y",
    },
    {
        quote: "My clients comment that the check-in feels personal. They do not know it is automated. The message goes out in my name, from my number. That is the detail that matters.",
        roi: "94%",
        roiLabel: "check-in response rate — up from 60%",
        name: "Nutrition Coach, Bangalore",
        role: "",
        avatarColor: "bg-[#0A3020]",
        initial: "N",
    },
];

export function TestimonialsSection() {
    const headingRef = useReveal<HTMLHeadingElement>(0);
    const textRef = useReveal<HTMLParagraphElement>(100);

    const cardRefs = [
        useReveal<HTMLDivElement>(0),
        useReveal<HTMLDivElement>(100),
        useReveal<HTMLDivElement>(200)
    ];

    return (
        <section id="stories">
            <div className="max-w-[1400px] mx-auto px-4 md:px-12 py-28 md:py-32">
                <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
                    <Eyebrow label="COACH STORIES" />
                    <h2 ref={headingRef} className="reveal-on-scroll font-display font-medium uppercase tracking-[0.02em] leading-none text-[44px] md:text-[56px] mt-6">
                        <span className="block text-white">COACHES WHO GOT</span>
                        <span className="block text-[#E8001D]">THEIR SUNDAYS BACK.</span>
                    </h2>
                    <p ref={textRef} className="reveal-on-scroll font-sans text-[20px] text-[#888888] leading-[1.7] mt-6 max-w-[600px]">
                        Illustrative results based on beta coach conversations. Individual outcomes vary. What independent coaches tell us happens when systems replace spreadsheets.
                    </p>
                </div>

                {/* Testimonial Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-[rgba(255,255,255,0.06)]">
                    {TESTIMONIALS.map((t, i) => (
                        <div key={i} ref={cardRefs[i]} className="reveal-on-scroll bg-[#111111] border border-white/[0.06] rounded-[10px] p-8 flex flex-col">
                            {/* Quote mark */}
                            <span className="font-serif text-[64px] leading-none text-[#E8001D]/20 block mb-4">&ldquo;</span>

                            {/* Quote body */}
                            <p className="font-sans text-[17px] italic text-[#888888] leading-[1.6] mb-6">
                                {t.quote}
                            </p>

                            {/* ROI metric */}
                            <div className="bg-[#E8001D]/[0.08] border border-[#E8001D]/20 p-3 flex items-center gap-3 mb-5">
                                <span className="font-display font-medium text-[28px] text-[#E8001D] leading-none shrink-0">
                                    {t.roi}
                                </span>
                                <span className="font-sans text-[11px] text-[#888888] leading-[1.4]">
                                    {t.roiLabel}
                                </span>
                            </div>

                            {/* Author */}
                            <div className="mt-auto flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-display font-medium text-[16px] text-white shrink-0 ${t.avatarColor}`}>
                                    {t.initial}
                                </div>
                                <div>
                                    <div className="font-sans font-semibold text-[13px] text-white">
                                        {t.name}
                                    </div>
                                    <div className="font-sans text-[11px] text-[#888888]">
                                        {t.role}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
