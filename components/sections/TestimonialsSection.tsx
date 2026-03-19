import { TESTIMONIALS } from "@/lib/constants";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function TestimonialsSection() {
    return (
        <section className="py-32 bg-[var(--surface)] border-t border-[var(--border)]" id="stories">
            <div className="max-w-[1400px] mx-auto px-4">

                <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-20">
                    <Eyebrow label="Stories" />
                    <h2 className="font-display font-medium text-[36px] md:text-[44px] lg:text-[56px] leading-[1.0] tracking-[0.02em] uppercase text-white mt-6 mb-8">
                        The results are <span className="text-[var(--red)]">undeniable.</span>
                    </h2>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {TESTIMONIALS.map((t, i) => (
                        <div key={i} className="bg-[var(--black)] border border-[var(--border)] p-8 flex flex-col group relative overflow-hidden transition-colors hover:border-[var(--red-border)]">
                            {/* ROI Hover Reveal */}
                            <div className="absolute inset-0 bg-[var(--surface2)] z-10 flex flex-col justify-center items-center text-center p-6 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                                <p className="font-display font-medium text-[48px] uppercase tracking-[0.02em] leading-none text-[var(--red)] mb-2">
                                    {t.roi}
                                </p>
                                <p className="font-sans text-[13px] text-[var(--grey)] uppercase tracking-wider font-bold">
                                    {t.roiLabel}
                                </p>
                            </div>

                            {/* Normal Content */}
                            <div className="relative z-0 flex flex-col h-full group-hover:opacity-0 transition-opacity duration-300">
                                <p className="font-sans text-[16px] md:text-[17px] leading-[1.7] text-white mb-8 italic">
                                    "{t.quote}"
                                </p>
                                <div className="mt-auto flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-[var(--surface2)] border border-[var(--border)] flex items-center justify-center font-display font-medium text-[20px] text-white uppercase shrink-0">
                                        {t.initial}
                                    </div>
                                    <div>
                                        <h4 className="font-sans text-[15px] font-bold text-white leading-tight">
                                            {t.name}
                                        </h4>
                                        <p className="font-sans text-[13px] text-[var(--grey)] mt-1">
                                            {t.role} • {t.clients}
                                        </p>
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
