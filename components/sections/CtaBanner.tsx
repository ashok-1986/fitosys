import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CtaBanner() {
    return (
        <section className="relative z-[1] bg-[#E8001D] py-24 md:py-28 overflow-hidden">
            {/* Grid pattern overlay */}
            <div className="absolute inset-0 pointer-events-none" style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
            }} />

            <div className="relative z-[1] max-w-[800px] mx-auto text-center flex flex-col items-center gap-6 px-4">
                <h2 className="font-display font-medium uppercase tracking-[0.02em] leading-none text-[56px] md:text-[72px] text-white">
                    <span className="block">STOP MANAGING.</span>
                    <span className="block">START COACHING.</span>
                </h2>
                <p className="font-sans text-[13px] text-white/70">
                    No card needed · First 5 clients free · Setup in 30 minutes
                </p>
                <Button variant="fitosys-primary" size="fitosys">Start Free</Button>
            </div>
        </section>
    );
}
