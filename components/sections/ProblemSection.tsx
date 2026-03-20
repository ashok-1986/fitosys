import { PROBLEM_ITEMS } from "@/lib/constants";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function ProblemSection() {
    return (
        <section className="bg-[var(--surface)]" id="problem">
            <div className="max-w-[1400px] mx-auto px-4 md:px-12 py-28 md:py-32">
                <div className="grid lg:grid-cols-2 gap-20 items-start">
                    {/* Left — Headline */}
                    <div>
                        <Eyebrow label="The Problem" />
                        <h2 className="font-display font-medium text-[36px] md:text-[44px] lg:text-[56px] leading-none tracking-[0.02em] uppercase text-white mt-6 mb-6">
                            Your coaching<br />
                            is <span className="text-[var(--red)]">excellent.</span><br />
                            <span className="text-[rgba(255,255,255,0.15)]">Your system</span><br />
                            is broken.
                        </h2>
                        <p className="font-sans text-[17px] text-[var(--grey)] leading-[1.7] max-w-[460px] mt-5">
                            Independent coaches with 20–40 clients face the same operational failures every month. None of them have anything to do with coaching quality.
                        </p>
                    </div>

                    {/* Right — Problem List */}
                    <div className="flex flex-col">
                        {PROBLEM_ITEMS.map((item, i) => (
                            <div key={i} className={`py-7 border-b border-[var(--border)] ${i === 0 ? 'border-t' : ''}`}>
                                <div className="font-sans font-medium text-[13px] uppercase tracking-[0.08em] text-[rgba(255,255,255,0.2)] mb-2">
                                    {item.num} — {item.tag}
                                </div>
                                <h3 className="font-display font-medium text-[28px] md:text-[32px] leading-[1.1] tracking-[0.02em] uppercase text-white mb-2">
                                    {item.title}
                                </h3>
                                <p className="font-sans text-[15px] text-[var(--grey)] leading-[1.7] mb-3">
                                    {item.description}
                                </p>
                                <span className="inline-flex items-center gap-[6px] bg-[var(--red-dim)] border border-[var(--red-border)] px-3 py-1 rounded-[2px] font-sans font-bold text-[11px] uppercase tracking-[0.06em] text-[var(--red)]">
                                    {item.badge}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quote Block */}
                <div className="mt-20 max-w-[680px] mx-auto">
                    <div className="bg-[var(--surface)] border-l-[3px] border-[var(--red)] py-8 px-9">
                        <span className="font-serif text-[80px] leading-none text-[rgba(232,0,29,0.2)] block mb-2">&ldquo;</span>
                        <p className="font-sans text-[17px] italic text-white leading-[1.6] mb-4">
                            Sunday raat 11 baj gaye the. Main abhi bhi 18 clients ko check-in messages bhej raha tha. Yeh koi business nahi tha — yeh madness tha.
                        </p>
                        <div className="font-sans font-semibold text-[13px] text-white">
                            Rahul Verma <span className="text-[var(--grey)] font-normal">— Yoga Coach, Delhi</span>
                        </div>
                        <div className="font-sans text-[13px] text-[var(--grey)] mt-2 leading-[1.6]">
                            (English: "It was 11pm on a Sunday. I was still manually sending check-in messages to 18 clients. That wasn't a business — that was madness.")
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
