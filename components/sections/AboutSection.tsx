import { ABOUT_STATS } from "@/lib/constants";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function AboutSection() {
    return (
        <section className="bg-[var(--surface)]" id="about">
            <div className="max-w-[1400px] mx-auto px-4 md:px-12 py-28 md:py-32">
                <div className="grid lg:grid-cols-2 gap-20 items-start">

                    {/* Left — Manifesto */}
                    <div>
                        <Eyebrow label="Why We Built This" />
                        {/* Ghost word — static, not absolute */}
                        <span className="block font-display font-medium text-[64px] md:text-[80px] lg:text-[96px] uppercase text-transparent leading-none tracking-[0.02em] mb-6 select-none pointer-events-none" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.05)' }}>
                            FITO<span style={{ WebkitTextStroke: '1px rgba(232,0,29,0.08)' }}>SYS</span>
                        </span>

                        <div className="space-y-5 font-sans text-[17px] md:text-[18px] lg:text-[20px] leading-[1.7] text-[var(--grey)]">
                            <p>
                                Fitosys exists because India&apos;s best coaches shouldn&apos;t be drowning in WhatsApp messages.
                            </p>
                            <p>
                                The system should run. You should coach.
                            </p>
                        </div>

                        {/* Pillars */}
                        <div className="flex flex-col mt-10">
                            {[
                                { num: "01", title: "Automate the admin", desc: "Check-ins, renewals, invoices — they fire without you touching a button." },
                                { num: "02", title: "Surface the signal", desc: "Know who is thriving, who is slipping, and who needs a call — every Monday." },
                                { num: "03", title: "Scale without hiring", desc: "Manage 40 clients with the effort of 15. The system absorbs the overhead." },
                            ].map((p, i) => (
                                <div key={i} className={`py-6 flex gap-5 border-b border-[var(--border)] ${i === 0 ? 'border-t' : ''}`}>
                                    <span className="font-sans font-bold text-[13px] text-[var(--red)] uppercase tracking-[0.04em] w-6 shrink-0">{p.num}</span>
                                    <div>
                                        <div className="font-sans font-bold text-[13px] text-white uppercase tracking-[0.04em] mb-1">{p.title}</div>
                                        <div className="font-sans text-[13px] text-[var(--grey)] leading-[1.6]">{p.desc}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right — Stat Rows */}
                    <div className="flex flex-col gap-[1px]">
                        {ABOUT_STATS.map((stat, i) => (
                            <div key={i} className="bg-[var(--black)] border border-[var(--border)] p-6 flex items-center justify-between gap-6 transition-colors hover:bg-[var(--surface)]">
                                <span className="font-display font-medium text-[36px] md:text-[40px] text-white leading-none tracking-[0.02em] shrink-0">
                                    {stat.value}
                                </span>
                                <span className="font-sans text-[13px] text-[var(--grey)] text-right leading-[1.4]">
                                    {stat.label}
                                </span>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}
