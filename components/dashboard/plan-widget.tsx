"use client";

import React, { useEffect, useState } from "react";
import { ArrowUpRight, Zap } from "lucide-react";

export function PlanWidget() {
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/subscriptions/current")
            .then(res => res.json())
            .then(resData => {
                if (!resData.error) setData(resData);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div className="animate-pulse bg-[#1C1C1E] h-32 rounded-2xl mx-4 mb-6"></div>;
    if (!data) return null;

    return (
        <div className="mx-4 mb-6 bg-gradient-to-br from-[#1C1C1E] to-[#121212] border border-white/10 rounded-2xl p-5 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E8001D]/5 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2 pointer-events-none" />

            <div className="flex items-start justify-between relative z-10">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white/90 font-semibold text-lg capitalize">{data.plan} Plan</h3>
                        {data.plan !== 'studio' && (
                            <span className="bg-[#E8001D]/10 text-[#E8001D] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                {data.billing_cycle}
                            </span>
                        )}
                    </div>
                    {data.client_limit ? (
                        <p className="text-white/50 text-sm">
                            <span className={data.show_upgrade_prompt ? "text-[#E8001D] font-semibold" : "text-white/80 font-medium"}>
                                {data.active_clients}
                            </span>
                            {" "}of {data.client_limit} active clients
                        </p>
                    ) : (
                        <p className="text-white/50 text-sm">
                            <span className="text-white/80 font-medium">{data.active_clients}</span> active clients (Unlimited)
                        </p>
                    )}
                </div>

                {data.show_upgrade_prompt && (
                    <button className="flex items-center gap-1.5 bg-[#E8001D] hover:bg-[#D90000] text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors active:scale-95 shadow-[0_0_15px_rgba(242,0,0,0.3)]">
                        <Zap className="w-3.5 h-3.5" />
                        Upgrade
                    </button>
                )}
            </div>

            {data.client_limit && (
                <div className="mt-4">
                    <div className="w-full bg-black/50 rounded-full h-1.5 overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-1000 ${data.show_upgrade_prompt ? 'bg-[#E8001D]' : 'bg-white/40'}`}
                            style={{ width: `${Math.min(data.utilisation_pct, 100)}%` }}
                        />
                    </div>
                    {data.show_upgrade_prompt && (
                        <p className="text-[#E8001D] text-xs mt-2 font-medium">
                            You're reaching your client limit. Upgrade to {data.plan === 'starter' ? 'Basic' : data.plan === 'basic' ? 'Pro' : 'Studio'} to add more clients.
                        </p>
                    )}
                </div>
            )}

            {data.days_remaining !== null && (
                <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-white/40">
                    <p>Renews in {data.days_remaining} days</p>
                    <div className="flex items-center gap-1 hover:text-white/80 cursor-pointer transition-colors">
                        Manage Billing <ArrowUpRight className="w-3 h-3" />
                    </div>
                </div>
            )}
        </div>
    );
}
