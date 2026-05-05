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
                        Last updated: May 2026
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
                        <p className="text-[var(--grey)] text-[14px] leading-relaxed mb-6">
                            Alchemetryx Consulting Pvt Ltd operates Fitosys, a SaaS platform for independent fitness, wellness, and yoga coaches. We are registered in India. Our platform is accessible at{" "}
                            <a href="https://fitosys.alchemetryx.com" className="text-white hover:text-[var(--red)] transition-colors underline underline-offset-2">fitosys.alchemetryx.com</a>.
                        </p>
                        <div className="space-y-4 text-[var(--grey)] text-[14px] leading-relaxed">
                            <div>
                                <p className="text-white font-medium">Data Controller (India — DPDP Act 2023):</p>
                                <p>Alchemetryx Consulting Private Limited</p>
                                <p>Email: <a href="mailto:fitosys@alchemetryx.com" className="text-[var(--red)] hover:underline">fitosys@alchemetryx.com</a></p>
                            </div>
                            <div>
                                <p className="text-white font-medium">Data Controller (UK/EU — GDPR):</p>
                                <p>Alchemetryx Consulting Private Limited</p>
                                <p>Email: <a href="mailto:fitosys@alchemetryx.com" className="text-[var(--red)] hover:underline">fitosys@alchemetryx.com</a></p>
                            </div>
                            <p>
                                Data Processors acting on our behalf are listed in Section 5 of this policy.
                            </p>
                        </div>
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
                                        <th className="text-left py-3 pr-4 text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--grey)]">Data Processed</th>
                                        <th className="text-left py-3 pr-4 text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--grey)]">Legal Basis</th>
                                        <th className="text-left py-3 text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--grey)]">Privacy Policy</th>
                                    </tr>
                                </thead>
                                <tbody className="text-[var(--grey)]">
                                    <tr className="border-b border-[rgba(255,255,255,0.04)]">
                                        <td className="py-3 pr-4 text-white font-medium">Supabase (ap-south-1, Mumbai)</td>
                                        <td className="py-3 pr-4">Database hosting and authentication</td>
                                        <td className="py-3 pr-4">All user and client data</td>
                                        <td className="py-3 pr-4">Contract</td>
                                        <td className="py-3"><a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[var(--red)] hover:underline">supabase.com/privacy</a></td>
                                    </tr>
                                    <tr className="border-b border-[rgba(255,255,255,0.04)]">
                                        <td className="py-3 pr-4 text-white font-medium">Vercel (Global Edge Network)</td>
                                        <td className="py-3 pr-4">Application hosting, serverless functions, edge computing</td>
                                        <td className="py-3 pr-4">IP addresses, request logs, application data</td>
                                        <td className="py-3 pr-4">Contract</td>
                                        <td className="py-3"><a href="https://vercel.com/legal/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-[var(--red)] hover:underline">vercel.com/legal/privacy-policy</a></td>
                                    </tr>
                                    <tr className="border-b border-[rgba(255,255,255,0.04)]">
                                        <td className="py-3 pr-4 text-white font-medium">Razorpay</td>
                                        <td className="py-3 pr-4">Payment processing and subscription billing</td>
                                        <td className="py-3 pr-4">Payment details, name, email, billing address</td>
                                        <td className="py-3 pr-4">Contract + Legal obligation</td>
                                        <td className="py-3"><a href="https://razorpay.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[var(--red)] hover:underline">razorpay.com/privacy</a></td>
                                    </tr>
                                    <tr className="border-b border-[rgba(255,255,255,0.04)]">
                                        <td className="py-3 pr-4 text-white font-medium">Meta / WhatsApp Business Platform</td>
                                        <td className="py-3 pr-4">Message delivery and WhatsApp API infrastructure</td>
                                        <td className="py-3 pr-4">Phone numbers, message content, delivery status</td>
                                        <td className="py-3 pr-4">Contract + Consent</td>
                                        <td className="py-3"><a href="https://www.facebook.com/policy" target="_blank" rel="noopener noreferrer" className="text-[var(--red)] hover:underline">facebook.com/policy</a></td>
                                    </tr>
                                    <tr className="border-b border-[rgba(255,255,255,0.04)]">
                                        <td className="py-3 pr-4 text-white font-medium">Google (Gemini API)</td>
                                        <td className="py-3 pr-4">AI-powered weekly coaching summary generation</td>
                                        <td className="py-3 pr-4">Check-in response text only — no names or phone numbers transmitted</td>
                                        <td className="py-3 pr-4">Contract</td>
                                        <td className="py-3"><a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[var(--red)] hover:underline">policies.google.com/privacy</a></td>
                                    </tr>
                                    <tr className="border-b border-[rgba(255,255,255,0.04)]">
                                        <td className="py-3 pr-4 text-white font-medium">Resend</td>
                                        <td className="py-3 pr-4">Transactional email delivery</td>
                                        <td className="py-3 pr-4">Name, email address, invoice PDF</td>
                                        <td className="py-3 pr-4">Contract</td>
                                        <td className="py-3"><a href="https://resend.com/privacy" target="_blank" rel="noopener noreferrer" className="text-[var(--red)] hover:underline">resend.com/privacy</a></td>
                                    </tr>
                                    <tr>
                                        <td className="py-3 pr-4 text-white font-medium">OpenRouter</td>
                                        <td className="py-3 pr-4">AI program description generation</td>
                                        <td className="py-3 pr-4">Program title and category only — no PII transmitted</td>
                                        <td className="py-3 pr-4">Contract</td>
                                        <td className="py-3"><a href="https://openrouter.ai/privacy" target="_blank" rel="noopener noreferrer" className="text-[var(--red)] hover:underline">openrouter.ai/privacy</a></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="text-[var(--grey)] text-[14px] leading-relaxed mt-6">
                            <strong className="text-white">We never sell your data. We never share it for advertising purposes.</strong>
                        </p>
                    </section>

                    {/* Section 5A */}
                    <section className="py-10 border-b border-[rgba(255,255,255,0.06)]">
                        <h2 className="text-2xl font-display font-medium uppercase tracking-[0.02em] mb-4">5A. Meta Platform Data</h2>
                        <p className="text-[var(--grey)] text-[14px] leading-relaxed mb-4">
                            Fitosys uses Meta&apos;s WhatsApp Business Platform to send automated messages to clients on behalf of coaches. We access and process the following Meta Platform Data:
                        </p>
                        <ul className="list-disc list-inside text-[var(--grey)] text-[14px] leading-relaxed space-y-1.5 ml-2 mb-6">
                            <li>WhatsApp phone numbers of enrolled clients</li>
                            <li>Message delivery status and read receipts</li>
                            <li>WhatsApp Business Account (WABA) information</li>
                            <li>Message template performance data</li>
                        </ul>

                        <h3 className="text-lg font-display font-medium uppercase tracking-[0.02em] mb-3">How we use Meta Platform Data</h3>
                        <ul className="list-disc list-inside text-[var(--grey)] text-[14px] leading-relaxed space-y-1.5 ml-2 mb-6">
                            <li>To deliver automated weekly check-in messages to clients</li>
                            <li>To send program renewal reminders to clients</li>
                            <li>To send enrollment confirmation messages</li>
                            <li>To monitor message delivery quality</li>
                        </ul>

                        <h3 className="text-lg font-display font-medium uppercase tracking-[0.02em] mb-3">How we do NOT use Meta Platform Data</h3>
                        <ul className="list-disc list-inside text-[var(--grey)] text-[14px] leading-relaxed space-y-1.5 ml-2 mb-6">
                            <li>We do not use it for advertising or marketing purposes</li>
                            <li>We do not sell or transfer it to third parties</li>
                            <li>We do not use it to build profiles beyond the coaching relationship</li>
                            <li>We do not combine it with data from other Meta products for targeting</li>
                        </ul>

                        <p className="text-[var(--grey)] text-[14px] leading-relaxed mb-4">
                            <strong className="text-white">Retention:</strong> Meta Platform Data is retained for 1 year rolling in our WhatsApp message log and then permanently deleted.
                        </p>
                        <p className="text-[var(--grey)] text-[14px] leading-relaxed">
                            <strong className="text-white">Compliance:</strong> Our use of Meta Platform Data complies with Meta&apos;s Platform Terms and WhatsApp Business Policy. Coaches are responsible for ensuring clients have provided consent before enrollment.
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
                            <li>Right to erase your data (submit request to <a href="mailto:fitosys@alchemetryx.com" className="text-[var(--red)] hover:underline">fitosys@alchemetryx.com</a>)</li>
                            <li>Right to withdraw consent at any time</li>
                            <li>Right to nominate a representative for data access</li>
                        </ul>

                        <h3 className="text-lg font-display font-medium uppercase tracking-[0.02em] mb-3">UK / EU (GDPR)</h3>
                        <ul className="list-disc list-inside text-[var(--grey)] text-[14px] leading-relaxed space-y-1.5 ml-2 mb-6">
                            <li>All above rights plus right to data portability and restriction of processing</li>
                            <li>Right to lodge a complaint with the ICO (<a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-[var(--red)] hover:underline">ico.org.uk</a>)</li>
                        </ul>

                        <p className="text-[var(--grey)] text-[14px] leading-relaxed">
                            To exercise any right, email: <a href="mailto:fitosys@alchemetryx.com" className="text-[var(--red)] hover:underline">fitosys@alchemetryx.com</a>. Response within 30 days.
                        </p>
                    </section>

                    {/* Section 8A */}
                    <section className="py-10 border-b border-[rgba(255,255,255,0.06)]">
                        <h2 className="text-2xl font-display font-medium uppercase tracking-[0.02em] mb-4">8A. Public Authority and Government Data Requests</h2>

                        <div className="space-y-4 text-[var(--grey)] text-[14px] leading-relaxed">
                            <div>
                                <p className="text-white font-medium mb-1">Required legal review:</p>
                                <p>All requests from public authorities for user data undergo mandatory legal review before any data is disclosed. We do not comply with informal or unverified requests.</p>
                            </div>
                            <div>
                                <p className="text-white font-medium mb-1">Challenging unlawful requests:</p>
                                <p>We reserve the right to challenge any request we believe to be overbroad or unlawful. Where legally permitted, we will notify affected users before disclosing their data.</p>
                            </div>
                            <div>
                                <p className="text-white font-medium mb-1">Data minimization:</p>
                                <p>In response to any lawful authority request, we disclose only the minimum data required to satisfy the specific legal obligation.</p>
                            </div>
                            <div>
                                <p className="text-white font-medium mb-1">Documentation:</p>
                                <p>We maintain records of all public authority requests received, the legal basis cited, and the data disclosed. Records retained for 7 years.</p>
                            </div>
                            <div>
                                <p className="text-white font-medium mb-1">History:</p>
                                <p>Fitosys has received zero public authority or national security requests for user data since inception (as of May 2026).</p>
                            </div>
                        </div>
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
                                <a href="mailto:fitosys@alchemetryx.com" className="text-[var(--red)] hover:underline">fitosys@alchemetryx.com</a>
                            </p>
                            <p className="text-[var(--grey)]"><strong className="text-white">Phone:</strong> +917738363495</p>
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
