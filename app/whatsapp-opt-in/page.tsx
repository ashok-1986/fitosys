import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "WhatsApp Communication Policy — Fitosys",
    description: "How Fitosys uses WhatsApp messaging, how consent is obtained, and how to opt out.",
};

export default function WhatsAppOptInPage() {
    return (
        <div className="min-h-screen bg-[var(--black)] pt-28 pb-20 px-6">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-16">
                    <div className="inline-block px-3 py-1.5 rounded-sm bg-[rgba(232,0,29,0.08)] border border-[rgba(232,0,29,0.15)] text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--red)] mb-6">
                        Last updated: April 2026
                    </div>
                    <h1 className="text-5xl md:text-6xl font-display font-medium uppercase leading-[0.9] tracking-[0.02em] mb-4">
                        WhatsApp <span className="text-[var(--red)]">Communication</span> Policy
                    </h1>
                    <p className="text-[var(--grey)] text-[15px] leading-relaxed max-w-xl">
                        This page explains what WhatsApp messages you may receive from a Fitosys-powered coaching program, how we obtain consent, and how to opt out.
                    </p>
                </div>

                {/* Sections */}
                <div className="space-y-0">
                    {/* Section 1 */}
                    <section className="py-10 border-b border-[rgba(255,255,255,0.06)]">
                        <h2 className="text-2xl font-display font-medium uppercase tracking-[0.02em] mb-4">1. What Messages You Will Receive</h2>
                        <p className="text-[var(--grey)] text-[14px] leading-relaxed mb-4">
                            If you enroll in a coaching program through a Fitosys-powered link, you may receive:
                        </p>
                        <ul className="list-disc list-inside text-[var(--grey)] text-[14px] leading-relaxed space-y-1.5 ml-2 mb-4">
                            <li>A one-time enrollment confirmation message</li>
                            <li>Weekly check-in messages from your coach (every Sunday evening)</li>
                            <li>Program renewal reminders when your program is nearing its end date</li>
                        </ul>
                        <p className="text-[var(--grey)] text-[14px] leading-relaxed mb-2">
                            Messages are sent from your coach&apos;s registered WhatsApp number via Fitosys infrastructure.
                        </p>
                        <p className="text-[var(--grey)] text-[14px] leading-relaxed">
                            <strong className="text-white">Message frequency:</strong> 1–2 messages per week.
                        </p>
                    </section>

                    {/* Section 2 */}
                    <section className="py-10 border-b border-[rgba(255,255,255,0.06)]">
                        <h2 className="text-2xl font-display font-medium uppercase tracking-[0.02em] mb-4">2. How We Obtain Consent</h2>
                        <p className="text-[var(--grey)] text-[14px] leading-relaxed mb-4">
                            You explicitly opt in on the coach&apos;s enrollment form before any message is sent. The consent checkbox states:
                        </p>
                        <div className="bg-[var(--surface)] border border-[rgba(255,255,255,0.06)] rounded-lg p-6 text-[14px]">
                            <p className="text-white italic">
                                &quot;I agree to receive WhatsApp messages from my coach via Fitosys, including weekly check-ins and renewal reminders.&quot;
                            </p>
                        </div>
                        <p className="text-[var(--grey)] text-[14px] leading-relaxed mt-4">
                            <strong className="text-white">No messages are sent without this checkbox being checked.</strong>
                        </p>
                    </section>

                    {/* Section 3 */}
                    <section className="py-10 border-b border-[rgba(255,255,255,0.06)]">
                        <h2 className="text-2xl font-display font-medium uppercase tracking-[0.02em] mb-4">3. How to Opt Out</h2>
                        <p className="text-[var(--grey)] text-[14px] leading-relaxed mb-4">
                            You can opt out at any time using any of the following methods:
                        </p>
                        <ul className="space-y-4 text-[14px]">
                            <li className="flex gap-3">
                                <span className="text-[var(--red)] font-bold shrink-0">1.</span>
                                <span className="text-[var(--grey)]">Reply <strong className="text-white">STOP</strong> to any message at any time. Your number will be removed from all automated messaging immediately.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-[var(--red)] font-bold shrink-0">2.</span>
                                <span className="text-[var(--grey)]">Contact your coach directly and ask to be removed.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-[var(--red)] font-bold shrink-0">3.</span>
                                <span className="text-[var(--grey)]">Email <a href="mailto:support@fitosys.in" className="text-[var(--red)] hover:underline">support@fitosys.in</a> with your phone number and we will remove you within 24 hours.</span>
                            </li>
                        </ul>
                    </section>

                    {/* Section 4 */}
                    <section className="py-10 border-b border-[rgba(255,255,255,0.06)]">
                        <h2 className="text-2xl font-display font-medium uppercase tracking-[0.02em] mb-4">4. Message and Data Rates</h2>
                        <p className="text-[var(--grey)] text-[14px] leading-relaxed">
                            Standard WhatsApp data rates from your mobile carrier may apply. Fitosys does not charge clients for receiving messages.
                        </p>
                    </section>

                    {/* Section 5 */}
                    <section className="py-10 border-b border-[rgba(255,255,255,0.06)]">
                        <h2 className="text-2xl font-display font-medium uppercase tracking-[0.02em] mb-4">5. Contact</h2>
                        <div className="bg-[var(--surface)] border border-[rgba(255,255,255,0.06)] rounded-lg p-6 space-y-2 text-[14px]">
                            <p className="text-[var(--grey)]"><strong className="text-white">Company:</strong> Alchemetryx Consulting Pvt Ltd</p>
                            <p className="text-[var(--grey)]"><strong className="text-white">Email:</strong>{" "}
                                <a href="mailto:support@fitosys.in" className="text-[var(--red)] hover:underline">support@fitosys.in</a>
                            </p>
                            <p className="text-[var(--grey)]"><strong className="text-white">Website:</strong>{" "}
                                <a href="https://fitosys.alchemetryx.com" className="text-[var(--red)] hover:underline">fitosys.alchemetryx.com</a>
                            </p>
                        </div>
                    </section>
                </div>

                {/* Related Links */}
                <div className="mt-16 flex flex-wrap gap-4">
                    <Link
                        href="/privacy"
                        className="text-[12px] font-bold uppercase tracking-[0.1em] text-[var(--grey)] hover:text-white transition-colors"
                    >
                        Privacy Policy →
                    </Link>
                    <Link
                        href="/terms"
                        className="text-[12px] font-bold uppercase tracking-[0.1em] text-[var(--grey)] hover:text-white transition-colors"
                    >
                        Terms of Service →
                    </Link>
                    <Link
                        href="/"
                        className="text-[12px] font-bold uppercase tracking-[0.1em] text-[var(--grey)] hover:text-white transition-colors"
                    >
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
