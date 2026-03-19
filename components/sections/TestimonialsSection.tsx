import { TESTIMONIALS } from "@/lib/constants";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function TestimonialsSection() {
    return (
        <section id="stories">
            <div className="max-w-[1400px] mx-auto px-4 md:px-12 py-28 md:py-32">

                <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-16">
                    <Eyebrow label="Stories" />
                    <h2 className="font-display font-medium text-[36px] md:text-[44px] lg:text-[56px] leading-none tracking-[0.02em] uppercase text-white mt-6">
                        The results are <span className="text-[var(--red)]">undeniable.</span>
                    </h2>
                </div>

                {/* Testimonial Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-[var(--border)]">
                    {TESTIMONIALS.map((t, i) => (
                        <div key={i} className="bg-[var(--surface)] p-10 transition-colors hover:bg-[var(--surface2)] flex flex-col">
                            {/* Quote mark */}
                            <span className="font-serif text-[64px] leading-none text-[rgba(232,0,29,0.15)] block mb-4">&ldquo;</span>

                            {/* Quote body */}
                            <p className="font-sans text-[17px] italic text-[var(--grey)] leading-[1.6] mb-6">
                                {t.quote}
                            </p>

                            {/* ROI metric */}
                            <div className="bg-[var(--red-dim)] border border-[var(--red-border)] p-3 px-4 mb-5 flex items-center gap-3">
                                <span className="font-display font-medium text-[28px] text-[var(--red)] tracking-[0.02em] shrink-0 leading-none">
                                    {t.roi}
                                </span>
                                <span className="font-sans text-[11px] text-[var(--grey)] leading-[1.4]">
                                    {t.roiLabel}
                                </span>
                            </div>

                            {/* Author */}
                            <div className="mt-auto flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full flex items-center justify-center font-display font-medium text-[16px] text-white shrink-0" style={{ backgroundColor: i === 0 ? '#E8001D' : i === 1 ? '#25D366' : '#3B82F6' }}>
                                    {t.initial}
                                </div>
                                <div>
                                    <div className="font-sans font-semibold text-[13px] text-white">
                                        {t.name}
                                    </div>
                                    <div className="font-sans text-[11px] text-[var(--grey)]">
                                        {t.role}, {t.location} · {t.clients}
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
