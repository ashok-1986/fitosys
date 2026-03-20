import Link from "next/link";

export function CtaBanner() {
    return (
        <section className="relative z-[1] bg-[var(--red)] py-24 md:py-28 overflow-hidden">
            {/* Grid pattern overlay */}
            <div className="absolute inset-0 pointer-events-none" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
            }} />

            <div className="relative z-[1] max-w-[900px] mx-auto px-4 text-center">
                <h2 className="font-display font-medium text-[44px] md:text-[56px] lg:text-[72px] leading-none tracking-[0.02em] uppercase text-white mb-4">
                    Stop Managing.<br />
                    <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.4)' }}>Start</span><br />
                    Coaching.
                </h2>
                <p className="font-sans text-[14px] md:text-[15px] text-[rgba(255,255,255,0.65)] mb-9">
                    Give them a coach who has the system to keep them.
                </p>
                <Link
                    href="/signup"
                    className="inline-block bg-white text-[var(--red)] font-sans font-bold text-[13px] uppercase tracking-[0.04em] px-12 py-4 rounded-[2px] hover:opacity-90 transition-opacity"
                >
                    Start Free — No Card Needed
                </Link>
            </div>
        </section>
    );
}
