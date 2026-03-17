"use client";

import { use, useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, XCircle, Loader2, AlertCircle, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

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
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-brand" />
            </div>
        );
    }

    if (error || !renewalData) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-center">
                <XCircle className="h-16 w-16 text-destructive mb-4" />
                <h1 className="text-3xl font-bold font-display uppercase">Renewal Error</h1>
                <p className="text-[#A0A0A0] mt-2 max-w-sm">{error || "Invalid renewal link"}</p>
                <Button asChild variant="outline" className="mt-8 border-white/10 text-white">
                    <a href="/">Go to Homepage</a>
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 font-sans">
            <div className="w-full max-w-sm space-y-8">
                {/* Header */}
                <div className="space-y-2">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-[10px] font-bold uppercase tracking-widest">
                        <AlertCircle className="w-3 h-3" />
                        {renewalData.daysRemaining} Days Left
                    </div>
                    <h1 className="text-5xl font-black font-display leading-none uppercase tracking-tighter">
                        Renew Your<br /><span className="text-brand">Journey.</span>
                    </h1>
                    <p className="text-[#A0A0A0] text-sm">
                        Continue your progress with the system, {renewalData.clientName}.
                    </p>
                </div>

                {/* Program Card */}
                <div className="bg-[#111111] border border-white/5 rounded-xl p-6 space-y-6 shadow-2xl">
                    <div className="space-y-1">
                        <div className="text-[10px] font-bold text-[#A0A0A0] uppercase tracking-widest">Selected Program</div>
                        <div className="text-xl font-bold">{renewalData.programName}</div>
                    </div>

                    <div className="flex justify-between items-end pt-4 border-t border-white/5">
                        <div className="space-y-1">
                            <div className="text-[10px] font-bold text-[#A0A0A0] uppercase tracking-widest">Next Cycle</div>
                            <div className="text-sm font-medium">30 Days Coaching</div>
                        </div>
                        <div className="text-right">
                            <div className="text-[10px] font-bold text-[#A0A0A0] uppercase tracking-widest mb-1">Total Due</div>
                            <div className="text-3xl font-black text-white">₹{renewalData.amount.toLocaleString()}</div>
                        </div>
                    </div>
                </div>

                {/* Footer / CTA */}
                <div className="space-y-6">
                    <RenewalPaymentButton
                        orderId={orderId!}
                        enrollmentId={enrollmentId!}
                        amount={renewalData.amount}
                        currency={renewalData.currency}
                        clientName={renewalData.clientName}
                        programName={renewalData.programName}
                    />

                    <div className="flex flex-col items-center gap-4 text-center">
                        <div className="flex items-center gap-2 text-[10px] font-bold text-[#A0A0A0] uppercase tracking-widest opacity-60">
                            <ShieldCheck className="w-3 h-3 text-success" />
                            Secure Encrypted Payment
                        </div>
                        <p className="text-[10px] text-[#A0A0A0] leading-relaxed max-w-[280px]">
                            By renewing, you agree to our <a href="/terms" className="text-brand hover:underline">Terms of Service</a> and your current program's check-in schedule.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function RenewalPage({ params }: { params: Promise<{ slug?: string }> }) {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-black flex items-center justify-center">
                <Loader2 className="h-12 w-12 animate-spin text-brand" />
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
    clientName: string;
    programName: string;
}

function RenewalPaymentButton({ orderId, enrollmentId, amount, currency, clientName, programName }: RenewalPaymentButtonProps) {
    const [error, setError] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);

    const handlePayment = async () => {
        setProcessing(true);
        setError(null);

        try {
            await loadRazorpayScript();

            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
                amount: amount * 100,
                currency: currency,
                order_id: orderId,
                name: "Fitosys",
                description: "Program Renewal",
                theme: { color: "#E8001D" },
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
                            window.location.href = `/renew/success?payment_id=${response.razorpay_payment_id}&amount=${amount}&name=${encodeURIComponent(clientName)}&program=${encodeURIComponent(programName)}`;
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
                    name: clientName,
                    email: "",
                    contact: "",
                },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Payment failed");
            setProcessing(false);
        }
    };

    return (
        <div className="space-y-4">
            {error && (
                <div className="bg-destructive/10 text-destructive text-xs p-4 rounded-lg border border-destructive/20 animate-in fade-in slide-in-from-top-1">
                    {error}
                </div>
            )}

            <Button
                onClick={handlePayment}
                disabled={processing}
                className="w-full h-14 bg-white text-black hover:bg-[#E8E8E8] font-bold uppercase tracking-widest text-xs rounded-lg shadow-xl shadow-brand/5 transition-all active:scale-[0.98]"
            >
                {processing ? (
                    <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Processing...
                    </span>
                ) : (
                    `Complete Renewal →`
                )}
            </Button>
        </div>
    );
}

function loadRazorpayScript(): Promise<void> {
    return new Promise((resolve, reject) => {
        if (typeof window !== "undefined" && (window as any).Razorpay) {
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
