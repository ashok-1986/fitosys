import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Refund Policy — Fitosys",
    description: "Fitosys refund policy for coach subscriptions and client payments. Required by Razorpay.",
};

export default function RefundPage() {
    return (
        <div className="min-h-screen bg-[var(--black)] pt-28 pb-20 px-6">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-16">
                    <div className="inline-block px-3 py-1.5 rounded-sm bg-[rgba(232,0,29,0.08)] border border-[rgba(232,0,29,0.15)] text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--red)] mb-6">
                        Last updated: April 2026
                    </div>
                    <h1 className="text-5xl md:text-6xl font-display font-medium uppercase leading-[0.9] tracking-[0.02em] mb-4">
                        Refund <span className="text-[var(--red)]">Policy</span>
                    </h1>
                    <p className="text-[var(--grey)] text-[15px] leading-relaxed max-w-xl">
                        Our refund policy for Fitosys coach subscriptions and client payments.
                    </p>
                </div>

                {/* Sections */}
                <div className="space-y-0">
                    {/* Section 1 */}
                    <section className="py-10 border-b border-[rgba(255,255,255,0.06)]">
                        <h2 className="text-2xl font-display font-medium uppercase tracking-[0.02em] mb-4">1. Coach Subscriptions (Fitosys Plans)</h2>
                        <ul className="space-y-4 text-[14px]">
                            <li className="flex gap-3">
                                <span className="text-[var(--red)] font-bold shrink-0">•</span>
                                <span className="text-[var(--grey)]"><strong className="text-white">Monthly subscriptions:</strong> No refunds after billing date. Cancel anytime to stop future charges.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-[var(--red)] font-bold shrink-0">•</span>
                                <span className="text-[var(--grey)]"><strong className="text-white">Annual subscriptions:</strong> Prorated refund available within 30 days of purchase. No refunds after 30 days.</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-[var(--red)] font-bold shrink-0">•</span>
                                <span className="text-[var(--grey)]"><strong className="text-white">Trial period:</strong> No charge during trial. Cancel before trial ends to avoid billing.</span>
                            </li>
                        </ul>
                    </section>

                    {/* Section 2 */}
                    <section className="py-10 border-b border-[rgba(255,255,255,0.06)]">
                        <h2 className="text-2xl font-display font-medium uppercase tracking-[0.02em] mb-4">2. Accidental Duplicate Charges</h2>
                        <p className="text-[var(--grey)] text-[14px] leading-relaxed">
                            If you are charged twice in the same billing cycle, contact{" "}
                            <a href="mailto:support@fitosys.in" className="text-[var(--red)] hover:underline">support@fitosys.in</a>{" "}
                            within 7 days. We will verify and refund the duplicate charge within 5–7 business days.
                        </p>
                    </section>

                    {/* Section 3 */}
                    <section className="py-10 border-b border-[rgba(255,255,255,0.06)]">
                        <h2 className="text-2xl font-display font-medium uppercase tracking-[0.02em] mb-4">3. Client Payments (Coach-to-Client)</h2>
                        <p className="text-[var(--grey)] text-[14px] leading-relaxed mb-2">
                            Client payments are made directly to coaches via UPI. <strong className="text-white">Fitosys does not process or hold these payments.</strong>
                        </p>
                        <p className="text-[var(--grey)] text-[14px] leading-relaxed">
                            Refund disputes between coaches and their clients are to be resolved between them directly. Fitosys is not a party to coach-client payment transactions.
                        </p>
                    </section>

                    {/* Section 4 */}
                    <section className="py-10 border-b border-[rgba(255,255,255,0.06)]">
                        <h2 className="text-2xl font-display font-medium uppercase tracking-[0.02em] mb-4">4. How to Request a Refund</h2>
                        <div className="bg-[var(--surface)] border border-[rgba(255,255,255,0.06)] rounded-lg p-6 space-y-3 text-[14px]">
                            <p className="text-[var(--grey)]"><strong className="text-white">Email:</strong>{" "}
                                <a href="mailto:support@fitosys.in" className="text-[var(--red)] hover:underline">support@fitosys.in</a>
                            </p>
                            <p className="text-[var(--grey)]"><strong className="text-white">Subject line:</strong> Refund Request — [your registered email]</p>
                            <p className="text-[var(--grey)]"><strong className="text-white">Include:</strong> Razorpay payment ID, date of charge, reason</p>
                            <p className="text-[var(--grey)]"><strong className="text-white">Response time:</strong> Within 2 business days</p>
                        </div>
                    </section>
                </div>

                {/* Back Link */}
                <div className="mt-16">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.1em] text-[var(--grey)] hover:text-white transition-colors"
                    >
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
