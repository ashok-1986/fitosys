"use client";

import { useState } from "react";
import { Loader2, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

declare global {
    interface Window {
        Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
    }
}

interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    order_id: string;
    name: string;
    description: string;
    prefill: { name: string; email: string; contact: string };
    theme: { color: string };
    handler: (response: RazorpayResponse) => void;
}

interface RazorpayInstance {
    open: () => void;
}

interface RazorpayResponse {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
}

interface RazorpayButtonProps {
    programId: string;
    clientData: {
        full_name: string;
        whatsapp_number: string;
        email: string;
        age: number;
        primary_goal: string;
        health_notes?: string;
    };
    slug?: string;
    label?: string;
    onSuccess: (clientId: string) => void;
    onError: (error: string) => void;
}

export function RazorpayButton({
    programId,
    clientData,
    slug,
    label,
    onSuccess,
    onError,
}: RazorpayButtonProps) {
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        setLoading(true);

        try {
            // Step 1: Create order on your server
            const orderRes = await fetch("/api/payments/create-order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ programId, clientData, slug }),
            });

            const orderData = await orderRes.json();
            if (!orderRes.ok) throw new Error(orderData.error);

            // Step 2: Load Razorpay script if not already loaded
            await loadRazorpayScript();

            // Step 3: Open Razorpay modal
            const options: RazorpayOptions = {
                key: orderData.key,
                amount: orderData.amount,
                currency: orderData.currency,
                order_id: orderData.orderId,
                name: "Fitosys",
                description: "Coaching Program Payment",
                prefill: {
                    name: clientData.full_name,
                    email: clientData.email,
                    contact: clientData.whatsapp_number,
                },
                theme: { color: "#E8001D" },
                handler: async (response: RazorpayResponse) => {
                    // Step 4: Verify payment on server
                    try {
                        const verifyRes = await fetch("/api/payments/verify", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                ...response,
                                enrollmentId: orderData.enrollmentId,
                                clientData,
                            }),
                        });

                        const verifyData = await verifyRes.json();
                        if (verifyRes.ok) {
                            onSuccess(verifyData.clientId);
                        } else {
                            onError(verifyData.error || "Verification failed");
                        }
                    } catch {
                        onError("Payment verification failed. Contact support.");
                    }
                },
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (err) {
            onError(err instanceof Error ? err.message : "Payment failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            onClick={handlePayment}
            disabled={loading}
            className="w-full h-12 bg-brand hover:bg-brand/90 text-white text-base font-semibold"
        >
            {loading ? (
                <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                </span>
            ) : (
                <span className="flex items-center gap-2">
                    <Shield className="h-4 w-4" />
                    {label || "Pay Securely with Razorpay"}
                </span>
            )}
        </Button>
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
