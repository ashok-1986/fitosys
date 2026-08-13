"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HOW_IT_WORKS_STEPS } from "@/lib/constants";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { useReveal } from "@/hooks/useReveal";

export function HowItWorksSection() {
    const headingRef = useReveal<HTMLHeadingElement>(0);
    const textRef = useReveal<HTMLParagraphElement>(100);
    const [activeStep, setActiveStep] = useState(0);
    const [isPaused, setIsPaused] = useState(false);

    // Auto-advance
    useEffect(() => {
        if (isPaused) return;
        const interval = setInterval(() => {
            setActiveStep((prev) => (prev + 1) % HOW_IT_WORKS_STEPS.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [isPaused]);

    return (
        <section className="bg-[var(--surface)]" id="how-it-works">
            <div className="max-w-[1400px] mx-auto px-4 md:px-12 py-28 md:py-32">
                <div className="grid lg:grid-cols-2 gap-12 items-end mb-16">
                    <div>
                        <Eyebrow label="HOW IT WORKS" />
                        <h2 ref={headingRef} className="reveal-on-scroll font-display font-medium text-[36px] md:text-[44px] lg:text-[56px] leading-none tracking-[0.02em] uppercase text-white mt-6">
                            <span className="block">FOUR STEPS TO</span>
                            <span className="block text-[#E8001D]">FULL AUTOMATION.</span>
                        </h2>
                    </div>
                    <p ref={textRef} className="reveal-on-scroll font-sans text-lg text-[var(--grey)] leading-[1.7] self-end max-w-[500px]">
                        From sign-up to a fully automated coaching business. Average setup time: 28 minutes. No technical knowledge needed.
                    </p>
                </div>

                <div 
                    className="grid lg:grid-cols-[1fr_1fr] gap-8 lg:gap-16"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                >
                    {/* Left: Stepper */}
                    <div className="flex flex-col relative">
                        {/* Progress line background */}
                        <div className="absolute left-6 top-6 bottom-6 w-[2px] bg-white/10" />
                        
                        {HOW_IT_WORKS_STEPS.map((step, i) => {
                            const isActive = activeStep === i;
                            const isPast = activeStep > i;
                            
                            return (
                                <div 
                                    key={i} 
                                    className={`relative flex gap-8 p-6 rounded-2xl cursor-pointer transition-all duration-300 ${isActive ? 'bg-white/5' : 'hover:bg-white/5'}`}
                                    onClick={() => setActiveStep(i)}
                                >
                                    {/* Active Progress Line */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeStepLine"
                                            className="absolute left-6 top-6 bottom-6 w-[2px] bg-[#E8001D] z-10 origin-top"
                                            initial={{ scaleY: 0 }}
                                            animate={{ scaleY: 1 }}
                                            transition={{ duration: 5, ease: "linear" }}
                                        />
                                    )}
                                    {isPast && (
                                        <div className="absolute left-6 top-6 bottom-6 w-[2px] bg-[#E8001D] z-10" />
                                    )}

                                    {/* Circle */}
                                    <div className={`relative z-20 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-display font-medium text-[18px] transition-colors duration-300 ${isActive ? 'bg-[#E8001D] text-white shadow-[0_0_20px_rgba(232,0,29,0.3)]' : isPast ? 'bg-[#E8001D] text-white' : 'bg-[#111111] text-white/40 border border-white/10'}`}>
                                        {step.num}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 pt-2 pb-6">
                                        <h3 className={`font-display font-medium text-[24px] leading-[1.1] tracking-[0.02em] uppercase mb-2 transition-colors duration-300 ${isActive ? 'text-white' : 'text-white/60'}`}>
                                            {step.title}
                                        </h3>
                                        
                                        <AnimatePresence>
                                            {isActive && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    transition={{ duration: 0.3 }}
                                                    className="overflow-hidden"
                                                >
                                                    <p className="font-sans text-sm text-[var(--grey)] leading-[1.7] mb-4 mt-2">
                                                        {step.description}
                                                    </p>
                                                    <div className="font-sans text-xs font-bold uppercase tracking-[0.08em] text-[#E8001D]">
                                                        {step.time}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Right: Micro-Demo Window */}
                    <div className="relative bg-[#0A0A0A] border border-[var(--border)] rounded-2xl overflow-hidden shadow-2xl h-[500px] lg:h-auto flex items-center justify-center">
                        <div className="absolute top-0 left-0 right-0 h-10 bg-[#111111] border-b border-[var(--border)] flex items-center px-4 gap-2 z-10">
                            <div className="w-3 h-3 rounded-full bg-[#E8001D]/20" />
                            <div className="w-3 h-3 rounded-full bg-white/10" />
                            <div className="w-3 h-3 rounded-full bg-white/10" />
                        </div>
                        
                        <div className="w-full h-full pt-10 relative overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeStep}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 1.05 }}
                                    transition={{ duration: 0.4 }}
                                    className="absolute inset-0 pt-10 flex items-center justify-center p-8"
                                >
                                    <DemoContent step={activeStep} />
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

function DemoContent({ step }: { step: number }) {
    if (step === 0) {
        return (
            <div className="w-full max-w-sm bg-[#111] border border-white/10 rounded-xl p-6 shadow-xl">
                <div className="h-4 w-32 bg-white/20 rounded mb-6" />
                <div className="space-y-4">
                    <div>
                        <div className="h-3 w-20 bg-white/10 rounded mb-2" />
                        <div className="h-10 w-full bg-white/5 border border-white/10 rounded" />
                    </div>
                    <div>
                        <div className="h-3 w-24 bg-white/10 rounded mb-2" />
                        <div className="h-10 w-full bg-white/5 border border-white/10 rounded flex items-center px-3">
                            <div className="h-4 w-4 bg-[#25D366] rounded-full mr-2" />
                            <div className="h-3 w-24 bg-white/20 rounded" />
                        </div>
                    </div>
                    <div className="pt-2">
                        <div className="h-10 w-full bg-[#E8001D] rounded flex items-center justify-center">
                            <div className="h-3 w-16 bg-white/80 rounded" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    if (step === 1) {
        return (
            <div className="w-full max-w-sm bg-[#111] border border-white/10 rounded-xl p-6 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <div className="h-4 w-32 bg-white/20 rounded" />
                    <div className="h-6 w-16 bg-white/10 rounded-full" />
                </div>
                <div className="bg-[#1A1A1A] border border-white/5 rounded-lg p-4 mb-4">
                    <div className="h-4 w-3/4 bg-white/20 rounded mb-2" />
                    <div className="h-3 w-1/2 bg-white/10 rounded mb-4" />
                    <div className="flex gap-2">
                        <div className="h-6 w-16 bg-[#E8001D]/20 border border-[#E8001D]/50 rounded text-center flex justify-center items-center">
                            <div className="h-2 w-8 bg-[#E8001D] rounded" />
                        </div>
                        <div className="h-6 w-20 bg-white/10 rounded" />
                    </div>
                </div>
                <div className="border-2 border-dashed border-white/10 rounded-lg h-20 flex items-center justify-center">
                    <div className="h-3 w-32 bg-white/20 rounded" />
                </div>
            </div>
        );
    }
    if (step === 2) {
        return (
            <div className="w-full max-w-xs bg-[#E5DDD5] rounded-xl overflow-hidden shadow-2xl flex flex-col h-[280px]">
                <div className="bg-[#075E54] h-12 flex items-center px-4 gap-3">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex-shrink-0" />
                    <div className="h-3 w-24 bg-white/80 rounded" />
                </div>
                <div className="flex-1 p-4 flex flex-col gap-3" style={{ backgroundImage: 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")' }}>
                    <div className="bg-white p-3 rounded-lg rounded-tl-none max-w-[85%] shadow-sm self-start">
                        <div className="h-3 w-16 bg-[#25D366]/40 rounded mb-2" />
                        <div className="h-2 w-full bg-gray-200 rounded mb-1" />
                        <div className="h-2 w-5/6 bg-gray-200 rounded mb-1" />
                        <div className="h-2 w-4/6 bg-gray-200 rounded" />
                    </div>
                    <div className="bg-[#DCF8C6] p-3 rounded-lg rounded-tr-none max-w-[85%] shadow-sm self-end">
                        <div className="h-2 w-full bg-green-900/20 rounded mb-1" />
                        <div className="h-2 w-3/4 bg-green-900/20 rounded" />
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="w-full max-w-sm h-full bg-[#111] border border-white/10 rounded-xl p-6 shadow-xl flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div className="h-4 w-32 bg-white/20 rounded" />
                <div className="h-8 w-8 bg-white/10 rounded-full" />
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 rounded-lg p-4">
                    <div className="h-3 w-16 bg-white/20 rounded mb-2" />
                    <div className="h-6 w-24 bg-[#E8001D] rounded" />
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                    <div className="h-3 w-16 bg-white/20 rounded mb-2" />
                    <div className="h-6 w-12 bg-white/80 rounded" />
                </div>
            </div>
            <div className="flex-1 bg-white/5 rounded-lg p-4 space-y-3">
                <div className="h-3 w-24 bg-white/20 rounded mb-4" />
                {[1, 2, 3].map(i => (
                    <div key={i} className="flex justify-between items-center border-b border-white/5 pb-2">
                        <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-white/10" />
                            <div className="h-2 w-20 bg-white/30 rounded" />
                        </div>
                        <div className={`h-4 w-12 rounded-full ${i === 1 ? 'bg-[#E8001D]/20' : 'bg-[#25D366]/20'}`} />
                    </div>
                ))}
            </div>
        </div>
    );
}
