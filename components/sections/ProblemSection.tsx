import { PROBLEM_ITEMS } from "@/lib/constants";
import { Eyebrow } from "@/components/ui/Eyebrow";

export function ProblemSection() {
    return (
        <section className="py-32 bg-[var(--black)]">
            <div className="max-w-[1400px] mx-auto px-4">
                <div className="grid lg:grid-cols-2 gap-16">
                    <div className="max-w-xl">
                        <Eyebrow label="The Reality" />
                        <h2 className="font-display font-medium text-[36px] md:text-[44px] lg:text-[56px] leading-[1.0] tracking-[0.02em] uppercase text-white mt-6 mb-8">
                            Why independent <br />
                            coaches <span className="text-[var(--red)]">hit a ceiling.</span>
                        </h2>
                        <p className="font-sans text-[17px] md:text-[18px] lg:text-[20px] leading-[1.7] text-[var(--grey)]">
                            You didn't become a coach to be an admin assistant. But at 30 clients, the math breaks. The spreadsheets fail. The follow-ups slip.
                        </p>
                    </div>

                    <div className="flex flex-col gap-10">
                        {PROBLEM_ITEMS.map((item, i) => (
                            <div key={i} className="flex gap-6 group">
                                <div className="font-display font-medium text-[24px] text-[var(--red)] tracking-widest mt-1 opacity-50 group-hover:opacity-100 transition-opacity">
                                    0{i + 1}
                                </div>
                                <div>
                                    <h3 className="font-display font-medium text-[24px] md:text-[28px] lg:text-[32px] leading-[1.0] tracking-[0.02em] uppercase text-white mb-3">
                                        {item.title}
                                    </h3>
                                    <p className="font-sans text-[15px] leading-[1.7] text-[var(--grey)]">
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
