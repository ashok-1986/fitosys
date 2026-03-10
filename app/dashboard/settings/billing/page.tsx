import { redirect } from "next/navigation";
import { getAuthenticatedCoach } from "@/lib/auth";
import { BillingForm } from "@/components/billing/billing-form";

export default async function BillingSettingsPage() {
    const { coachId, supabase, error } = await getAuthenticatedCoach();
    if (error || !coachId) redirect("/login");

    const { data: coach } = await supabase!
        .from("coaches")
        .select("business_name, gst_number, billing_address")
        .eq("id", coachId)
        .single();

    return (
        <BillingForm
            initialData={{
                businessName: coach?.business_name || "",
                gstNumber: coach?.gst_number || "",
                billingAddress: coach?.billing_address || ""
            }}
        />
    );
}
