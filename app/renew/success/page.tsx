"use client";

import { useSearchParams } from "next/navigation";
import { CheckCircle, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useEffect, useState, Suspense } from "react";

function RenewalSuccessContent() {
    const searchParams = useSearchParams();
    const paymentId = searchParams.get("payment_id");
    const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");

    useEffect(() => {
        if (paymentId) {
            setStatus("success");
        } else {
            setStatus("failed");
        }
    }, [paymentId]);

    if (status === "loading") {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center px-4">
                <Card className="max-w-md w-full text-center p-8 shadow-lg">
                    <Loader2 className="h-16 w-16 animate-spin text-brand mx-auto mb-4" />
                    <h2 className="text-2xl font-bold">Processing...</h2>
                    <p className="text-muted-foreground mt-2">
                        Please wait while we confirm your renewal.
                    </p>
                </Card>
            </div>
        );
    }

    if (status === "success") {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center px-4">
                <Card className="max-w-md w-full text-center p-8 shadow-lg">
                    <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
                    <h2 className="text-2xl font-bold">Renewal Successful! 🎉</h2>
                    <p className="text-muted-foreground mt-2">
                        Your program has been renewed successfully.
                    </p>
                    <p className="text-muted-foreground mt-4">
                        Payment ID: <span className="font-mono text-sm">{paymentId}</span>
                    </p>
                    <div className="mt-6 p-4 bg-success/10 rounded-lg">
                        <p className="text-sm text-success font-medium">
                            ✓ Your coach has been notified
                        </p>
                        <p className="text-sm text-success font-medium mt-1">
                            ✓ You&apos;ll receive a WhatsApp confirmation shortly
                        </p>
                    </div>
                    <Button asChild className="w-full mt-6">
                        <Link href="/">Go to Homepage</Link>
                    </Button>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <Card className="max-w-md w-full text-center p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-destructive">Renewal Error</h2>
                <p className="text-muted-foreground mt-2">
                    Something went wrong with your renewal.
                </p>
                <Button asChild className="w-full mt-6">
                    <Link href="/">Go to Homepage</Link>
                </Button>
            </Card>
        </div>
    );
}

export default function RenewalSuccessPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background flex items-center justify-center px-4">
                <Card className="max-w-md w-full text-center p-8 shadow-lg">
                    <Loader2 className="h-16 w-16 animate-spin text-brand mx-auto mb-4" />
                    <h2 className="text-2xl font-bold">Loading...</h2>
                </Card>
            </div>
        }>
            <RenewalSuccessContent />
        </Suspense>
    );
}
