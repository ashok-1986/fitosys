import React from 'react';
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export interface SuccessDetail {
    label: string;
    value: string;
    isCurrency?: boolean;
}

interface SuccessContentProps {
    title?: string;
    subtitle: string;
    details: SuccessDetail[];
    whatsappNote?: string;
    ctaText?: string;
    ctaHref?: string;
}

export function SuccessContent({
    title = "You're\nIn.",
    subtitle,
    details,
    whatsappNote = "Check your WhatsApp — a welcome message is on its way. 🎯",
    ctaText = "Go to Homepage",
    ctaHref = "/"
}: SuccessContentProps) {
    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 font-sans">
            <div className="w-full max-w-sm space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                {/* Success Icon */}
                <div className="flex justify-center">
                    <div className="w-16 h-16 rounded-full border border-success/30 flex items-center justify-center text-success text-2xl bg-success/5 shadow-[0_0_20px_rgba(16,185,129,0.1)]">
                        ✓
                    </div>
                </div>

                {/* Title */}
                <h1 className="text-6xl font-black font-display leading-[0.9] text-center uppercase tracking-tighter">
                    {title.split('\n').map((line, i) => (
                        <React.Fragment key={i}>
                            {line === 'In.' ? <span className="text-brand">In.</span> : line}
                            {i === 0 && <br />}
                        </React.Fragment>
                    ))}
                </h1>

                {/* Subtitle */}
                <p className="text-[#A0A0A0] text-center text-sm px-4">
                    {subtitle}
                </p>

                {/* Details Card */}
                <div className="bg-[#111111] border border-white/5 rounded-xl overflow-hidden shadow-2xl">
                    <div className="divide-y divide-white/5">
                        {details.map((detail, i) => (
                            <div key={i} className="flex justify-between items-center p-4 text-xs font-medium">
                                <span className="text-[#A0A0A0] uppercase tracking-wider">{detail.label}</span>
                                <span className={`font-bold ${detail.isCurrency ? 'text-success' : 'text-white'}`}>
                                    {detail.value}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* WhatsApp Note */}
                <p className="text-[#A0A0A0] text-center text-xs italic opacity-80">
                    {whatsappNote}
                </p>

                {/* CTA */}
                <div className="pt-4">
                    <Button
                        asChild
                        className="w-full h-12 bg-white text-black hover:bg-[#E8E8E8] font-bold uppercase tracking-widest text-[10px] rounded-sm transition-all shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                    >
                        <Link href={ctaHref}>{ctaText} →</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
}
