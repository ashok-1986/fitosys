import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function TermsPage() {
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
                <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
                <div className="prose prose-sm text-muted-foreground space-y-4">
                    <p>Last updated: February 2026</p>
                    <h2 className="text-lg font-semibold text-foreground">1. Acceptance of Terms</h2>
                    <p>By accessing or using Fitosys, you agree to be bound by these Terms of Service. Fitosys is a SaaS platform operated by Alchemetryx for fitness, wellness, and yoga coaches.</p>
                    <h2 className="text-lg font-semibold text-foreground">2. Service Description</h2>
                    <p>Fitosys provides client onboarding, automated check-in management, and renewal reminder services for independent coaches. We use third-party services including Razorpay for payments and WhatsApp Business API for messaging.</p>
                    <h2 className="text-lg font-semibold text-foreground">3. Account Responsibility</h2>
                    <p>You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must provide accurate information during registration.</p>
                    <h2 className="text-lg font-semibold text-foreground">4. Payment Terms</h2>
                    <p>Subscription fees are billed monthly or annually as selected. All payments are processed securely through Razorpay. You may cancel your subscription at any time.</p>
                    <h2 className="text-lg font-semibold text-foreground">5. Data Handling</h2>
                    <p>Your client data is stored securely and isolated per coach account. We do not share or sell your data. See our Privacy Policy for full details.</p>
                    <h2 className="text-lg font-semibold text-foreground">6. Contact</h2>
                    <p>For questions about these terms, contact us at fitosys@alchemetryx.com.</p>
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
