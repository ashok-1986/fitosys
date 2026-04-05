"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function HeroSection() {
    return (
        <section className="relative min-h-screen w-full flex items-end justify-center overflow-hidden">
            {/* Full-Screen Background Video */}
            <video
                src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260306_074215_04640ca7-042c-45d6-bb56-58b1e8a42489.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover z-0"
            />

            {/* Content Container with 250px bottom padding */}
            <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 pb-[250px] pt-32 flex flex-col items-center">

                {/* 4 Corner Accents for the Content Bounding Box */}
                <div className="absolute top-0 left-0 w-[7px] h-[7px] bg-white hidden md:block" />
                <div className="absolute top-0 right-0 w-[7px] h-[7px] bg-white hidden md:block" />
                <div className="absolute bottom-0 left-0 w-[7px] h-[7px] bg-white hidden md:block" />
                <div className="absolute bottom-0 right-0 w-[7px] h-[7px] bg-white hidden md:block" />

                {/* Featured Badge - Centered at the top */}
                <div className="flex justify-center mb-12">
                    <div className="p-[2px] rounded-full bg-white/10 backdrop-blur-sm shadow-[0_0_15px_rgba(255,255,255,0.05)]">
                        <div className="bg-white/90 backdrop-blur-md px-6 py-2 rounded-full flex items-center gap-2">
                            <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-black">
                                Featured in Fortune
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main Hero Copy - Reusing previous concepts but centered and striking */}
                <div className="text-center max-w-[900px] mb-12">
                    <h1 className="font-display font-medium uppercase tracking-[0.02em] leading-[0.9] text-[50px] md:text-[80px] lg:text-[110px] text-white drop-shadow-2xl">
                        GOOD COACHES.<br />
                        <span className="text-[#E8001D]">LOST CLIENTS.</span>
                    </h1>
                </div>

                <div className="text-center max-w-[600px] mb-12">
                    <p className="font-sans text-[20px] md:text-[24px] leading-[1.5] text-white drop-shadow-lg">
                        Fitosys automates your client check-ins, renewals, and onboarding — <strong>natively on WhatsApp</strong>.
                    </p>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                    <Link
                        href="/signup"
                        className="group flex items-center justify-center gap-3 bg-[var(--red)] text-white px-10 py-5 text-[15px] font-bold uppercase tracking-widest transition-colors duration-300 hover:bg-white hover:text-black rounded-[2px] min-w-[240px]"
                    >
                        Start Free
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        href="/demo"
                        className="group flex items-center justify-center gap-3 bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-5 text-[15px] font-bold uppercase tracking-widest transition-colors duration-300 hover:bg-white hover:text-black rounded-[2px] min-w-[240px]"
                    >
                        View Demo
                    </Link>
                </div>

                <p className="font-sans text-[12px] text-white/70 uppercase tracking-widest mt-8 drop-shadow-md">
                    No card needed · First 5 clients free · Setup in 30 mins
                </p>

            </div>
        </section>
    );
}
