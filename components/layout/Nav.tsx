"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { NAV_LINKS } from "@/lib/constants";

import { usePathname } from "next/navigation";

export function Nav() {
    const pathname = usePathname();
    const isLanding = pathname === "/";
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className={`fixed top-0 left-0 right-0 z-[100] h-[64px] px-12 flex items-center justify-between transition-colors duration-300 ${isLanding ? "bg-transparent border-transparent" : "bg-[rgba(10,10,10,0.9)] backdrop-blur-md border-b border-[rgba(255,255,255,0.06)]"}`}>
            <div className="max-w-[1400px] mx-auto px-4 flex items-center justify-between w-full">
                <Link href="/">
                    <Image
                        src="/Fitosys_Logo_v1.png"
                        alt="Fitosys"
                        width={100}
                        height={40}
                        style={{ objectFit: 'contain' }}
                    />
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className={`font-sans text-[13px] font-medium uppercase tracking-[0.08em] hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-md transition-colors ${isLanding ? "text-white" : "text-[#888888]"}`}
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        href="/login"
                        className={`font-sans text-[13px] font-medium uppercase tracking-[0.08em] hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-md transition-colors ${isLanding ? "text-white" : "text-[#888888]"}`}
                    >
                        LOGIN
                    </Link>
                    <Link
                        href="/signup"
                        className="bg-[var(--red)] text-white px-6 py-2.5 text-[13px] font-bold uppercase tracking-[0.04em] hover:bg-white hover:text-black transition-colors duration-300 rounded-[2px]"
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
