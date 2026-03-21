import Link from "next/link";

export function CtaBanner() {
    return (
        <section className="relative z-[1] bg-[#E8001D] py-20 md:py-24 overflow-hidden">
            {/* Grid pattern overlay */}
            <div className="absolute inset-0 pointer-events-none" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
            }} />

            <div className="max-w-[1400px] mx-auto px-12 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start relative z-10">
                {/* Left column — headline + body */}
                <div>
                    <p className="font-sans text-[13px] font-medium uppercase tracking-[0.08em] text-white/60 mb-8 flex items-center gap-3">
                        <span className="block w-10 h-px bg-white/40" />
                        THE SYSTEM BEHIND THE RESULT.
                    </p>
                    <h2 className="font-display font-medium uppercase tracking-[0.02em] leading-none text-[64px] md:text-[80px] mb-8">
                        <span className="block text-white">STOP</span>
                        <span className="block" style={{
                            WebkitTextStroke: '1.5px rgba(255,255,255,0.35)',
                            color: 'transparent'
                        }}>MANAGING.</span>
                        <span className="block text-white">START</span>
                        <span className="block" style={{
                            WebkitTextStroke: '1.5px rgba(255,255,255,0.35)',
                            color: 'transparent'
                        }}>COACHING.</span>
                    </h2>
                    <p className="font-sans text-[15px] text-white/70 leading-[1.7] max-w-[480px]">
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
                                0
                            </p>
                            <p className="font-sans text-[11px] uppercase tracking-[0.06em] text-white/50 mt-1">
                                Card required
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right column — CTA */}
                <div className="flex flex-col items-center lg:items-end gap-4">
                    <p className="font-sans text-[11px] uppercase tracking-[0.1em] text-white/50">
                        GET STARTED TODAY
                    </p>
                    <Link href="/signup" className="block w-full max-w-[360px]">
                        <button className="w-full px-10 py-5 bg-white text-[#E8001D] font-sans font-bold text-[13px] uppercase tracking-[0.06em] rounded-[2px] hover:bg-white/90 transition-colors flex items-center justify-center gap-3">
                            START FREE TRIAL
                            <span className="text-[16px]">→</span>
                        </button>
                    </Link>
                    <p className="font-sans text-[12px] text-white/50 text-center">
                        No credit card. No contract. Cancel any time.
                    </p>
                </div>
            </div>
        </section>
    );
}
