import { ABOUT_STATS } from "@/lib/constants";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function AboutSection() {
    return (
        <section className="py-32 bg-[var(--black)] border-t border-[var(--border)]" id="about">
            <div className="max-w-[1400px] mx-auto px-4">
                <div className="grid lg:grid-cols-5 gap-16 items-center">

                    <div className="lg:col-span-3 max-w-2xl">
                        <Eyebrow label="Built by Coaches" />
                        <h2 className="font-display font-medium text-[36px] md:text-[44px] lg:text-[56px] leading-[1.0] tracking-[0.02em] uppercase text-white mt-6 mb-8">
                            We refused to be <br />
                            <span className="text-[var(--red)]">admin assistants.</span>
                        </h2>
                        <div className="space-y-6 font-sans text-[18px] md:text-[19px] lg:text-[20px] leading-[1.7] text-[var(--grey)]">
                            <p>
                                Fitosys wasn't built by a tech company looking for a market. It was built by a fitness coach hitting a breaking point at 35 clients.
                            </p>
                            <p>
                                We realized that the barrier to scaling a high-ticket coaching business wasn't finding more leads. It was the crushing weight of Sunday manual check-ins, forgotten renewals, and chaotic WhatsApp threads.
                            </p>
                            <p className="text-white font-medium">
                                We automated the friction. You focus on the coaching.
                            </p>
                        </div>
                    </div>

                    <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                        {ABOUT_STATS.map((stat, i) => (
                            <div key={i} className="bg-[var(--surface)] p-6 border border-[var(--border)] flex flex-col gap-2">
                                <span className="font-display font-medium text-[32px] md:text-[40px] uppercase text-[var(--red)] tracking-[0.02em] leading-none">
                                    {stat.value}
                                </span>
                                <span className="font-sans text-[13px] text-[var(--grey)] leading-[1.4]">
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
