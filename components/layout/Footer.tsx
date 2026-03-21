"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "@/lib/constants";

export function Footer() {
    const pathname = usePathname();
    // Only show on root marketing page
    if (pathname !== "/") return null;

    return (
        <footer className="bg-[var(--surface)] py-20 border-t border-[var(--border)]">
            <div className="max-w-[1400px] mx-auto px-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 pb-12 border-b border-[var(--border)] mb-8">
                    <div>
                        <Image
                            src="/Fitosys_Logo_v1.png"
                            alt="Fitosys"
                            width={120}
                            height={48}
                            style={{ objectFit: 'contain' }}
                            className="mb-4"
                        />
                        <p className="text-[13px] text-[var(--grey)] leading-relaxed max-w-[260px]">
                            The system behind the result. Built for independent coaches in India. Runs on WhatsApp.
                        </p>
                        <div className="mt-5 text-[12px] text-[var(--grey-mid)]">
                            A product by <a href="https://alchemetryx.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#E8001D] transition-colors font-semibold">Alchemetryx</a>
                        </div>
                    </div>
                    <div>
                        <div className="text-[13px] font-bold text-white mb-5 uppercase tracking-wide">Product</div>
                        <div className="space-y-3">
                            {NAV_LINKS.map((link) => (
                                <Link
                                    key={link.label}
                                    href={link.href}
                                    className="block text-[13px] text-[var(--grey)] hover:text-white transition-colors"
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div className="text-[13px] font-bold text-white mb-5 uppercase tracking-wide">HAVE QUESTIONS? WE'RE ON WHATSAPP.</div>
                        <div className="space-y-3">
                            <a href="tel:+917738363495" className="block text-[13px] text-[#888888] hover:text-white transition-colors">
                                +91 77383 63495
                            </a>
                            <a href="mailto:fitosys@alchemetryx.com" className="block text-[13px] text-[#888888] hover:text-white transition-colors">
                                fitosys@alchemetryx.com
                            </a>
                        </div>
                    </div>
                    <div>
                        <div className="text-[13px] font-bold text-white mb-5 uppercase tracking-wide">Legal</div>
                        <div className="space-y-3">
                            <Link href="/terms" className="block text-[13px] text-[var(--grey)] hover:text-white transition-colors">
                                Terms of Service
                            </Link>
                            <Link href="/privacy" className="block text-[13px] text-[var(--grey)] hover:text-white transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="/refund" className="block text-[13px] text-[var(--grey)] hover:text-white transition-colors">
                                Refund Policy
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-[12px] text-[var(--grey-mid)]">
                        © 2026 <strong className="text-[var(--grey)]">Alchemetryx</strong>. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <Link href="/terms" className="text-[12px] text-[var(--grey-mid)] hover:text-[var(--grey)] transition-colors">Terms</Link>
                        <Link href="/privacy" className="text-[12px] text-[var(--grey-mid)] hover:text-[var(--grey)] transition-colors">Privacy</Link>
                        <Link href="/cookies" className="text-[12px] text-[var(--grey-mid)] hover:text-[var(--grey)] transition-colors">Cookies</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
