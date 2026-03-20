import { HOW_IT_WORKS_STEPS } from "@/lib/constants";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function HowItWorksSection() {
    return (
        <section className="bg-[var(--surface)]" id="how-it-works">
            <div className="max-w-[1400px] mx-auto px-4 md:px-12 py-28 md:py-32">
                <div className="grid lg:grid-cols-2 gap-12 items-end">
                    <div>
                        <Eyebrow label="HOW IT WORKS" />
                        <h2 className="font-display font-medium text-[36px] md:text-[44px] lg:text-[56px] leading-none tracking-[0.02em] uppercase text-white mt-6">
                            <span className="block">FOUR STEPS TO</span>
                            <span className="block">FULL AUTOMATION.</span>
                        </h2>
                    </div>
                    <p className="font-sans text-[20px] text-[var(--grey)] leading-[1.7] self-end">
                        From sign-up to a fully automated coaching business. Average setup time: 28 minutes. No technical knowledge needed.
                    </p>
                </div>

                {/* Steps Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-[var(--border)] mt-16">
                    {HOW_IT_WORKS_STEPS.map((step, i) => (
                        <div key={i} className="bg-[var(--surface)] p-10 transition-colors hover:bg-[var(--surface2)]">
                            <div className="w-8 h-8 rounded-full bg-[var(--red)] flex items-center justify-center font-display font-medium text-[16px] text-white mb-5">
                                {step.num}
                            </div>
                            <h3 className="font-display font-medium text-[24px] leading-[1.1] tracking-[0.02em] uppercase text-white mb-3">
                                {step.title}
                            </h3>
                            <p className="font-sans text-[15px] text-[var(--grey)] leading-[1.7] mb-4">
                                {step.description}
                            </p>
                            <div className="font-sans text-[11px] font-bold uppercase tracking-[0.08em] text-[var(--red)]">
                                {step.time}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
