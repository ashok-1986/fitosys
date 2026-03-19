import { FEATURES } from "@/lib/constants";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { MessageCircle, Brain, CreditCard, BellRing, ClipboardList, Activity } from "lucide-react";

const getIcon = (i: number) => {
    const icons = [MessageCircle, Brain, CreditCard, BellRing, ClipboardList, Activity];
    const Icon = icons[i % icons.length];
    return <Icon className="w-6 h-6 text-[var(--red)]" />;
};

export function FeaturesSection() {
    return (
        <section className="py-32 bg-[var(--black)] border-t border-[var(--border)]" id="features">
            <div className="max-w-[1400px] mx-auto px-4">
                <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-20">
                    <Eyebrow label="Features" />
                    <h2 className="font-display font-medium text-[36px] md:text-[44px] lg:text-[56px] leading-[1.0] tracking-[0.02em] uppercase text-white mt-6 mb-8">
                        Built for <span className="text-[var(--red)]">Scale.</span>
                    </h2>
                    <p className="font-sans text-[17px] md:text-[18px] lg:text-[20px] leading-[1.7] text-[var(--grey)]">
                        Everything you need to run a high-ticket coaching business without the administrative bloat.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {FEATURES.map((feature, i) => (
                        <div
                            key={i}
                            className="bg-[var(--surface)] border border-[var(--border)] p-8 hover:bg-[var(--surface2)] transition-colors duration-200 group flex flex-col h-full"
                        >
                            <div className="w-12 h-12 rounded-full bg-[var(--red-dim)] border border-[var(--red-border)] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-200 shrink-0">
                                {getIcon(i)}
                            </div>
                            <h3 className="font-display font-medium text-[24px] md:text-[28px] lg:text-[32px] leading-[1.1] tracking-[0.02em] uppercase text-white mb-4">
                                {feature.title}
                            </h3>
                            <p className="font-sans text-[15px] leading-[1.7] text-[var(--grey)] mt-auto">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
