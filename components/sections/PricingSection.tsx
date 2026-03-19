import { PRICING_PLANS } from "@/lib/constants";
import { Eyebrow } from "@/components/ui/Eyebrow";
import Link from "next/link";

export function PricingSection() {
    return (
        <section id="pricing">
            <div className="max-w-[1400px] mx-auto px-4 md:px-12 py-28 md:py-32">
                <div className="grid lg:grid-cols-2 gap-12 mb-16 items-end">
                    <div>
                        <Eyebrow label="Pricing" />
                        <h2 className="font-display font-medium text-[36px] md:text-[44px] lg:text-[56px] leading-none tracking-[0.02em] uppercase text-white mt-6">
                            Built for India.<br />
                            <span className="text-[var(--red)]">Priced for</span><br />
                            coaches.
                        </h2>
                    </div>
                    <p className="font-sans text-[20px] text-[var(--grey)] leading-[1.7] self-end">
                        Start free. Pay only when you grow. No contracts. No hidden charges.
                    </p>
                </div>

                {/* Pricing Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-[var(--border)]">
                    {PRICING_PLANS.map((plan, i) => (
                        <div key={i} className={`p-10 relative transition-colors ${plan.popular ? 'bg-[var(--surface2)] border-t-2 border-t-[var(--red)]' : 'bg-[var(--surface)]'}`}>
                            {plan.popular && (
                                <span className="absolute top-4 right-4 bg-[var(--red)] text-white font-sans font-bold text-[9px] uppercase tracking-[0.1em] px-2 py-[3px] rounded-[2px]">
                                    Most Popular
                                </span>
                            )}

                            <div className="font-sans font-medium text-[13px] uppercase tracking-[0.08em] text-[var(--red)] mb-4">
                                {plan.name}
                            </div>

                            <div className="font-display font-medium text-[48px] leading-none tracking-[0.02em] text-white mb-1">
                                ₹{plan.price}<sub className="text-[18px] text-[var(--grey)]">/mo</sub>
                            </div>

                            <div className="font-sans text-[13px] text-[var(--grey)] mb-2">
                                + 18% GST
                            </div>

                            <div className="font-sans font-semibold text-[15px] text-white mb-6">
                                {plan.limit}
                            </div>

                            <div className="h-[1px] bg-[var(--border)] mb-6" />

                            <ul className="space-y-[10px] mb-8">
                                {plan.features.map((f, fi) => (
                                    <li key={fi} className="font-sans text-[13px] text-[rgba(255,255,255,0.8)] flex items-start gap-2">
                                        <span className="text-[#22C55E] shrink-0">✓</span>
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href="/signup"
                                className={`block w-full text-center font-sans font-bold text-[13px] uppercase tracking-[0.04em] py-3 rounded-[2px] transition-all ${plan.popular
                                    ? 'bg-[var(--red)] text-white hover:bg-[#C20000]'
                                    : 'bg-transparent border border-[var(--border)] text-[var(--grey)] hover:border-[rgba(255,255,255,0.3)] hover:text-white'
                                    }`}
                            >
                                {plan.popular ? 'Start Free' : 'Choose Plan'}
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
