"use client";

import { use, useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { SuccessContent, SuccessDetail } from "@/components/ui/success-content";

function EnrollmentSuccessContent({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
    const [details, setDetails] = useState<SuccessDetail[]>([]);
    const [clientName, setClientName] = useState("");

    useEffect(() => {
        const paymentStatus = searchParams.get("status");
        const paymentId = searchParams.get("payment_id");
        const programName = searchParams.get("program") || "Your Selected Program";
        const amount = searchParams.get("amount") || "9,999";
        const name = searchParams.get("name") || "Client";

        if (paymentStatus === "success" && paymentId) {
            setStatus("success");
            setClientName(name);
            setDetails([
                { label: "Program", value: programName },
                { label: "Amount Paid", value: `₹${amount}`, isCurrency: true },
                { label: "Payment ID", value: paymentId },
                { label: "Starts", value: "Today · " + new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }) }
            ]);
        } else {
            setStatus("failed");
        }
    }, [searchParams]);

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
                title="Payment\nFailed."
                subtitle="Something went wrong with your payment. Please try again or contact your coach."
                details={[]}
                ctaText="Try Again"
                ctaHref={`/join/${slug}`}
                whatsappNote="If money was deducted, it will be refunded within 5-7 business days."
            />
        );
    }

    return (
        <SuccessContent
            subtitle={`Welcome to the system, ${clientName}. Your coach will reach out on WhatsApp within the hour.`}
            details={details}
            ctaText="Go to Homepage"
            ctaHref="/"
        />
    );
}

export default function SuccessPage({ params }: { params: Promise<{ slug: string }> }) {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-brand" />
            </div>
        }>
            <EnrollmentSuccessContent params={params} />
        </Suspense>
    );
}
