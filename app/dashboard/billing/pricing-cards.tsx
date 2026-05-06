"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

const PRICING_DATA = [
    {
        id: "starter",
        tier: "STARTER",
        price: "999",
        period: "per month",
        clients: "Up to 10 clients",
        featured: false,
    },
    {
        id: "basic",
        tier: "BASIC",
        price: "1,499",
        period: "per month",
        clients: "Up to 25 clients",
        featured: true,
        badge: "Most Popular",
    },
    {
        id: "pro",
        tier: "PRO",
        price: "2,999",
        period: "per month",
        clients: "Up to 50 clients",
        featured: false,
    },
    {
        id: "studio",
        tier: "STUDIO",
        price: "5,999",
        period: "per month",
        clients: "Unlimited clients",
        featured: false,
    },
];

export function DashboardPricingCards({ currentPlan }: { currentPlan: string }) {
    const [loading, setLoading] = useState<string | null>(null);

    const handleSelectPlan = async (planId: string) => {
        try {
            setLoading(planId);
            const res = await fetch("/api/subscriptions/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ plan: planId }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to select plan");

            if (data.short_url) {
                window.location.href = data.short_url;
            }
        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(null);
        }
    };

    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PRICING_DATA.map((plan) => {
                const isCurrent = currentPlan?.toLowerCase() === plan.id;
                return (
                    <div
                        key={plan.id}
                        className={
                            plan.featured
                                ? "relative flex flex-col bg-[#E8001D] rounded-[10px] p-8 scale-[1.03] shadow-[0_0_60px_rgba(232,0,29,0.25)]"
                                : "bg-[#111111] border border-white/[0.06] rounded-[10px] p-8 flex flex-col"
                        }
                    >
                        {plan.badge && (
                            <span className={
                                plan.featured
                                    ? "absolute top-4 right-4 bg-white text-[#E8001D] text-[11px] font-bold uppercase tracking-[0.06em] px-3 py-1 rounded-[2px]"
                                    : "self-end bg-[#E8001D] text-white text-[11px] font-bold uppercase tracking-[0.06em] px-3 py-1 rounded-[2px] mb-4"
                            }>
                                {plan.badge}
                            </span>
                        )}

                        <div className={
                            plan.featured
                                ? "font-sans text-[11px] font-bold uppercase tracking-[0.08em] text-white/70 mb-2"
                                : "font-sans text-[11px] font-bold uppercase tracking-[0.08em] text-[#E8001D] mb-4"
                        }>
                            {plan.tier}
                        </div>

                        <div className="flex items-baseline gap-1 mb-1">
                            <span className={
                                plan.featured
                                    ? "font-display text-[24px] text-white/70"
                                    : "font-display text-[24px] text-[#888888]"
                            }>₹</span>
                            <span className={
                                plan.featured
                                    ? "font-display font-medium text-[48px] text-white leading-none"
                                    : "font-display font-medium text-[48px] text-white leading-none tracking-[0.02em]"
                            }>
                                {plan.price}
                            </span>
                        </div>

                        <div className={
                            plan.featured
                                ? "font-sans text-[13px] text-white/70 mb-2"
                                : "font-sans text-[13px] text-[#888888] mb-2"
                        }>
                            {plan.period}
                        </div>

                        <div className={
                            plan.featured
                                ? "font-sans text-[15px] font-semibold text-white mb-6 flex-1"
                                : "font-sans text-[15px] font-semibold text-white mb-6 flex-1"
                        }>
                            {plan.clients}
                        </div>

                        {isCurrent ? (
                            <Button disabled variant="outline" className="w-full mt-auto opacity-50 cursor-not-allowed border-white/20 text-white">
                                Current Plan
                            </Button>
                        ) : plan.featured ? (
                            <button 
                                onClick={() => handleSelectPlan(plan.id)}
                                disabled={loading !== null}
                                className="w-full mt-auto py-4 bg-white text-[#E8001D] font-sans font-bold text-[13px] uppercase tracking-[0.04em] rounded-[2px] hover:bg-white/90 transition-colors disabled:opacity-50"
                            >
                                {loading === plan.id ? "Processing..." : "Select Plan"}
                            </button>
                        ) : (
                            <Button 
                                onClick={() => handleSelectPlan(plan.id)}
                                disabled={loading !== null}
                                variant="fitosys-primary" 
                                size="fitosys" 
                                className="w-full mt-auto disabled:opacity-50"
                            >
                                {loading === plan.id ? "Processing..." : "Select Plan"}
                            </Button>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
