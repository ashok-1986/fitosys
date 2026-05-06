import { createServiceClient, createClient } from "@/lib/supabase/server";
import { getTrialDaysRemaining, getTrialStatus } from "@/lib/plans/trial";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardPricingCards } from "./pricing-cards";

export default async function BillingPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const serviceSupabase = await createServiceClient();
    const { data: coach } = await serviceSupabase
        .from("coaches")
        .select("plan, plan_client_limit, trial_expires_at")
        .eq("id", user.id)
        .single();

    const trialStatus = getTrialStatus(coach);
    const trialDaysRemaining = getTrialDaysRemaining(coach);

    const isTrial = coach?.plan === "trial";
    const planName = isTrial ? "Free Trial" : coach?.plan?.toUpperCase() || "UNKNOWN";
    const clientLimit = coach?.plan_client_limit || 5;

    return (
        <div className="p-6 md:p-10 max-w-5xl mx-auto space-y-10">
            <div>
                <h1 className="text-3xl font-display font-black uppercase tracking-wide text-white mb-2">Billing & Plans</h1>
                <p className="text-white/40 text-sm">Manage your subscription and billing details.</p>
            </div>

            <section>
                <h2 className="text-sm uppercase tracking-widest text-white/50 font-bold mb-4">Current Plan</h2>
                <Card className="bg-[#111111] border border-white/5 p-6 relative overflow-hidden">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-2xl font-display font-bold text-white uppercase">{planName}</h3>
                                {isTrial && trialStatus === "active" && (
                                    <span className="bg-emerald-500/20 text-emerald-400 text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-full">
                                        {trialDaysRemaining} Days Left
                                    </span>
                                )}
                                {isTrial && trialStatus === "expired" && (
                                    <span className="bg-red-500/20 text-red-400 text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-full">
                                        Expired
                                    </span>
                                )}
                            </div>
                            <p className="text-white/40 text-sm">
                                You can onboard up to <strong className="text-white">{clientLimit} clients</strong> on this plan.
                            </p>
                        </div>
                        <div>
                            <Button asChild className="bg-white text-black hover:bg-white/90 uppercase tracking-widest text-xs font-bold px-6">
                                <a href="#plans">Choose a Plan</a>
                            </Button>
                        </div>
                    </div>
                </Card>
            </section>

            <section id="plans" className="pt-10 scroll-mt-20">
                <h2 className="text-sm uppercase tracking-widest text-white/50 font-bold mb-6">Available Plans</h2>
                <DashboardPricingCards currentPlan={coach?.plan || "trial"} />
            </section>
        </div>
    );
}
