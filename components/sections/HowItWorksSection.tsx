import { HOW_IT_WORKS_STEPS } from "@/lib/constants";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function HowItWorksSection() {
    return (
        <section className="py-32 bg-[var(--surface)] border-t border-[var(--border)]" id="how-it-works">
            <div className="max-w-[1400px] mx-auto px-4">

                <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-24">
                    <Eyebrow label="The Process" />
                    <h2 className="font-display font-medium text-[36px] md:text-[44px] lg:text-[56px] leading-[1.0] tracking-[0.02em] uppercase text-white mt-6 mb-8">
                        Set it up once. <br />
                        <span className="text-[var(--red)]">Let it run forever.</span>
                    </h2>
                </div>

                <div className="grid md:grid-cols-4 gap-8 md:gap-4 lg:gap-8 relative">
                    {/* Connecting Line for Desktop */}
                    <div className="hidden md:block absolute top-[40px] left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-[var(--red-border)] to-transparent" />

                    {HOW_IT_WORKS_STEPS.map((step, i) => (
                        <div key={i} className="relative flex flex-col items-center text-center group">
                            <div className="w-20 h-20 rounded-full bg-[var(--black)] border border-[var(--border)] flex items-center justify-center z-10 mb-8 transition-colors duration-300 group-hover:border-[var(--red)] group-hover:bg-[var(--surface2)]">
                                <span className="font-display font-medium text-[36px] md:text-[44px] lg:text-[56px] leading-none tracking-[0.02em] uppercase text-[var(--red)]">
                                    {i + 1}
                                </span>
                            </div>

                            <h3 className="font-display font-medium text-[24px] md:text-[28px] lg:text-[32px] leading-[1.1] tracking-[0.02em] uppercase text-white mb-3">
                                {step.title}
                            </h3>

                            <p className="font-sans text-[15px] leading-[1.7] text-[var(--grey)] max-w-xs">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
