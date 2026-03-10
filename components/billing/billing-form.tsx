"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/ui/navigation";

type BillingFormProps = {
    initialData: {
        businessName: string;
        gstNumber: string;
        billingAddress: string;
    };
};

export function BillingForm({ initialData }: BillingFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ text: "", type: "" });

    const [formData, setFormData] = useState({
        business_name: initialData.businessName || "",
        gst_number: initialData.gstNumber || "",
        billing_address: initialData.billingAddress || "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ text: "", type: "" });

        if (formData.gst_number && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gst_number.toUpperCase())) {
            setMessage({ text: "Invalid GST Number format", type: "error" });
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/coaches/billing", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    gst_number: formData.gst_number.toUpperCase()
                }),
            });

            if (!res.ok) throw new Error("Failed to update billing settings");

            setMessage({ text: "Billing settings saved successfully", type: "success" });
            router.refresh();
        } catch (error) {
            setMessage({ text: "An error occurred while saving", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 w-full bg-[#0A0A0A] text-white font-sans overflow-y-auto pb-24">
            <NavBar title="Billing Settings" back="Settings" backHref="/dashboard/settings" />

            <div className="mx-4 mt-6">
                <p className="text-sm text-white/60 mb-6">
                    Update your business details. These will be automatically included in the GST invoices generated for your clients.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/90">Business Name</label>
                        <input
                            type="text"
                            name="business_name"
                            value={formData.business_name}
                            onChange={handleChange}
                            placeholder="e.g. FitCoach Jane"
                            className="w-full bg-[#1C1C1E] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#F20000]/50"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/90">GST Number <span className="text-white/40 font-normal">(Optional)</span></label>
                        <input
                            type="text"
                            name="gst_number"
                            value={formData.gst_number}
                            onChange={handleChange}
                            placeholder="e.g. 22AAAAA0000A1Z5"
                            className="w-full bg-[#1C1C1E] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#F20000]/50"
                        />
                        <p className="text-xs text-white/40">If unregistered, leave this blank.</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-white/90">Billing Address</label>
                        <textarea
                            name="billing_address"
                            value={formData.billing_address}
                            onChange={handleChange}
                            placeholder="Complete address including state and PIN code"
                            rows={3}
                            className="w-full bg-[#1C1C1E] border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#F20000]/50 resize-none"
                        />
                    </div>

                    {message.text && (
                        <div className={`p-3 rounded-lg text-sm ${message.type === 'error' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                            {message.text}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#F20000] hover:bg-[#D90000] active:scale-[0.98] transition-all text-white font-semibold rounded-xl py-3.5 mt-4 disabled:opacity-50"
                    >
                        {loading ? "Saving..." : "Save Billing Settings"}
                    </button>
                </form>
            </div>
        </div>
    );
}
