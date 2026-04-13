import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    title: "Privacy Policy — Fitosys",
    description: "How Fitosys collects, uses, and protects your data. Compliant with India's DPDP Act 2023 and GDPR.",
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-[var(--black)] pt-28 pb-20 px-6">
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="mb-16">
                    <div className="inline-block px-3 py-1.5 rounded-sm bg-[rgba(232,0,29,0.08)] border border-[rgba(232,0,29,0.15)] text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--red)] mb-6">
                        Last updated: April 2026
                    </div>
                    <h1 className="text-5xl md:text-6xl font-display font-medium uppercase leading-[0.9] tracking-[0.02em] mb-4">
                        Privacy <span className="text-[var(--red)]">Policy</span>
                    </h1>
                    <p className="text-[var(--grey)] text-[15px] leading-relaxed max-w-xl">
                        This policy explains how Alchemetryx Consulting Pvt Ltd handles your data when you use Fitosys. Written in plain English — no legalese.
                    </p>
                </div>

                {/* Sections */}
                <div className="space-y-0">
                    {/* Section 1 */}
                    <section className="py-10 border-b border-[rgba(255,255,255,0.06)]">
                        <h2 className="text-2xl font-display font-medium uppercase tracking-[0.02em] mb-4">1. Who We Are</h2>
                        <p className="text-[var(--grey)] text-[14px] leading-relaxed">
                            Alchemetryx Consulting Pvt Ltd operates Fitosys, a SaaS platform for independent fitness, wellness, and yoga coaches. We are registered in India. Our platform is accessible at{" "}
                            <a href="https://fitosys.alchemetryx.com" className="text-white hover:text-[var(--red)] transition-colors underline underline-offset-2">fitosys.alchemetryx.com</a>.
                        </p>
                    </section>

                    {/* Section 2 */}
                    <section className="py-10 border-b border-[rgba(255,255,255,0.06)]">
                        <h2 className="text-2xl font-display font-medium uppercase tracking-[0.02em] mb-4">2. What Data We Collect</h2>
                        <p className="text-[var(--grey)] text-[14px] leading-relaxed mb-6">
                            Fitosys has two types of users: <strong className="text-white">Coaches</strong> and their <strong className="text-white">Clients</strong>.
                        </p>

                        <h3 className="text-lg font-display font-medium uppercase tracking-[0.02em] mb-3">Coach Data</h3>
                        <ul className="list-disc list-inside text-[var(--grey)] text-[14px] leading-relaxed space-y-1.5 mb-6 ml-2">
                            <li>Full name, email address, WhatsApp number</li>
                            <li>Coaching type, timezone, check-in preferences</li>
                            <li>Razorpay payment details (processed by Razorpay, not stored by us)</li>
                            <li>GST number, business name, billing address (optional, for invoice generation)</li>
                            <li>IP address (for security and rate limiting, retained 90 days)</li>
                        </ul>

                        <h3 className="text-lg font-display font-medium uppercase tracking-[0.02em] mb-3">Client Data (collected on behalf of coaches)</h3>
                        <ul className="list-disc list-inside text-[var(--grey)] text-[14px] leading-relaxed space-y-1.5 ml-2">
                            <li>Full name, WhatsApp number, email address, age</li>
                            <li>Primary fitness/wellness goal</li>
                            <li>Health notes (optional, provided voluntarily)</li>
                            <li>Weekly check-in responses (energy scores, sessions completed, free-text notes)</li>
                            <li>Payment records (Razorpay payment ID, amount, date)</li>
                            <li>Enrollment start and end dates</li>
                            <li>Consent timestamps</li>
                        </ul>
                    </section>

                    {/* Section 3 */}
                    <section className="py-10 border-b border-[rgba(255,255,255,0.06)]">
                        <h2 className="text-2xl font-display font-medium uppercase tracking-[0.02em] mb-4">3. Why We Collect It (Legal Basis)</h2>
                        <ul className="space-y-3 text-[14px]">
                            <li className="flex gap-3">
                                <span className="text-[var(--red)] font-bold shrink-0">•</span>
                                <span className="text-[var(--grey)]"><strong className="text-white">Coach account data:</strong> Contract — necessary to deliver the service</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-[var(--red)] font-bold shrink-0">•</span>
                                <span className="text-[var(--grey)]"><strong className="text-white">Client personal data:</strong> Legitimate interest of coach (coaching relationship) + explicit consent</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-[var(--red)] font-bold shrink-0">•</span>
                                <span className="text-[var(--grey)]"><strong className="text-white">Health data</strong> (energy scores, wellness notes): Explicit consent — collected only with specific opt-in</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-[var(--red)] font-bold shrink-0">•</span>
                                <span className="text-[var(--grey)]"><strong className="text-white">Payment data:</strong> Contract + Legal obligation (GST/tax records, retained 7 years)</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-[var(--red)] font-bold shrink-0">•</span>
                                <span className="text-[var(--grey)]"><strong className="text-white">WhatsApp communication data:</strong> Explicit consent — collected via intake form opt-in</span>
                            </li>
                            <li className="flex gap-3">
                                <span className="text-[var(--red)] font-bold shrink-0">•</span>
                                <span className="text-[var(--grey)]"><strong className="text-white">IP addresses:</strong> Legitimate interest (fraud prevention, platform security)</span>
                            </li>
                        </ul>
                    </section>

                    {/* Section 4 */}
                    <section className="py-10 border-b border-[rgba(255,255,255,0.06)]">
                        <h2 className="text-2xl font-display font-medium uppercase tracking-[0.02em] mb-4">4. How We Use Your Data</h2>
                        <ul className="list-disc list-inside text-[var(--grey)] text-[14px] leading-relaxed space-y-1.5 ml-2">
                            <li>Deliver automated WhatsApp check-ins and renewal reminders</li>
                            <li>Generate AI-powered weekly coaching summaries (processed by Google Gemini API)</li>
                            <li>Generate GST-compliant invoices</li>
                            <li>Enable coach dashboard and client management</li>
                            <li>Improve platform performance and reliability</li>
                        </ul>
                    </section>

                    {/* Section 5 */}
                    <section className="py-10 border-b border-[rgba(255,255,255,0.06)]">
                        <h2 className="text-2xl font-display font-medium uppercase tracking-[0.02em] mb-4">5. Who We Share Data With</h2>
                        <div className="overflow-x-auto -mx-2 px-2">
                            <table className="w-full text-[13px] border-collapse">
                                <thead>
                                    <tr className="border-b border-[rgba(255,255,255,0.1)]">
                                        <th className="text-left py-3 pr-4 text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--grey)]">Third Party</th>
                                        <th className="text-left py-3 pr-4 text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--grey)]">Role</th>
                                        <th className="text-left py-3 pr-4 text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--grey)]">Data Shared</th>
                                        <th className="text-left py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--grey)]">Privacy Policy</th>
                                    </tr>
                                </thead>
                                <tbody className="text-[var(--grey)]">
                                    <tr className="border-b border-[rgba(255,255,255,0.04)]">
                                        <td className="py-3 pr-4 text-white font-medium">Supabase</td>
                                        <td className="py-3 pr-4">Database and auth</td>
                                        <td className="py-3 pr-4">All user data</td>
                                        <td className="py-3"><a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[var(--red)] hover:underline">supabase.com/privacy</a></td>
                                    </tr>
                                    <tr className="border-b border-[rgba(255,255,255,0.04)]">
                                        <td className="py-3 pr-4 text-white font-medium">Razorpay</td>
                                        <td className="py-3 pr-4">Payment processing</td>
                                        <td className="py-3 pr-4">Payment details, name, email</td>
                                        <td className="py-3"><a href="https://razorpay.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[var(--red)] hover:underline">razorpay.com/privacy</a></td>
                                    </tr>
                                    <tr className="border-b border-[rgba(255,255,255,0.04)]">
                                        <td className="py-3 pr-4 text-white font-medium">Meta / WhatsApp</td>
                                        <td className="py-3 pr-4">Message delivery</td>
                                        <td className="py-3 pr-4">Name, phone number, message content</td>
                                        <td className="py-3"><a href="https://www.facebook.com/policy" target="_blank" rel="noopener noreferrer" className="text-[var(--red)] hover:underline">facebook.com/policy</a></td>
                                    </tr>
                                    <tr className="border-b border-[rgba(255,255,255,0.04)]">
                                        <td className="py-3 pr-4 text-white font-medium">Google (Gemini)</td>
                                        <td className="py-3 pr-4">AI summary generation</td>
                                        <td className="py-3 pr-4">Check-in response text (no PII)</td>
                                        <td className="py-3"><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[var(--red)] hover:underline">policies.google.com/privacy</a></td>
                                    </tr>
                                    <tr className="border-b border-[rgba(255,255,255,0.04)]">
                                        <td className="py-3 pr-4 text-white font-medium">Resend</td>
                                        <td className="py-3 pr-4">Transactional email</td>
                                        <td className="py-3 pr-4">Name, email, invoice PDF</td>
                                        <td className="py-3"><a href="https://resend.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[var(--red)] hover:underline">resend.com/privacy</a></td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 pr-4 text-white font-medium">Vercel</td>
                                        <td className="py-3 pr-4">Hosting and edge functions</td>
                                        <td className="py-3 pr-4">IP address, request logs</td>
                                        <td className="py-3"><a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[var(--red)] hover:underline">vercel.com/legal/privacy-policy</a></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="text-[var(--grey)] text-[14px] leading-relaxed mt-6">
                            <strong className="text-white">We never sell your data. We never share it for advertising purposes.</strong>
                        </p>
                    </section>

                    {/* Section 6 */}
                    <section className="py-10 border-b border-[rgba(255,255,255,0.06)]">
                        <h2 className="text-2xl font-display font-medium uppercase tracking-[0.02em] mb-4">6. Where Your Data Is Stored</h2>
                        <ul className="list-disc list-inside text-[var(--grey)] text-[14px] leading-relaxed space-y-1.5 ml-2">
                            <li><strong className="text-white">Primary database:</strong> Supabase (region: ap-south-1, Mumbai, India)</li>
                            <li><strong className="text-white">File storage</strong> (invoices): Supabase Storage (same region)</li>
                            <li><strong className="text-white">Hosting:</strong> Vercel (global edge network)</li>
                            <li><strong className="text-white">AI processing:</strong> Google Gemini API (check-in text only, no names or phone numbers sent)</li>
                        </ul>
                    </section>

                    {/* Section 7 */}
                    <section className="py-10 border-b border-[rgba(255,255,255,0.06)]">
                        <h2 className="text-2xl font-display font-medium uppercase tracking-[0.02em] mb-4">7. How Long We Keep Your Data</h2>
                        <ul className="list-disc list-inside text-[var(--grey)] text-[14px] leading-relaxed space-y-1.5 ml-2">
                            <li><strong className="text-white">Coach and client records:</strong> 3 years from last active date</li>
                            <li><strong className="text-white">Payment and invoice records:</strong> 7 years (Indian tax law requirement)</li>
                            <li><strong className="text-white">WhatsApp message logs:</strong> 1 year rolling</li>
                            <li><strong className="text-white">IP addresses:</strong> 90 days</li>
                            <li><strong className="text-white">Deleted accounts:</strong> PII wiped within 30 days, anonymised payment records retained for tax</li>
                        </ul>
                    </section>

                    {/* Section 8 */}
                    <section className="py-10 border-b border-[rgba(255,255,255,0.06)]">
                        <h2 className="text-2xl font-display font-medium uppercase tracking-[0.02em] mb-4">8. Your Rights</h2>

                        <h3 className="text-lg font-display font-medium uppercase tracking-[0.02em] mb-3">India (DPDP Act 2023)</h3>
                        <ul className="list-disc list-inside text-[var(--grey)] text-[14px] leading-relaxed space-y-1.5 ml-2 mb-6">
                            <li>Right to access your data</li>
                            <li>Right to correct inaccurate data</li>
                            <li>Right to erase your data (submit request to <a href="mailto:support@fitosys.in" className="text-[var(--red)] hover:underline">support@fitosys.in</a>)</li>
                            <li>Right to withdraw consent at any time</li>
                            <li>Right to nominate a representative for data access</li>
                        </ul>

                        <h3 className="text-lg font-display font-medium uppercase tracking-[0.02em] mb-3">UK / EU (GDPR)</h3>
                        <ul className="list-disc list-inside text-[var(--grey)] text-[14px] leading-relaxed space-y-1.5 ml-2 mb-6">
                            <li>All above rights plus right to data portability and restriction of processing</li>
                            <li>Right to lodge a complaint with the ICO (<a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-[var(--red)] hover:underline">ico.org.uk</a>)</li>
                        </ul>

                        <p className="text-[var(--grey)] text-[14px] leading-relaxed">
                            To exercise any right, email: <a href="mailto:support@fitosys.in" className="text-[var(--red)] hover:underline">support@fitosys.in</a>. Response within 30 days.
                        </p>
                    </section>

                    {/* Section 9 */}
                    <section className="py-10 border-b border-[rgba(255,255,255,0.06)]">
                        <h2 className="text-2xl font-display font-medium uppercase tracking-[0.02em] mb-4">9. WhatsApp Communications</h2>
                        <p className="text-[var(--grey)] text-[14px] leading-relaxed mb-4">
                            Fitosys sends automated WhatsApp messages on behalf of coaches to their clients. These include:
                        </p>
                        <ul className="list-disc list-inside text-[var(--grey)] text-[14px] leading-relaxed space-y-1.5 ml-2 mb-4">
                            <li>Weekly check-in messages (every Sunday)</li>
                            <li>Program renewal reminders</li>
                            <li>Enrollment confirmation messages</li>
                        </ul>
                        <p className="text-[var(--grey)] text-[14px] leading-relaxed mb-2">
                            These messages are sent only to clients who have explicitly opted in on the enrollment form.
                        </p>
                        <p className="text-[var(--grey)] text-[14px] leading-relaxed">
                            Clients can opt out at any time by replying <strong className="text-white">STOP</strong> to any message or contacting their coach. See our{" "}
                            <Link href="/whatsapp-opt-in" className="text-[var(--red)] hover:underline">WhatsApp Communication Policy</Link>.
                        </p>
                    </section>

                    {/* Section 10 */}
                    <section className="py-10 border-b border-[rgba(255,255,255,0.06)]">
                        <h2 className="text-2xl font-display font-medium uppercase tracking-[0.02em] mb-4">10. Cookies</h2>
                        <p className="text-[var(--grey)] text-[14px] leading-relaxed">
                            We use only essential cookies for authentication (httpOnly, secure). No advertising cookies. No third-party tracking pixels. No cookie consent banner required.
                        </p>
                    </section>

                    {/* Section 11 */}
                    <section className="py-10 border-b border-[rgba(255,255,255,0.06)]">
                        <h2 className="text-2xl font-display font-medium uppercase tracking-[0.02em] mb-4">11. Children</h2>
                        <p className="text-[var(--grey)] text-[14px] leading-relaxed">
                            Our platform is not intended for users under 18. Coaches must not enroll clients under 18 without verified parental consent. We do not knowingly collect data from minors.
                        </p>
                    </section>

                    {/* Section 12 */}
                    <section className="py-10 border-b border-[rgba(255,255,255,0.06)]">
                        <h2 className="text-2xl font-display font-medium uppercase tracking-[0.02em] mb-4">12. Changes to This Policy</h2>
                        <p className="text-[var(--grey)] text-[14px] leading-relaxed">
                            We will notify coaches via email and dashboard notification before material changes take effect. Continued use after the effective date constitutes acceptance.
                        </p>
                    </section>

                    {/* Section 13 */}
                    <section className="py-10 border-b border-[rgba(255,255,255,0.06)]">
                        <h2 className="text-2xl font-display font-medium uppercase tracking-[0.02em] mb-4">13. Contact and Grievance Officer</h2>
                        <p className="text-[var(--grey)] text-[14px] leading-relaxed mb-4">
                            For privacy concerns or to exercise your rights:
                        </p>
                        <div className="bg-[var(--surface)] border border-[rgba(255,255,255,0.06)] rounded-lg p-6 space-y-2 text-[14px]">
                            <p className="text-[var(--grey)]"><strong className="text-white">Email:</strong>{" "}
                                <a href="mailto:support@fitosys.in" className="text-[var(--red)] hover:underline">support@fitosys.in</a>
                            </p>
                            <p className="text-[var(--grey)]"><strong className="text-white">Grievance Officer (India):</strong> Ashok Kumar, Alchemetryx Consulting Pvt Ltd</p>
                            <p className="text-[var(--grey)]"><strong className="text-white">Response time:</strong> Within 30 days</p>
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
