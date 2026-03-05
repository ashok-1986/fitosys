import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-background">
            <nav className="border-b border-border bg-card">
                <div className="max-w-3xl mx-auto px-4 h-16 flex items-center">
                    <Link href="/">
                        <h1 className="text-xl font-bold tracking-tight">
                            <span className="text-brand">Fito</span>
                            <span className="text-foreground">sys</span>
                        </h1>
                    </Link>
                </div>
            </nav>
            <div className="max-w-3xl mx-auto px-4 py-12">
                <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
                <div className="prose prose-sm text-muted-foreground space-y-4">
                    <p>Last updated: February 2026</p>
                    <h2 className="text-lg font-semibold text-foreground">1. Information We Collect</h2>
                    <p>We collect information you provide directly: name, email, WhatsApp number, and coaching business details. For your clients, we collect the information submitted through the intake form including contact details, health goals, and check-in responses.</p>
                    <h2 className="text-lg font-semibold text-foreground">2. How We Use Information</h2>
                    <p>Your data is used to operate the Fitosys platform: sending automated WhatsApp messages, generating AI coaching summaries, and processing payments through Razorpay. We never use your data for advertising.</p>
                    <h2 className="text-lg font-semibold text-foreground">3. Data Isolation</h2>
                    <p>Each coach's data is strictly isolated. Row-level security ensures no coach can access another coach's client data under any circumstance.</p>
                    <h2 className="text-lg font-semibold text-foreground">4. Third-Party Services</h2>
                    <p>We use Supabase (database), Razorpay (payments), WhatsApp Business API (messaging), and an AI provider (AI summaries). Each has its own privacy policy. We do not store raw card numbers — Razorpay handles all payment data.</p>
                    <h2 className="text-lg font-semibold text-foreground">5. Data Retention</h2>
                    <p>Your data is retained for the duration of your subscription plus 90 days. You may request full data deletion at any time by contacting us.</p>
                    <h2 className="text-lg font-semibold text-foreground">6. Contact</h2>
                    <p>For privacy inquiries, contact us at privacy@fitosys.com.</p>
                </div>
                <div className="mt-8">
                    <Link href="/">
                        <Button variant="outline">← Back to Home</Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
