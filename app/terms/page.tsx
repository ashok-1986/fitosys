import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Terms of Service — Fitosys",
    description: "Terms governing your use of the Fitosys platform. Read before creating an account.",
};

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-[var(--black)] pt-28 pb-20 px-6">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-16">
                    <div className="inline-block px-3 py-1.5 rounded-sm bg-[rgba(232,0,29,0.08)] border border-[rgba(232,0,29,0.15)] text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--red)] mb-6">
                        Last updated: April 2026
                    </div>
                    <h1 className="text-5xl md:text-6xl font-display font-medium uppercase leading-[0.9] tracking-[0.02em] mb-4">
                        Terms of <span className="text-[var(--red)]">Service</span>
                    </h1>
                    <p className="text-[var(--grey)] text-[15px] leading-relaxed max-w-xl">
                        By using Fitosys, you agree to these terms. Please read them carefully.
                    </p>
                </div>

                {/* Sections */}
                <div className="space-y-0">
                    {/* Section 1 */}
                    <section className="py-10 border-b border-[rgba(255,255,255,0.06)]">
                        <h2 className="text-2xl font-display font-medium uppercase tracking-[0.02em] mb-4">1. Acceptance</h2>
                        <p className="text-[var(--grey)] text-[14px] leading-relaxed">
                            By creating an account or using Fitosys, you agree to these Terms. If you are using Fitosys on behalf of a business, you represent that you have the authority to bind that business to these Terms.
                        </p>
                    </section>

                    {/* Section 2 */}
                    <section className="py-10 border-b border-[rgba(255,255,255,0.06)]">
                        <h2 className="text-2xl font-display font-medium uppercase tracking-[0.02em] mb-4">2. What Fitosys Is</h2>
                        <p className="text-[var(--grey)] text-[14px] leading-relaxed">
                            Fitosys is a SaaS platform that helps independent coaches automate client onboarding, weekly WhatsApp check-ins, and renewal reminders. We are a software tool. <strong className="text-white">We are not a fitness service provider, healthcare provider, or financial advisor.</strong>
                        </p>
                    </section>

                    {/* Section 3 */}
                    <section className="py-10 border-b border-[rgba(255,255,255,0.06)]">
                        <h2 className="text-2xl font-display font-medium uppercase tracking-[0.02em] mb-4">3. Coach Responsibilities</h2>
                        <p className="text-[var(--grey)] text-[14px] leading-relaxed mb-4">
                            Coaches are solely responsible for:
                        </p>
                        <ul className="list-disc list-inside text-[var(--grey)] text-[14px] leading-relaxed space-y-1.5 ml-2 mb-4">
                            <li>The accuracy of information provided to their clients</li>
                            <li>Obtaining client consent before enrolling them on Fitosys</li>
                            <li>Ensuring their coaching services comply with applicable laws</li>
                            <li>Maintaining their own business licences and insurance</li>
                            <li>Client relationships and outcomes</li>
                        </ul>
                        <p className="text-[var(--grey)] text-[14px] leading-relaxed">
                            Fitosys provides the operational infrastructure. The coaching relationship is between the coach and client.
                        </p>
                    </section>

                    {/* Section 4 */}
                    <section className="py-10 border-b border-[rgba(255,255,255,0.06)]">
                        <h2 className="text-2xl font-display font-medium uppercase tracking-[0.02em] mb-4">4. Acceptable Use</h2>
                        <p className="text-[var(--grey)] text-[14px] leading-relaxed mb-4">
                            You must not use Fitosys to:
                        </p>
                        <ul className="list-disc list-inside text-[var(--grey)] text-[14px] leading-relaxed space-y-1.5 ml-2">
                            <li>Send spam or unsolicited messages</li>
                            <li>Enroll clients without their consent</li>
                            <li>Process payments for illegal services</li>
                            <li>Violate WhatsApp Business Policy or Meta&apos;s Platform Terms</li>
                            <li>Reverse-engineer, scrape, or misuse the platform</li>
                        </ul>
                    </section>

                    {/* Section 5 */}
                    <section className="py-10 border-b border-[rgba(255,255,255,0.06)]">
                        <h2 className="text-2xl font-display font-medium uppercase tracking-[0.02em] mb-4">5. Payments and Billing</h2>
                        <p className="text-[var(--grey)] text-[14px] leading-relaxed mb-2">
                            Coach subscriptions are billed monthly via Razorpay. Prices are in Indian Rupees (INR) unless otherwise stated. Subscriptions auto-renew. Cancel at any time from your dashboard.
                        </p>
                        <p className="text-[var(--grey)] text-[14px] leading-relaxed">
                            Client payments flow directly between coaches and clients. <strong className="text-white">Fitosys does not process or hold client payments.</strong>
                        </p>
                    </section>

                    {/* Section 6 */}
                    <section className="py-10 border-b border-[rgba(255,255,255,0.06)]">
                        <h2 className="text-2xl font-display font-medium uppercase tracking-[0.02em] mb-4">6. Refunds</h2>
                        <p className="text-[var(--grey)] text-[14px] leading-relaxed">
                            See our{" "}
                            <Link href="/refund" className="text-[var(--red)] hover:underline">Refund Policy</Link>{" "}
                            for full details.
                        </p>
                    </section>

                    {/* Section 7 */}
                    <section className="py-10 border-b border-[rgba(255,255,255,0.06)]">
                        <h2 className="text-2xl font-display font-medium uppercase tracking-[0.02em] mb-4">7. WhatsApp Usage</h2>
                        <p className="text-[var(--grey)] text-[14px] leading-relaxed mb-4">
                            By using Fitosys, coaches agree to:
                        </p>
                        <ul className="list-disc list-inside text-[var(--grey)] text-[14px] leading-relaxed space-y-1.5 ml-2 mb-4">
                            <li>Comply with WhatsApp Business Policy and Meta&apos;s Terms of Service</li>
                            <li>Only send messages to clients who have explicitly opted in</li>
                            <li>Honour opt-out requests immediately</li>
                            <li>Not use Fitosys to send prohibited content per WhatsApp&apos;s policies</li>
                        </ul>
                        <p className="text-[var(--grey)] text-[14px] leading-relaxed">
                            Fitosys may suspend WhatsApp features if Meta restricts the platform number due to policy violations caused by a coach&apos;s usage.
                        </p>
                    </section>

                    {/* Section 8 */}
                    <section className="py-10 border-b border-[rgba(255,255,255,0.06)]">
                        <h2 className="text-2xl font-display font-medium uppercase tracking-[0.02em] mb-4">8. Data and Privacy</h2>
                        <p className="text-[var(--grey)] text-[14px] leading-relaxed mb-2">
                            See our{" "}
                            <Link href="/privacy" className="text-[var(--red)] hover:underline">Privacy Policy</Link>{" "}
                            for full details.
                        </p>
                        <p className="text-[var(--grey)] text-[14px] leading-relaxed">
                            Coaches are data fiduciaries for their client data under India&apos;s DPDP Act 2023. Fitosys acts as a data processor on behalf of coaches.
                        </p>
                    </section>

                    {/* Section 9 */}
                    <section className="py-10 border-b border-[rgba(255,255,255,0.06)]">
                        <h2 className="text-2xl font-display font-medium uppercase tracking-[0.02em] mb-4">9. Intellectual Property</h2>
                        <p className="text-[var(--grey)] text-[14px] leading-relaxed">
                            Fitosys, the Fitosys name, logo, and all product features are owned by Alchemetryx Consulting Pvt Ltd. You may not use our brand without written permission.
                        </p>
                    </section>

                    {/* Section 10 */}
                    <section className="py-10 border-b border-[rgba(255,255,255,0.06)]">
                        <h2 className="text-2xl font-display font-medium uppercase tracking-[0.02em] mb-4">10. Limitation of Liability</h2>
                        <p className="text-[var(--grey)] text-[14px] leading-relaxed mb-4">
                            Fitosys is provided &quot;as is.&quot; We are not liable for:
                        </p>
                        <ul className="list-disc list-inside text-[var(--grey)] text-[14px] leading-relaxed space-y-1.5 ml-2 mb-4">
                            <li>Indirect, incidental, or consequential damages</li>
                            <li>Revenue loss due to platform downtime or WhatsApp delivery failures</li>
                            <li>Actions taken by coaches towards their clients</li>
                            <li>Third-party service failures (Razorpay, Meta, Supabase, Gemini)</li>
                        </ul>
                        <p className="text-[var(--grey)] text-[14px] leading-relaxed">
                            Our total liability to any coach is limited to the subscription fees paid in the 3 months preceding the claim.
                        </p>
                    </section>

                    {/* Section 11 */}
                    <section className="py-10 border-b border-[rgba(255,255,255,0.06)]">
                        <h2 className="text-2xl font-display font-medium uppercase tracking-[0.02em] mb-4">11. Termination</h2>
                        <p className="text-[var(--grey)] text-[14px] leading-relaxed">
                            We may suspend or terminate accounts that violate these Terms, with or without notice. Coaches may cancel at any time. Data is retained per the{" "}
                            <Link href="/privacy" className="text-[var(--red)] hover:underline">Privacy Policy</Link>{" "}
                            and then deleted.
                        </p>
                    </section>

                    {/* Section 12 */}
                    <section className="py-10 border-b border-[rgba(255,255,255,0.06)]">
                        <h2 className="text-2xl font-display font-medium uppercase tracking-[0.02em] mb-4">12. Governing Law</h2>
                        <p className="text-[var(--grey)] text-[14px] leading-relaxed">
                            These Terms are governed by the laws of India. Disputes shall be subject to the exclusive jurisdiction of courts in Mumbai, India.
                        </p>
                    </section>

                    {/* Section 13 */}
                    <section className="py-10 border-b border-[rgba(255,255,255,0.06)]">
                        <h2 className="text-2xl font-display font-medium uppercase tracking-[0.02em] mb-4">13. Contact</h2>
                        <div className="bg-[var(--surface)] border border-[rgba(255,255,255,0.06)] rounded-lg p-6 space-y-2 text-[14px]">
                            <p className="text-[var(--grey)]"><strong className="text-white">Company:</strong> Alchemetryx Consulting Pvt Ltd</p>
                            <p className="text-[var(--grey)]"><strong className="text-white">Email:</strong>{" "}
                                <a href="mailto:support@fitosys.in" className="text-[var(--red)] hover:underline">support@fitosys.in</a>
                            </p>
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
