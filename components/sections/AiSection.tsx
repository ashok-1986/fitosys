import { Eyebrow } from "@/components/ui/Eyebrow";

export function AiSection() {
    return (
        <section id="ai" className="bg-[var(--black)]">
            <div className="max-w-[1400px] mx-auto px-4 md:px-12 py-28 md:py-32">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    
                    {/* Left - AI Dashboard Mockup */}
                    <div className="relative order-2 lg:order-1">
                        {/* Dashboard Frame */}
                        <div className="bg-[#111111] border border-[rgba(255,255,255,0.06)] rounded-[12px] overflow-hidden shadow-[0_48px_96px_rgba(0,0,0,0.9),0_0_0_1px_rgba(255,255,255,0.03)]">
                            
                            {/* Dashboard Header */}
                            <div className="bg-[#0A0A0A] border-b border-[rgba(255,255,255,0.06)] px-6 py-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded bg-[var(--red)] flex items-center justify-center">
                                        <span className="font-display font-medium text-[14px] text-white">AI</span>
                                    </div>
                                    <div>
                                        <div className="font-sans font-semibold text-[13px] text-white">Monday Brief</div>
                                        <div className="font-sans text-[11px] text-[var(--grey)]">Week of March 18, 2026</div>
                                    </div>
                                </div>
                                <div className="font-sans text-[11px] text-[var(--grey)]">
                                    7:00 AM · Auto-generated
                                </div>
                            </div>

                            {/* Dashboard Content */}
                            <div className="p-6 space-y-5">
                                
                                {/* Summary Stats */}
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="bg-[var(--red-dim)] border border-[var(--red-border)] rounded-[6px] p-3 text-center">
                                        <div className="font-display font-medium text-[24px] text-[var(--red)] leading-none mb-1">2</div>
                                        <div className="font-sans text-[10px] text-[var(--grey)] uppercase tracking-[0.04em]">Need Calls</div>
                                    </div>
                                    <div className="bg-[var(--red-dim)] border border-[var(--red-border)] rounded-[6px] p-3 text-center">
                                        <div className="font-display font-medium text-[24px] text-[var(--red)] leading-none mb-1">3</div>
                                        <div className="font-sans text-[10px] text-[var(--grey)] uppercase tracking-[0.04em]">At Risk</div>
                                    </div>
                                    <div className="bg-[rgba(37,211,102,0.1)] border border-[rgba(37,211,102,0.2)] rounded-[6px] p-3 text-center">
                                        <div className="font-display font-medium text-[24px] text-[#25D366] leading-none mb-1">18</div>
                                        <div className="font-sans text-[10px] text-[var(--grey)] uppercase tracking-[0.04em]">On Track</div>
                                    </div>
                                </div>

                                {/* Action Items */}
                                <div>
                                    <div className="font-sans text-[11px] text-[var(--grey)] uppercase tracking-[0.06em] mb-3">Priority Actions</div>
                                    <div className="space-y-2">
                                        {/* Action Item 1 */}
                                        <div className="bg-[#0A0A0A] border border-[rgba(255,255,255,0.06)] rounded-[6px] p-3 flex items-start gap-3">
                                            <div className="w-2 h-2 rounded-full bg-[var(--red)] mt-1.5 shrink-0" />
                                            <div className="flex-1">
                                                <div className="font-sans text-[13px] text-white mb-1">
                                                    Call <span className="text-white font-medium">Rahul Verma</span> — renewal in 5 days
                                                </div>
                                                <div className="font-sans text-[11px] text-[var(--grey)]">
                                                    Last check-in: 8/10 energy. Mention 12-week program discount.
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Item 2 */}
                                        <div className="bg-[#0A0A0A] border border-[rgba(255,255,255,0.06)] rounded-[6px] p-3 flex items-start gap-3">
                                            <div className="w-2 h-2 rounded-full bg-[var(--red)] mt-1.5 shrink-0" />
                                            <div className="flex-1">
                                                <div className="font-sans text-[13px] text-white mb-1">
                                                    Check in with <span className="text-white font-medium">Priya Sharma</span> — low engagement
                                                </div>
                                                <div className="font-sans text-[11px] text-[var(--grey)]">
                                                    Missed last 2 check-ins. Sent WhatsApp nudge yesterday.
                                                </div>
                                            </div>
                                        </div>

                                        {/* Action Item 3 */}
                                        <div className="bg-[#0A0A0A] border border-[rgba(255,255,255,0.06)] rounded-[6px] p-3 flex items-start gap-3">
                                            <div className="w-2 h-2 rounded-full bg-[#25D366] mt-1.5 shrink-0" />
                                            <div className="flex-1">
                                                <div className="font-sans text-[13px] text-white mb-1">
                                                    Celebrate win: <span className="text-white font-medium">Ananya K.</span> hit protein goals
                                                </div>
                                                <div className="font-sans text-[11px] text-[var(--grey)]">
                                                    7 days straight. Send voice note encouragement.
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Insights Box */}
                                <div className="bg-[var(--red-dim)] border border-[var(--red-border)] rounded-[6px] p-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-6 h-6 rounded bg-[var(--red)] flex items-center justify-center shrink-0 mt-0.5">
                                            <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div>
                                            <div className="font-sans text-[12px] text-white font-semibold mb-1">AI Insight</div>
                                            <div className="font-sans text-[12px] text-[var(--grey)] leading-[1.6]">
                                                Your response rate is up 23% this week. Clients who received video responses were 2x more likely to complete their next check-in.
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Elements */}
                        <div className="absolute -top-6 -right-6 w-32 h-32 bg-[var(--red)] opacity-10 blur-[60px] pointer-events-none" />
                        <div className="absolute -bottom-6 -left-6 w-40 h-40 bg-[#3B82F6] opacity-10 blur-[60px] pointer-events-none" />
                    </div>

                    {/* Right - Content */}
                    <div className="order-1 lg:order-2">
                        <Eyebrow label="AI Powered" />
                        <h2 className="font-display font-medium text-[44px] md:text-[56px] lg:text-[64px] leading-none tracking-[0.02em] uppercase text-white mt-6 mb-8">
                            <span className="block text-white">KNOW WHO NEEDS YOU.</span>
                            <span className="block text-[#E8001D]">EVERY MONDAY.</span>
                        </h2>
                        <p className="font-sans text-[18px] text-[var(--grey)] leading-[1.7] mb-8">
                            Gemini AI reads every check-in from the week and sends you one clear brief by 7 AM Monday. Response rates, energy trends, at-risk clients — sorted and prioritised. No dashboard needed. Just act on it.
                        </p>

                        <ul className="space-y-4 mb-10">
                            <li className="flex items-start gap-3">
                                <span className="font-display font-medium text-[20px] text-[var(--red)] mt-1">●</span>
                                <div>
                                    <span className="font-sans text-[15px] text-white block mb-1">At-risk client flagging</span>
                                    <span className="font-sans text-[13px] text-[var(--grey)]">Clients who missed check-ins or show dropping energy are flagged automatically.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="font-display font-medium text-[20px] text-[var(--red)] mt-1">●</span>
                                <div>
                                    <span className="font-sans text-[15px] text-white block mb-1">Renewal predictions</span>
                                    <span className="font-sans text-[13px] text-[var(--grey)]">Know who is likely to renew and who needs a conversation before their program ends.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="font-display font-medium text-[20px] text-[var(--red)] mt-1">●</span>
                                <div>
                                    <span className="font-sans text-[15px] text-white block mb-1">One priority per week</span>
                                    <span className="font-sans text-[13px] text-[var(--grey)]">One specific coaching action every Monday. Not ten insights. One.</span>
                                </div>
                            </li>
                        </ul>

                        <a
                            href="/signup"
                            className="inline-block bg-[var(--red)] text-white font-sans font-bold text-[13px] uppercase tracking-[0.04em] px-10 py-[14px] rounded-[2px] hover:bg-[#C20000] transition-colors border-2 border-[var(--red)]"
                        >
                            Start Free
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
