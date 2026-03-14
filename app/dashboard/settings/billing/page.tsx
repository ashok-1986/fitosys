import { redirect } from "next/navigation";
import { getAuthenticatedCoach } from "@/lib/auth";
import { BillingForm } from "@/components/billing/billing-form";
import { SubscriptionManagement } from "@/components/billing/subscription-management";

export default async function BillingSettingsPage() {
    const { coachId, supabase, error } = await getAuthenticatedCoach();
    if (error || !coachId) redirect("/login");

    const { data: coach } = await supabase!
        .from("coaches")
        .select("business_name, gst_number, billing_address")
        .eq("id", coachId)
        .single();

    // Fetch subscription stats
    const statsRes = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/subscriptions/current`, {
        headers: { cookie: process.env.COOKIE_SECRET || "" },
        cache: "no-store",
    });
    const stats = await statsRes.json().catch(() => null);

    return (
        <div className="space-y-8">
            {stats && (
                <SubscriptionManagement stats={stats} />
            )}
            
            <div className="border-t border-white/10 pt-8">
                <h2 className="text-xl font-semibold text-white mb-4">GST Billing Details</h2>
                <BillingForm
                    initialData={{
                        businessName: coach?.business_name || "",
                        gstNumber: coach?.gst_number || "",
                        billingAddress: coach?.billing_address || ""
                    }}
                />
            </div>
        </div>
    );
}
