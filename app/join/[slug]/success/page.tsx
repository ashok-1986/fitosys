"use client";

import { use, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function SuccessPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const searchParams = useSearchParams();
    const [status, setStatus] = useState<"loading" | "success" | "failed">("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        const paymentStatus = searchParams.get("status");
        const paymentId = searchParams.get("payment_id");
        const error = searchParams.get("error");

        if (paymentStatus === "success" && paymentId) {
            setStatus("success");
            setMessage(`Payment successful! Your payment ID is ${paymentId}.`);
        } else if (paymentStatus === "failed" || error) {
            setStatus("failed");
            setMessage(error || "Payment failed. Please try again.");
        } else {
            // If no params, redirect to coach's join page
            setStatus("failed");
            setMessage("Invalid access. Please start from the coach's onboarding page.");
        }
    }, [searchParams]);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <Card className="max-w-md w-full text-center p-8 shadow-lg">
                {status === "loading" && (
                    <>
                        <Loader2 className="h-16 w-16 animate-spin text-brand mx-auto mb-4" />
                        <h2 className="text-2xl font-bold">Processing...</h2>
                        <p className="text-muted-foreground mt-2">
                            Please wait while we confirm your payment.
                        </p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
                        <h2 className="text-2xl font-bold">Payment Successful! 🎉</h2>
                        <p className="text-muted-foreground mt-2">{message}</p>
                        <p className="text-muted-foreground mt-4">
                            You&apos;ll receive a WhatsApp confirmation shortly with your program details.
                        </p>
                        <div className="mt-6 p-4 bg-success/10 rounded-lg">
                            <p className="text-sm text-success font-medium">
                                ✓ Welcome to your coaching journey!
                            </p>
                        </div>
                    </>
                )}

                {status === "failed" && (
                    <>
                        <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
                        <h2 className="text-2xl font-bold text-destructive">Payment Failed</h2>
                        <p className="text-muted-foreground mt-2">{message}</p>
                        <div className="mt-6 space-y-3">
                            <Button asChild className="w-full">
                                <Link href={`/join/${slug}`}>Try Again</Link>
                            </Button>
                            <Button variant="outline" asChild className="w-full">
                                <Link href="/">Go to Homepage</Link>
                            </Button>
                        </div>
                    </>
                )}

                {status === "success" && (
                    <div className="mt-6">
                        <p className="text-xs text-muted-foreground">
                            A confirmation email has been sent to your registered email address.
                        </p>
                    </div>
                )}
            </Card>
        </div>
    );
}
