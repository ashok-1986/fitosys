"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";

export function Nav() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-[100] h-[64px] bg-[rgba(10,10,10,0.9)] backdrop-blur-md border-b border-[rgba(255,255,255,0.06)] px-12 flex items-center justify-between">
            <div className="max-w-[1400px] mx-auto px-4 flex items-center justify-between w-full">
                <a href="/" className="font-display font-medium text-[20px] uppercase tracking-[0.02em] text-white no-underline">
                    <span className="text-[#E8001D]">FITO</span>SYS
                </a>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="font-sans text-[13px] font-medium uppercase tracking-[0.08em] text-[#888888] hover:text-white transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        href="/signup"
                        className="bg-[var(--red)] text-white px-6 py-2.5 text-[13px] font-bold uppercase tracking-[0.04em] hover:bg-[#C20000] transition-colors rounded-[2px]"
                    >
                        Start Free
                    </Link>
                </div>

                {/* Mobile Toggle */}
                <button
                    className="md:hidden text-white"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    {isOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Drawer */}
            {isOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-[#111111] border-b border-[rgba(255,255,255,0.06)] flex flex-col p-4 shadow-2xl">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="py-4 text-[16px] font-medium text-[#888888] border-b border-[rgba(255,255,255,0.06)]"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="flex flex-col gap-3 py-6">
                        <Link
                            href="/signup"
                            onClick={() => setIsOpen(false)}
                            className="bg-[var(--red)] text-white text-center py-3 text-[13px] font-bold uppercase tracking-[0.04em]"
                        >
                            Start Free
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
