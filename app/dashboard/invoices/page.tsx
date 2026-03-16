"use client";

import React, { useEffect, useState } from "react";
import { NavBar } from "@/components/ui/navigation";
import { Download, Receipt } from "lucide-react";

type Invoice = {
    id: string;
    invoice_number: string;
    invoice_date: string;
    total_amount: number;
    pdf_url: string | null;
    clients: {
        full_name: string;
    };
};

export default function InvoicesDashboard() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [month, setMonth] = useState(() => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    });

    useEffect(() => {
        const fetchInvoices = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/invoices?month=${month}`);
                if (res.ok) {
                    const data = await res.json();
                    setInvoices(data);
                }
            } catch (err) {
                console.error("Failed to fetch invoices");
            } finally {
                setLoading(false);
            }
        };

        fetchInvoices();
    }, [month]);

    const totalRevenue = invoices.reduce((sum, inv) => sum + Number(inv.total_amount), 0);

    return (
        <div className="flex-1 w-full bg-[#0A0A0A] text-white font-sans overflow-y-auto pb-24">
            <NavBar title="GST Invoices" back="Dashboard" backHref="/dashboard" />

            <div className="mx-4 mt-6">

                {/* Header Stats */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-5 flex-1">
                        <p className="text-white/60 text-sm mb-1">Total Amount (This Month)</p>
                        <p className="text-3xl font-bold font-sans">₹{totalRevenue.toLocaleString()}</p>
                    </div>

                    <div className="bg-[#1C1C1E] border border-white/10 rounded-xl px-4 py-2 w-full md:w-auto self-start">
                        <label className="text-xs text-white/40 block mb-1">Filter by Month</label>
                        <input
                            type="month"
                            value={month}
                            onChange={(e) => setMonth(e.target.value)}
                            className="bg-transparent text-white outline-none w-full"
                            style={{ colorScheme: 'dark' }}
                        />
                    </div>
                </div>

                {/* Invoices List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center text-white/40 py-10">Loading invoices...</div>
                    ) : invoices.length === 0 ? (
                        <div className="text-center py-12 bg-[#1C1C1E]/50 border border-white/5 rounded-2xl">
                            <Receipt className="w-12 h-12 text-white/20 mx-auto mb-3" />
                            <p className="text-white/60">No invoices found for this month.</p>
                        </div>
                    ) : (
                        invoices.map((inv) => (
                            <div key={inv.id} className="bg-[#1C1C1E] border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-white/90 text-[15px]">{inv.clients?.full_name || "Unknown Client"}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="text-xs text-[#E8001D] font-sans tracking-wide">{inv.invoice_number}</p>
                                        <span className="text-white/20 text-xs">•</span>
                                        <p className="text-xs text-white/50">{inv.invoice_date}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <p className="font-semibold text-lg">₹{inv.total_amount}</p>
                                    {inv.pdf_url ? (
                                        <a
                                            href={inv.pdf_url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                                        >
                                            <Download className="w-4 h-4 text-white/80" />
                                        </a>
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center opacity-50 cursor-not-allowed">
                                            <Download className="w-4 h-4 text-white/30" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </div>
    );
}
