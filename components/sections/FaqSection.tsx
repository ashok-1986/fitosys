"use client";

import { useState } from "react";
import { FAQS } from "@/lib/constants";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ChevronDown } from "lucide-react";

export function FaqSection() {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    return (
        <section className="bg-[var(--black)]" id="faq">
            <div className="max-w-[1400px] mx-auto px-4 md:px-12 py-28 md:py-32">
                <div className="grid lg:grid-cols-2 gap-20">

                    {/* Left - Headline */}
                    <div>
                        <Eyebrow label="FAQ" />
                        <h2 className="font-display font-medium text-[36px] md:text-[44px] lg:text-[56px] leading-none tracking-[0.02em] uppercase text-white mt-6 mb-8">
                            Everything you<br />
                            need to <span className="text-[var(--red)]">know.</span>
                        </h2>
                        <p className="font-sans text-[17px] text-[var(--grey)] leading-[1.7] max-w-[460px]">
                            Common questions from coaches who are transitioning from spreadsheets to systems.
                        </p>
                    </div>

                    {/* Right - Accordions */}
                    <div className="space-y-[1px] bg-[var(--border)]">
                        {FAQS.map((faq, i) => (
                            <div key={i} className="bg-[var(--black)] border-b border-[var(--border)] last:border-0 overflow-hidden">
                                <button
                                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                                    className="w-full flex items-center justify-between py-6 px-1 text-left transition-colors hover:text-white group"
                                >
                                    <span className="font-display font-medium text-[18px] md:text-[20px] uppercase tracking-[0.02em] text-white">
                                        {faq.q}
                                    </span>
                                    <ChevronDown
                                        className={`w-5 h-5 text-[var(--grey)] transition-transform duration-300 ${openIndex === i ? 'rotate-180 text-white' : ''}`}
                                    />
                                </button>
                                <div
                                    className={`transition-all duration-300 ease-in-out ${openIndex === i ? 'max-h-[300px] pb-8' : 'max-h-0'}`}
                                >
                                    <p className="font-sans text-[15px] text-[var(--grey)] leading-[1.7] px-1">
                                        {faq.a}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>

            {/* Structured Data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "FAQPage",
                        "mainEntity": FAQS.map((faq) => ({
                            "@type": "Question",
                            "name": faq.q,
                            "acceptedAnswer": {
                                "@type": "Answer",
                                "text": faq.a,
                            },
                        })),
                    }),
                }}
            />
        </section>
    );
}
