"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, CheckCircle, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SubscriptionStats {
    plan: string;
    client_limit: number | null;
    active_clients: number;
    utilisation_pct: number;
    show_upgrade_prompt: boolean;
    amount_inr: number;
    billing_cycle: string;
    current_period_end: string | null;
    days_remaining: number | null;
}

interface PlanDetails {
    name: string;
    price: number;
    clients: number | string;
    features: string[];
    recommended?: boolean;
}

const PLANS: PlanDetails[] = [
    {
        name: "starter",
        price: 999,
        clients: "10 clients",
        features: ["WhatsApp check-ins", "Razorpay onboarding", "Renewal reminders", "GST invoices"],
    },
    {
        name: "basic",
        price: 1499,
        clients: "25 clients",
        features: ["Everything in Starter", "AI Monday summary", "Risk scoring", "Extended history"],
        recommended: true,
    },
    {
        name: "pro",
        price: 2999,
        clients: "50 clients",
        features: ["Everything in Basic", "Custom check-in questions", "Priority support", "Advanced analytics"],
    },
    {
        name: "studio",
        price: 5999,
        clients: "Unlimited",
        features: ["Everything in Pro", "Multi-location", "White-label", "API access", "Dedicated support"],
    },
];

interface SubscriptionManagementProps {
    stats: SubscriptionStats;
}

export function SubscriptionManagement({ stats }: SubscriptionManagementProps) {
    const { showSuccess, showError } = useToast();
    const [loading, setLoading] = useState<string | null>(null);

    const currentPlanIndex = PLANS.findIndex((p) => p.name === stats.plan);
    const currentPlan = PLANS[currentPlanIndex] || PLANS[0];

    const handleUpgrade = async (targetPlan: string) => {
        setLoading(targetPlan);
        try {
            const res = await fetch("/api/subscriptions/upgrade", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    targetPlan,
                    billingCycle: "monthly",
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Upgrade failed");
            }

            // Open Razorpay checkout
            await openRazorpay(data);
        } catch (error) {
            showError(error instanceof Error ? error.message : "Upgrade failed");
        } finally {
            setLoading(null);
        }
    };

    const openRazorpay = (orderData: any) => {
        return new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = "https://checkout.razorpay.com/v1/checkout.js";
            script.onload = () => {
                const options = {
                    key: orderData.key,
                    amount: orderData.amount * 100,
                    currency: orderData.currency,
                    order_id: orderData.orderId,
                    name: "Fitosys",
                    description: `Upgrade to ${orderData.targetPlan} plan`,
                    prefill: {
                        name: "",
                        email: "",
                        contact: "",
                    },
                    theme: {
                        color: "#E8001D",
                    },
                    handler: resolve,
                    ondismiss: reject,
                };
                const rzp = new window.Razorpay(options);
                rzp.open();
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    };

    const formatCurrency = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;

    return (
        <div className="space-y-6">
            {/* Current Plan Card */}
            <Card className="bg-gradient-to-br from-brand/10 to-brand/5 border-brand/20">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-white flex items-center gap-2">
                                {currentPlan.name.charAt(0).toUpperCase() + currentPlan.name.slice(1)} Plan
                                {stats.show_upgrade_prompt && (
                                    <Badge variant="destructive" className="text-xs">
                                        {stats.utilisation_pct}% Used
                                    </Badge>
                                )}
                            </CardTitle>
                            <CardDescription className="text-white/60">
                                {stats.active_clients} of {stats.client_limit || "∞"} clients •{" "}
                                {formatCurrency(stats.amount_inr)}/{stats.billing_cycle}
                            </CardDescription>
                        </div>
                        {stats.days_remaining && (
                            <div className="text-right">
                                <p className="text-sm text-white/60">Renews in</p>
                                <p className="text-lg font-bold text-white">{stats.days_remaining} days</p>
                            </div>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        <div className="w-full bg-white/10 rounded-full h-2">
                            <div
                                className="bg-brand h-2 rounded-full transition-all"
                                style={{ width: `${Math.min(stats.utilisation_pct, 100)}%` }}
                            />
                        </div>
                        {stats.show_upgrade_prompt && (
                            <p className="text-sm text-amber-500 flex items-center gap-2">
                                <ArrowRight className="h-4 w-4" />
                                You&apos;re approaching your client limit. Consider upgrading.
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Upgrade Options */}
            <div>
                <h3 className="text-lg font-semibold text-white mb-4">Upgrade Your Plan</h3>
                <div className="grid gap-4 md:grid-cols-2">
                    {PLANS.map((plan) => {
                        const isCurrent = plan.name === stats.plan;
                        const isHigher = PLANS.indexOf(plan) > currentPlanIndex;

                        return (
                            <Card
                                key={plan.name}
                                className={`relative transition-all ${
                                    isCurrent
                                        ? "bg-brand/10 border-brand/50"
                                        : isHigher
                                        ? "bg-card/50 border-white/10 hover:border-brand/30"
                                        : "bg-card/30 border-white/5 opacity-60"
                                }`}
                            >
                                {plan.recommended && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <Badge className="bg-brand text-white">Most Popular</Badge>
                                    </div>
                                )}
                                <CardHeader className="pb-3">
                                    <CardTitle className="text-white text-lg capitalize">{plan.name}</CardTitle>
                                    <CardDescription className="text-white/60">{plan.clients}</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="text-2xl font-bold text-white">
                                        {formatCurrency(plan.price)}
                                        <span className="text-sm text-white/60 font-normal">/month</span>
                                    </div>
                                    <ul className="space-y-2">
                                        {plan.features.map((feature, i) => (
                                            <li key={i} className="text-sm text-white/80 flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4 text-brand" />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                    {isCurrent ? (
                                        <Button disabled className="w-full bg-white/10 text-white/60">
                                            Current Plan
                                        </Button>
                                    ) : isHigher ? (
                                        <Button
                                            onClick={() => handleUpgrade(plan.name)}
                                            disabled={loading === plan.name}
                                            className="w-full bg-brand hover:bg-brand/90 text-white"
                                        >
                                            {loading === plan.name ? (
                                                <>
                                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                                    Processing...
                                                </>
                                            ) : (
                                                `Upgrade to ${plan.name}`
                                            )}
                                        </Button>
                                    ) : (
                                        <Button disabled variant="outline" className="w-full border-white/10 text-white/60">
                                            Downgrade Not Available
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
