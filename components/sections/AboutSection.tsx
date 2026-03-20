import { Eyebrow } from "@/components/ui/Eyebrow";

export function AboutSection() {
    return (
        <section className="bg-[var(--surface)]" id="about">
            <div className="max-w-[1400px] mx-auto px-4 md:px-12 py-28 md:py-32">
                <Eyebrow label="ABOUT FITOSYS" />

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mt-8">
                    {/* Left column — text, pillars */}
                    <div>
                        <p className="font-sans text-[20px] md:text-[24px] italic text-white leading-[1.5] mb-8 max-w-[600px]">
                            Fitosys exists because India&apos;s best coaches shouldn&apos;t be drowning in WhatsApp messages. The system should run. You should coach.
                        </p>

                        <p className="font-sans text-[17px] text-[#888888] leading-[1.7] mb-6 max-w-[700px]">
                            Built by Alchemetryx — a technology company that builds operating systems for independent professionals. We spoke to coaches across Mumbai, Delhi, Bangalore, and Pune. Every conversation had the same ending: good coaches losing good clients not because the coaching was poor, but because nothing was holding the business together between sessions.
                        </p>

                        <p className="font-sans text-[17px] text-white font-semibold leading-[1.7] mb-12 max-w-[700px]">
                            Fitosys is that thing.
                        </p>

                        {/* Three Pillars */}
                        <div className="flex flex-col">
                            <div className="flex gap-5 py-5 border-b border-white/[0.06]">
                                <span className="font-display font-medium text-[32px] text-[#E8001D] leading-none tracking-[0.02em] shrink-0">01</span>
                                <div>
                                    <div className="font-sans font-semibold text-[13px] text-white uppercase tracking-[0.08em] mb-2">India-First, Always</div>
                                    <div className="font-sans text-[15px] text-[#888888] leading-[1.7]">
                                        Razorpay UPI built in. GST invoices automatic. WhatsApp as primary channel. We built for how India actually works, not how a Western SaaS assumes it does.
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-5 py-5 border-b border-white/[0.06]">
                                <span className="font-display font-medium text-[32px] text-[#E8001D] leading-none tracking-[0.02em] shrink-0">02</span>
                                <div>
                                    <div className="font-sans font-semibold text-[13px] text-white uppercase tracking-[0.08em] mb-2">Systems Over Features</div>
                                    <div className="font-sans text-[15px] text-[#888888] leading-[1.7]">
                                        Fitosys does three things. It does them reliably, every week, without the coach touching them. That is the product. Not a feature list.
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-5 py-5 border-b border-white/[0.06]">
                                <span className="font-display font-medium text-[32px] text-[#E8001D] leading-none tracking-[0.02em] shrink-0">03</span>
                                <div>
                                    <div className="font-sans font-semibold text-[13px] text-white uppercase tracking-[0.08em] mb-2">Coach Revenue Is Sacred</div>
                                    <div className="font-sans text-[15px] text-[#888888] leading-[1.7]">
                                        Every decision is measured against one question: does this protect or grow the coach&apos;s revenue? If the answer is no, it does not ship.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right column — stat grid */}
                    <div>
                        <div className="grid grid-cols-2 gap-px bg-white/[0.06] mt-12 border border-white/[0.06] rounded-[10px] overflow-hidden">
                            <div className="bg-[#0A0A0A] p-8 hover:bg-[#111111] transition-colors">
                                <p className="font-display font-medium text-[40px] text-white leading-none tracking-[0.02em] mb-2">
                                    ₹72,000+
                                </p>
                                <p className="font-sans text-[13px] text-[#888888]">
                                    average annual revenue recovered per coach
                                </p>
                            </div>

                            <div className="bg-[#0A0A0A] p-8 hover:bg-[#111111] transition-colors">
                                <p className="font-display font-medium text-[40px] text-white leading-none tracking-[0.02em] mb-2">
                                    130 hrs
                                </p>
                                <p className="font-sans text-[13px] text-[#888888]">
                                    saved per year from admin automation
                                </p>
                            </div>

                            <div className="bg-[#0A0A0A] p-8 hover:bg-[#111111] transition-colors border-t border-white/[0.06]">
                                <p className="font-display font-medium text-[40px] text-white leading-none tracking-[0.02em] mb-2">
                                    30 min
                                </p>
                                <p className="font-sans text-[13px] text-[#888888]">
                                    average setup time for new coaches
                                </p>
                            </div>

                            <div className="bg-[#0A0A0A] p-8 hover:bg-[#111111] transition-colors border-t border-white/[0.06]">
                                <p className="font-display font-medium text-[40px] text-white leading-none tracking-[0.02em] mb-2">
                                    ₹999
                                </p>
                                <p className="font-sans text-[13px] text-[#888888]">
                                    starting price — less than one skipped session
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
