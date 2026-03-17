"use client";

import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useEffect, useState, Suspense } from "react";
import { SuccessContent, SuccessDetail } from "@/components/ui/success-content";

function RenewalSuccessContent() {
    const searchParams = useSearchParams();
    const paymentId = searchParams.get("payment_id");
    const amount = searchParams.get("amount") || "9,999";
    const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
    const [details, setDetails] = useState<SuccessDetail[]>([]);

    useEffect(() => {
        if (paymentId) {
            setStatus("success");
            setDetails([
                { label: "Status", value: "Renewal Complete" },
                { label: "Amount Paid", value: `₹${amount}`, isCurrency: true },
                { label: "Payment ID", value: paymentId },
                { label: "Valid Until", value: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) }
            ]);
        } else {
            setStatus("failed");
        }
    }, [paymentId, amount]);

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-brand" />
            </div>
        );
    }

    if (status === "failed") {
        return (
            <SuccessContent
                title="Renewal\nFailed."
                subtitle="Something went wrong with your renewal payment. Please check your connection or contact your coach."
                details={[]}
                ctaText="Go Back"
                ctaHref="/renew"
                whatsappNote="If money was deducted, it will be refunded within 5-7 business days."
            />
        );
    }

    return (
        <SuccessContent
            title="Renewal\nDone."
            subtitle="Your coaching journey continues. We've updated your enrollment and notified your coach."
            details={details}
            ctaText="Go to Dashboard"
            ctaHref="/dashboard"
            whatsappNote="Check your WhatsApp for a confirmation receipt. 🎯"
        />
    );
}

export default function RenewalSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-brand" />
            </div>
        }>
            <RenewalSuccessContent />
        </Suspense>
    );
}
