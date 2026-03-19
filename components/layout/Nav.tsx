"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useScrolled } from "@/hooks/useScrolled";
import { NAV_LINKS } from "@/lib/constants";

export function Nav() {
    const [isOpen, setIsOpen] = useState(false);
    const scrolled = useScrolled();
    const pathname = usePathname();

    if (pathname !== "/") return null;

    return (
        <nav
            className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "bg-[var(--black)]/80 backdrop-blur-md border-b border-[var(--border)] py-3" : "bg-transparent py-5"
                }`}
        >
            <div className="max-w-[1400px] mx-auto px-4 flex items-center justify-between">
                <Link href="/" className="font-display font-black text-2xl tracking-tight text-white uppercase">
                    FITO<span className="text-[var(--red)]">SYS</span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            className="text-[13px] font-medium text-[var(--grey)] hover:text-[var(--white)] transition-colors"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <Link
                        href="/login"
                        className="text-[13px] font-medium text-[var(--grey)] hover:text-[var(--white)] transition-colors"
                    >
                        Login
                    </Link>
                    <Link
                        href="/signup"
                        className="bg-[var(--red)] text-white px-5 py-2.5 text-[13px] font-bold uppercase tracking-wider hover:bg-[#C20000] transition-colors"
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
                <div className="md:hidden absolute top-full left-0 w-full bg-[var(--surface)] border-b border-[var(--border)] flex flex-col p-4 shadow-2xl">
                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.label}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="py-4 text-[16px] font-medium text-[var(--grey)] border-b border-[var(--border)]"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="flex flex-col gap-3 py-6">
                        <Link
                            href="/login"
                            onClick={() => setIsOpen(false)}
                            className="text-center py-3 text-[13px] font-medium text-[var(--grey)] border border-[var(--border)]"
                        >
                            Login
                        </Link>
                        <Link
                            href="/signup"
                            onClick={() => setIsOpen(false)}
                            className="bg-[var(--red)] text-white text-center py-3 text-[13px] font-bold uppercase tracking-wider"
                        >
                            Start Free
                        </Link>
                    </div>
                </div>
            )}
        </nav>
    );
}
