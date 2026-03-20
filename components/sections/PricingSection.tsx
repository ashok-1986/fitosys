import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/button";

const PRICING_DATA = [
    {
        tier: "STARTER",
        price: "999",
        period: "per month",
        clients: "Up to 10 clients",
        featured: false,
        features: [
            { text: "WhatsApp check-ins (automated)", active: true },
            { text: "Razorpay payment onboarding", active: true },
            { text: "Renewal reminders", active: true },
            { text: "GST invoice generation", active: true },
            { text: "Coach dashboard", active: true },
            { text: "AI Monday summary", locked: true },
            { text: "Custom check-in questions", locked: true },
        ],
    },
    {
        tier: "BASIC",
        price: "1,499",
        period: "per month",
        clients: "Up to 25 clients",
        featured: true,
        badge: "Most Popular",
        features: [
            { text: "Everything in Starter", active: true },
            { text: "AI Monday summary", active: true },
            { text: "At-risk client flagging", active: true },
            { text: "AI coach insight", active: true },
            { text: "Full check-in history", active: true },
            { text: "Custom check-in questions", locked: true },
            { text: "Priority support", locked: true },
        ],
    },
    {
        tier: "PRO",
        price: "2,999",
        period: "per month",
        clients: "Up to 50 clients",
        featured: false,
        features: [
            { text: "Everything in Basic", active: true },
            { text: "Custom check-in questions", active: true },
            { text: "Program-specific templates", active: true },
            { text: "Renewal analytics", active: true },
            { text: "Churn reason tracking", active: true },
            { text: "WhatsApp priority support", active: true },
        ],
    },
    {
        tier: "STUDIO",
        price: "5,999",
        period: "per month",
        clients: "Unlimited clients",
        featured: false,
        features: [
            { text: "Everything in Pro", active: true },
            { text: "Multi-location management", active: true },
            { text: "White-label onboarding", active: true },
            { text: "API access", active: true },
            { text: "Dedicated onboarding call", active: true },
            { text: "1-hour priority support", active: true },
        ],
    },
];

export function PricingSection() {
    return (
        <section id="pricing">
            <div className="max-w-[1400px] mx-auto px-4 md:px-12 py-28 md:py-32">
                <div className="grid lg:grid-cols-2 gap-12 mb-16 items-end">
                    <div>
                        <Eyebrow label="PRICING" />
                        <h2 className="font-display font-medium uppercase tracking-[0.02em] leading-none text-[44px] md:text-[56px]">
                            <span className="block text-white">BUILT FOR INDIA.</span>
                            <span className="block text-[#E8001D]">PRICED FOR COACHES.</span>
                        </h2>
                    </div>
                    <p className="font-sans text-[20px] text-[#888888] leading-[1.7] self-end">
                        Client-count based pricing. You pay more only as your business grows. Annual plans save 2 months.
                    </p>
                </div>

                {/* Pricing Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-[rgba(255,255,255,0.06)]">
                    {PRICING_DATA.map((plan, i) => (
                        <div
                            key={i}
                            className={`bg-[#111111] border border-white/[0.06] rounded-[10px] p-8 flex flex-col ${
                                plan.featured ? "border-t-2 border-t-[#E8001D] bg-[#161616]" : ""
                            }`}
                        >
                            {plan.badge && (
                                <span className="self-end bg-[#E8001D] text-white text-[11px] font-bold uppercase tracking-[0.06em] px-3 py-1 rounded-[2px] mb-4">
                                    {plan.badge}
                                </span>
                            )}

                            <div className="font-sans text-[11px] font-bold uppercase tracking-[0.08em] text-[#E8001D] mb-4">
                                {plan.tier}
                            </div>

                            <div className="flex items-baseline gap-1 mb-1">
                                <span className="font-display text-[24px] text-[#888888]">₹</span>
                                <span className="font-display font-medium text-[48px] text-white leading-none tracking-[0.02em]">
                                    {plan.price}
                                </span>
                            </div>

                            <div className="font-sans text-[13px] text-[#888888] mb-2">
                                {plan.period}
                            </div>

                            <div className="font-sans text-[15px] font-semibold text-white mb-6">
                                {plan.clients}
                            </div>

                            <div className="h-[1px] bg-white/[0.06] mb-6" />

                            <ul className="space-y-3 mb-8 flex-1">
                                {plan.features.map((feature, fi) => (
                                    <li key={fi} className="font-sans text-[13px] flex items-start gap-2">
                                        {feature.locked ? (
                                            <span className="text-white/20 shrink-0">✕</span>
                                        ) : (
                                            <span className="text-[#10B981] shrink-0">✓</span>
                                        )}
                                        <span className={feature.locked ? "text-white/20" : "text-[#888888]"}>
                                            {feature.text}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            <Button variant="fitosys-primary" size="fitosys" className="w-full">
                                Start Free
                            </Button>
                        </div>
                    ))}
                </div>

                <p className="text-center font-sans text-[13px] text-[#888888] mt-6">
                    14-day free trial on all plans · No credit card required · Cancel anytime
                </p>
            </div>
        </section>
    );
}
