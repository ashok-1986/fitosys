import { PRICING_PLANS } from "@/lib/constants";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Check } from "lucide-react";

export function PricingSection() {
    return (
        <section className="py-32 bg-[var(--black)] border-t border-[var(--border)]" id="pricing">
            <div className="max-w-[1400px] mx-auto px-4">

                <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-20">
                    <Eyebrow label="Pricing" />
                    <h2 className="font-display font-medium text-[36px] md:text-[44px] lg:text-[56px] leading-[1.0] tracking-[0.02em] uppercase text-white mt-6 mb-8">
                        Simple pricing. <br />
                        <span className="text-[var(--red)]">No surprises.</span>
                    </h2>
                    <p className="font-sans text-[17px] md:text-[18px] lg:text-[20px] leading-[1.7] text-[var(--grey)]">
                        Start for free. Upgrade when your business demands it.
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                    {PRICING_PLANS.map((plan, i) => (
                        <div
                            key={i}
                            className={`relative flex flex-col p-8 md:p-10 transition-all duration-300 ${plan.popular
                                    ? "bg-[var(--surface2)] border border-[var(--red-border)] scale-100 md:scale-105 z-10 shadow-2xl"
                                    : "bg-[var(--surface)] border border-[var(--border)]"
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--red)] text-white px-4 py-1 text-[11px] font-bold uppercase tracking-widest rounded-full">
                                    Most Popular
                                </div>
                            )}

                            <h3 className="font-display font-medium text-[24px] uppercase text-white mb-2 tracking-[0.02em]">
                                {plan.name}
                            </h3>
                            <p className="font-sans text-[13px] text-[var(--grey)] mb-8">
                                {plan.limit}
                            </p>

                            <div className="flex items-baseline gap-1 mb-8">
                                <span className="font-sans text-[20px] text-[var(--grey)] font-medium">₹</span>
                                <span className="font-display font-medium text-[48px] uppercase tracking-[0.02em] leading-none text-white">
                                    {plan.price}
                                </span>
                                <span className="font-sans text-[13px] text-[var(--grey)] ml-1">/mo</span>
                            </div>

                            <button
                                className={`w-full py-4 text-[13px] font-bold uppercase tracking-wider transition-colors mb-10 ${plan.popular
                                        ? "bg-[var(--red)] text-white hover:bg-[#C20000]"
                                        : "bg-[var(--black)] text-white border border-[var(--border)] hover:bg-[var(--surface2)] hover:border-[var(--grey-mid)]"
                                    }`}
                            >
                                Get Started
                            </button>

                            <div className="flex flex-col gap-4 mt-auto">
                                <p className="font-sans text-[13px] font-bold text-white uppercase tracking-wider mb-2">
                                    What's included:
                                </p>
                                {plan.features.map((feature, idx) => (
                                    <div key={idx} className="flex gap-3">
                                        <Check className="w-5 h-5 text-[var(--red)] shrink-0" />
                                        <span className="font-sans text-[15px] leading-[1.5] text-[var(--grey)]">
                                            {feature}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
