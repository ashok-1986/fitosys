"use client";

import { useState, useEffect } from "react";
import { NavBar } from "@/components/ui/navigation";
import { Download, Filter, TrendingUp, DollarSign, CreditCard, CheckCircle2, XCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Payment {
    id: string;
    client_name: string;
    amount: number;
    currency: string;
    status: "captured" | "failed" | "refunded" | "pending";
    payment_type: "new" | "renewal";
    paid_at: string;
    gateway_payment_id: string;
    program_name?: string;
}

export default function PaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [month, setMonth] = useState(() => {
        const d = new Date();
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    });
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [typeFilter, setTypeFilter] = useState<string>("all");
    const [search, setSearch] = useState("");

    useEffect(() => {
        fetchPayments();
    }, [month]);

    async function fetchPayments() {
        setLoading(true);
        try {
            const res = await fetch(`/api/payments?month=${month}`);
            if (!res.ok) throw new Error("Failed to fetch payments");
            const data = await res.json();
            setPayments(data);
        } catch (err) {
            console.error("Error fetching payments:", err);
        } finally {
            setLoading(false);
        }
    }

    // Filter payments
    const filteredPayments = payments.filter(payment => {
        const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
        const matchesType = typeFilter === "all" || payment.payment_type === typeFilter;
        const matchesSearch = payment.client_name.toLowerCase().includes(search.toLowerCase());
        return matchesStatus && matchesType && matchesSearch;
    });

    // Calculate totals
    const totalRevenue = filteredPayments
        .filter(p => p.status === "captured")
        .reduce((sum, p) => sum + p.amount, 0);

    const capturedCount = filteredPayments.filter(p => p.status === "captured").length;
    const failedCount = filteredPayments.filter(p => p.status === "failed").length;
    const pendingCount = filteredPayments.filter(p => p.status === "pending").length;

    const formatCurrency = (amount: number) => `₹${amount.toLocaleString("en-IN")}`;
    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });
    };

    const getStatusBadge = (status: Payment["status"]) => {
        switch (status) {
            case "captured":
                return <Badge className="bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20">Captured</Badge>;
            case "failed":
                return <Badge className="bg-[#EF4444]/10 text-[#EF4444] border border-[#EF4444]/20">Failed</Badge>;
            case "refunded":
                return <Badge className="bg-[#F59E0B]/10 text-[#F59E0B] border border-[#F59E0B]/20">Refunded</Badge>;
            case "pending":
                return <Badge className="bg-[#3B82F6]/10 text-[#3B82F6] border border-[#3B82F6]/20">Pending</Badge>;
        }
    };

    const getTypeBadge = (type: Payment["payment_type"]) => {
        return type === "new" ? (
            <Badge className="bg-[#E8001D]/10 text-[#E8001D] border border-[#E8001D]/20 text-xs">New</Badge>
        ) : (
            <Badge className="bg-[#8B5CF6]/10 text-[#8B5CF6] border border-[#8B5CF6]/20 text-xs">Renewal</Badge>
        );
    };

    return (
        <div className="flex-1 w-full bg-[#0A0A0A] text-white font-sans overflow-y-auto pb-24">
            <NavBar
                title="Payments"
                back="Dashboard"
                backHref="/dashboard"
            />

            <div className="mx-4 mt-6 space-y-6">
                {/* Revenue Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <Card className="bg-[#111111] border border-[rgba(232,0,29,0.25)]">
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-2 text-[#A0A0A0] text-sm">
                                <TrendingUp size={16} />
                                <span>Total Revenue</span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-display font-black text-white">
                                {formatCurrency(totalRevenue)}
                            </div>
                            <div className="text-xs text-[#A0A0A0] mt-1">
                                {capturedCount} successful payments
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#111111] border border-[rgba(232,0,29,0.25)]">
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-2 text-[#A0A0A0] text-sm">
                                <DollarSign size={16} />
                                <span>Avg. Payment</span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-display font-black text-white">
                                {capturedCount > 0 ? formatCurrency(totalRevenue / capturedCount) : "₹0"}
                            </div>
                            <div className="text-xs text-[#A0A0A0] mt-1">
                                Per transaction
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#111111] border border-[rgba(232,0,29,0.25)]">
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-2 text-[#A0A0A0] text-sm">
                                <CheckCircle2 size={16} />
                                <span>Successful</span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-display font-black text-[#10B981]">
                                {capturedCount}
                            </div>
                            <div className="text-xs text-[#A0A0A0] mt-1">
                                This month
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-[#111111] border border-[rgba(232,0,29,0.25)]">
                        <CardHeader className="pb-3">
                            <div className="flex items-center gap-2 text-[#A0A0A0] text-sm">
                                <XCircle size={16} />
                                <span>Failed</span>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-display font-black text-[#EF4444]">
                                {failedCount}
                            </div>
                            <div className="text-xs text-[#A0A0A0] mt-1">
                                This month
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Filters */}
                <div className="bg-[#111111] border border-[rgba(232,0,29,0.25)] rounded-xl p-4">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                            <Label className="text-[#A0A0A0] text-xs uppercase tracking-wider">Month</Label>
                            <Input
                                type="month"
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                                className="bg-[#1A1A1A] border-[rgba(232,0,29,0.25)] text-white"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[#A0A0A0] text-xs uppercase tracking-wider">Status</Label>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full bg-[#1A1A1A] border border-[rgba(232,0,29,0.25)] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E8001D]"
                            >
                                <option value="all">All Status</option>
                                <option value="captured">Captured</option>
                                <option value="failed">Failed</option>
                                <option value="refunded">Refunded</option>
                                <option value="pending">Pending</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[#A0A0A0] text-xs uppercase tracking-wider">Type</Label>
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="w-full bg-[#1A1A1A] border border-[rgba(232,0,29,0.25)] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-[#E8001D]"
                            >
                                <option value="all">All Types</option>
                                <option value="new">New Enrollment</option>
                                <option value="renewal">Renewal</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[#A0A0A0] text-xs uppercase tracking-wider">Search</Label>
                            <Input
                                placeholder="Search by client name..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="bg-[#1A1A1A] border-[rgba(232,0,29,0.25)] text-white placeholder:text-[#666]"
                            />
                        </div>
                    </div>
                </div>

                {/* Payments Table */}
                <Card className="bg-[#111111] border border-[rgba(232,0,29,0.25)]">
                    <CardHeader className="border-b border-[rgba(232,0,29,0.25)]">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-display font-bold text-lg uppercase">Transactions</h3>
                                <p className="text-sm text-[#A0A0A0] mt-1">
                                    {filteredPayments.length} payments found
                                </p>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                className="border-[rgba(232,0,29,0.25)] text-white hover:bg-[#1A1A1A]"
                            >
                                <Download size={16} className="mr-2" />
                                Export
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        {loading ? (
                            <div className="text-center py-12 text-[#A0A0A0]">
                                <Clock size={32} className="mx-auto mb-3 animate-spin" />
                                Loading payments...
                            </div>
                        ) : filteredPayments.length === 0 ? (
                            <div className="text-center py-12 text-[#A0A0A0]">
                                <CreditCard size={48} className="mx-auto mb-3 opacity-20" />
                                No payments found for this month
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-[#0D0D0D]">
                                        <tr className="border-b border-[rgba(232,0,29,0.25)]">
                                            <th className="text-left text-[10px] font-display font-bold uppercase tracking-widest text-[#A0A0A0] px-6 py-4">
                                                Client
                                            </th>
                                            <th className="text-left text-[10px] font-display font-bold uppercase tracking-widest text-[#A0A0A0] px-6 py-4">
                                                Type
                                            </th>
                                            <th className="text-left text-[10px] font-display font-bold uppercase tracking-widest text-[#A0A0A0] px-6 py-4">
                                                Status
                                            </th>
                                            <th className="text-right text-[10px] font-display font-bold uppercase tracking-widest text-[#A0A0A0] px-6 py-4">
                                                Amount
                                            </th>
                                            <th className="text-left text-[10px] font-display font-bold uppercase tracking-widest text-[#A0A0A0] px-6 py-4">
                                                Payment ID
                                            </th>
                                            <th className="text-left text-[10px] font-display font-bold uppercase tracking-widest text-[#A0A0A0] px-6 py-4">
                                                Date
                                            </th>
                                            <th className="text-right text-[10px] font-display font-bold uppercase tracking-widest text-[#A0A0A0] px-6 py-4">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredPayments.map((payment) => (
                                            <tr
                                                key={payment.id}
                                                className="border-b border-[rgba(232,0,29,0.25)] hover:bg-[rgba(232,0,29,0.03)] transition-colors"
                                            >
                                                <td className="px-6 py-4">
                                                    <div>
                                                        <div className="font-semibold text-white">
                                                            {payment.client_name}
                                                        </div>
                                                        {payment.program_name && (
                                                            <div className="text-xs text-[#A0A0A0] mt-1">
                                                                {payment.program_name}
                                                            </div>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {getTypeBadge(payment.payment_type)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {getStatusBadge(payment.status)}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="font-display font-bold text-white">
                                                        {formatCurrency(payment.amount)}
                                                    </div>
                                                    <div className="text-xs text-[#A0A0A0] mt-1">
                                                        {payment.currency}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-mono text-xs text-[#A0A0A0]">
                                                        {payment.gateway_payment_id.slice(0, 12)}...
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-white">
                                                        {formatDate(payment.paid_at)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-[#A0A0A0] hover:text-white"
                                                    >
                                                        <Download size={16} />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
