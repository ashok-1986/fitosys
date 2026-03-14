"use client";

import { use, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Loader2, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RazorpayButton } from "@/components/razorpay-button";

function RenewalContent({ params }: { params: Promise<{ slug?: string }> }) {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("order");
    const enrollmentId = searchParams.get("enrollment");
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [renewalData, setRenewalData] = useState<{
        clientName: string;
        programName: string;
        amount: number;
        currency: string;
        daysRemaining: number;
    } | null>(null);

    useEffect(() => {
        if (!orderId || !enrollmentId) {
            setError("Invalid renewal link. Please contact your coach.");
            setLoading(false);
            return;
        }

        fetchRenewalDetails(orderId, enrollmentId);
    }, [orderId, enrollmentId]);

    const fetchRenewalDetails = async (orderId: string, enrollmentId: string) => {
        try {
            const res = await fetch(`/api/renewals/details?order=${orderId}&enrollment=${enrollmentId}`);
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to load renewal details");
            }
            const data = await res.json();
            setRenewalData(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load renewal details");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center px-4">
                <Card className="max-w-md w-full text-center p-8 shadow-lg">
                    <Loader2 className="h-16 w-16 animate-spin text-brand mx-auto mb-4" />
                    <h2 className="text-2xl font-bold">Loading...</h2>
                    <p className="text-muted-foreground mt-2">
                        Please wait while we fetch your renewal details.
                    </p>
                </Card>
            </div>
        );
    }

    if (error || !renewalData) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center px-4">
                <Card className="max-w-md w-full text-center p-8 shadow-lg">
                    <XCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-destructive">Renewal Error</h2>
                    <p className="text-muted-foreground mt-2">{error || "Invalid renewal link"}</p>
                    <p className="text-muted-foreground mt-4 text-sm">
                        Please contact your coach or support for assistance.
                    </p>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
            <Card className="max-w-lg w-full shadow-xl">
                <div className="p-8 space-y-6">
                    {/* Header */}
                    <div className="text-center space-y-3">
                        <div className="h-16 w-16 rounded-full bg-brand/10 flex items-center justify-center mx-auto">
                            <CheckCircle className="h-8 w-8 text-brand" />
                        </div>
                        <h1 className="text-2xl font-bold">Renew Your Program</h1>
                        <p className="text-muted-foreground">
                            Continue your journey with {renewalData.clientName}
                        </p>
                    </div>

                    {/* Program Details */}
                    <div className="bg-brand/5 rounded-xl p-5 space-y-3 border border-brand/20">
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm text-muted-foreground">Program</p>
                                <p className="text-lg font-semibold">{renewalData.programName}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-muted-foreground">Amount</p>
                                <p className="text-2xl font-bold text-brand">
                                    ₹{renewalData.amount.toLocaleString()}
                                </p>
                            </div>
                        </div>
                        
                        <div className="pt-3 border-t border-brand/20">
                            <div className="flex items-center gap-2 text-amber-600">
                                <AlertCircle className="h-4 w-4" />
                                <span className="text-sm font-medium">
                                    {renewalData.daysRemaining} days remaining in current program
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Section */}
                    <div className="space-y-4">
                        <RenewalPaymentButton
                            orderId={orderId!}
                            enrollmentId={enrollmentId!}
                            amount={renewalData.amount}
                            currency={renewalData.currency}
                        />
                        
                        <div className="text-center space-y-2">
                            <p className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                                <CheckCircle className="h-3 w-3" />
                                Secure payment via Razorpay
                            </p>
                            <p className="text-xs text-muted-foreground">
                                By continuing, you agree to the{" "}
                                <a href="/terms" className="text-brand underline">
                                    Terms of Service
                                </a>
                            </p>
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
}

export default function RenewalPage({ params }: { params: Promise<{ slug?: string }> }) {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-background flex items-center justify-center px-4">
                <Card className="max-w-md w-full text-center p-8 shadow-lg">
                    <Loader2 className="h-16 w-16 animate-spin text-brand mx-auto mb-4" />
                    <h2 className="text-2xl font-bold">Loading...</h2>
                    <p className="text-muted-foreground mt-2">
                        Please wait while we fetch your renewal details.
                    </p>
                </Card>
            </div>
        }>
            <RenewalContent params={params} />
        </Suspense>
    );
}

interface RenewalPaymentButtonProps {
    orderId: string;
    enrollmentId: string;
    amount: number;
    currency: string;
}

function RenewalPaymentButton({ orderId, enrollmentId, amount, currency }: RenewalPaymentButtonProps) {
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);

    const handlePayment = async () => {
        setProcessing(true);
        setError(null);

        try {
            // Load Razorpay script
            await loadRazorpayScript();

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
                amount: amount * 100, // Convert to paise
                currency: currency,
                order_id: orderId,
                name: "Fitosys",
                description: "Program Renewal",
                theme: { color: "#F20000" },
                handler: async (response: any) => {
                    try {
                        const verifyRes = await fetch("/api/payments/verify", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                enrollmentId,
                                isRenewal: true,
                            }),
                        });

                        const verifyData = await verifyRes.json();
                        if (verifyRes.ok) {
                            window.location.href = `/renew/success?payment_id=${response.razorpay_payment_id}`;
                        } else {
                            setError(verifyData.error || "Payment verification failed");
                        }
                    } catch {
                        setError("Payment verification failed. Contact support.");
                    } finally {
                        setProcessing(false);
                    }
                },
                prefill: {
                    name: "",
                    email: "",
                    contact: "",
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Payment failed");
            setProcessing(false);
        }
    };

    return (
        <div className="space-y-3">
            {error && (
                <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}
            
            <Button
                onClick={handlePayment}
                disabled={processing}
                className="w-full h-14 bg-brand hover:bg-brand/90 text-white text-lg font-semibold"
            >
                {processing ? (
                    <span className="flex items-center gap-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        Processing...
                    </span>
                ) : (
                    `Pay ₹${amount.toLocaleString()} & Renew Now`
                )}
            </Button>
        </div>
    );
}

function loadRazorpayScript(): Promise<void> {
    return new Promise((resolve, reject) => {
        if (typeof window !== "undefined" && window.Razorpay) {
            resolve();
            return;
        }

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
        document.head.appendChild(script);
    });
}
