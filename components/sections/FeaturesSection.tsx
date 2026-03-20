import { FEATURES } from "@/lib/constants";
import { Eyebrow } from "@/components/ui/Eyebrow";

const tagColors: Record<string, string> = {
    wa: "bg-[rgba(37,211,102,0.1)] text-[#25D366]",
    ai: "bg-[var(--red-dim)] text-[var(--red)]",
    fin: "bg-[rgba(59,130,246,0.1)] text-[#60a5fa]",
};

export function FeaturesSection() {
    return (
        <section id="features">
            <div className="max-w-[1400px] mx-auto px-4 md:px-12 py-28 md:py-32">
                <div className="grid lg:grid-cols-2 gap-12 mb-16 items-end">
                    <div>
                        <Eyebrow label="Core Features" />
                        <h2 className="font-display font-medium text-[36px] md:text-[44px] lg:text-[56px] leading-none tracking-[0.02em] uppercase text-white mt-6">
                            Three things.<br />
                            <span className="text-[var(--red)]">Zero Manual Work.</span>
                        </h2>
                    </div>
                    <p className="font-sans text-[20px] text-[var(--grey)] leading-[1.7] self-end">
                        Fitosys automates exactly three workflows — the three that eat the most time and cost the most revenue. Nothing more. Nothing less.
                    </p>
                </div>

                {/* Feature Grid — 1px gap with border background */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-[var(--border)]">
                    {FEATURES.map((f, i) => (
                        <div key={i} className="bg-[var(--black)] p-10 relative overflow-hidden group transition-colors hover:bg-[var(--surface2)]">
                            {/* Hover top line */}
                            <div className="absolute top-0 left-0 right-0 h-[2px] bg-[var(--red)] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

                            <div className="font-display font-medium text-[64px] leading-none text-[rgba(232,0,29,0.06)] mb-4 group-hover:text-[rgba(232,0,29,0.12)] transition-colors">
                                {f.num}
                            </div>
                            <h4 className="font-display font-medium text-[28px] md:text-[32px] leading-[1.1] tracking-[0.02em] uppercase text-white mb-3">
                                {f.title}
                            </h4>
                            <p className="font-sans text-[15px] text-[var(--grey)] leading-[1.7] mb-5">
                                {f.description}
                            </p>
                            <span className={`inline-block font-sans font-bold text-[10px] uppercase tracking-[0.1em] px-[10px] py-1 rounded-[2px] ${tagColors[f.tagColor] || tagColors.wa}`}>
                                {f.tag}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
