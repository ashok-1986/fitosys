import { Eyebrow } from "@/components/ui/Eyebrow";
import { StatPair } from "@/components/ui/StatPair";

export function AboutSection() {
    return (
        <section className="bg-[var(--surface)]" id="about">
            <div className="max-w-[1400px] mx-auto px-4 md:px-12 py-28 md:py-32">
                <Eyebrow label="ABOUT FITOSYS" />

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
                <div className="flex flex-col mb-16">
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

                {/* Stat Rows */}
                <div className="flex flex-col">
                    <div className="flex items-center justify-between py-5 border-b border-white/[0.06] hover:bg-[#111111] transition-colors">
                        <StatPair value="₹72,000+" label="average annual revenue recovered per coach" valueColor="text-white" />
                    </div>
                    <div className="flex items-center justify-between py-5 border-b border-white/[0.06] hover:bg-[#111111] transition-colors">
                        <StatPair value="130 hrs" label="saved per year from admin automation" valueColor="text-white" />
                    </div>
                    <div className="flex items-center justify-between py-5 border-b border-white/[0.06] hover:bg-[#111111] transition-colors">
                        <StatPair value="30 min" label="average setup time for new coaches" valueColor="text-white" />
                    </div>
                    <div className="flex items-center justify-between py-5 border-b border-white/[0.06] hover:bg-[#111111] transition-colors">
                        <StatPair value="₹999" label="starting price — less than one skipped session" valueColor="text-white" />
                    </div>
                </div>
            </div>
        </section>
    );
}
