import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CtaBanner() {
    return (
        <section className="py-32 bg-[var(--black)] relative overflow-hidden border-t border-[var(--border)]">
            {/* Background Logo Outline Pattern */}
            <div className="absolute inset-0 z-0 pointer-events-none opacity-5 flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-[800px] h-[800px] text-white" fill="none" stroke="currentColor" strokeWidth="2">
                    {/* A stylized 'F' roughly matching the brand logo described */}
                    <polygon points="20,80 20,20 80,20 80,40 40,40 40,50 70,50 70,70 40,70 40,80" />
                </svg>
            </div>

            <div className="max-w-[1400px] mx-auto px-4 relative z-10">
                <div className="max-w-4xl mx-auto border border-[var(--red-border)] bg-[var(--surface)] p-12 md:p-20 text-center flex flex-col items-center">
                    <h2 className="font-display font-medium text-[36px] md:text-[44px] lg:text-[56px] leading-[1.0] tracking-[0.02em] uppercase text-white mb-6">
                        Ready to <span className="text-[var(--red)]">Scale?</span>
                    </h2>
                    <p className="font-sans text-[17px] md:text-[18px] lg:text-[20px] leading-[1.7] text-[var(--grey)] mb-10 max-w-xl">
                        Join the top 1% of independent coaches who have automated their admin and maximized client retention.
                    </p>
                    <Link
                        href="/signup"
                        className="rounded-full bg-[var(--red)] text-white px-10 py-5 text-[15px] font-sans font-bold uppercase tracking-wider hover:bg-[#C20000] transition-colors flex items-center justify-center gap-2 group"
                    >
                        Start 14-Day Free Trial
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
