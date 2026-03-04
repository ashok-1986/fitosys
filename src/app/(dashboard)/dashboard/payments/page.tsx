"use client";

import { useState } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { CreditCard, IndianRupee, Calendar, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MOCK_PAYMENTS, MOCK_REVENUE_HISTORY } from "@/lib/mock-data";

export default function PaymentsPage() {
    const [dateFilter] = useState("all");
    const [currencyFilter, setCurrencyFilter] = useState("all");

    // Get unique currencies from payments
    const currencies = [...new Set(MOCK_PAYMENTS.map((p) => p.currency || "INR"))];

    const filteredPayments = MOCK_PAYMENTS.filter((p) => {
        if (currencyFilter !== "all" && (p.currency || "INR") !== currencyFilter) return false;
        return true;
    });

    const totalRevenue = filteredPayments.reduce((sum, p) => sum + p.amount, 0);
    const thisMonthRevenue = filteredPayments.filter((p) => {
        if (!p.paid_at) return false;
        const d = new Date(p.paid_at);
        const now = new Date();
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).reduce((sum, p) => sum + p.amount, 0);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                    <CreditCard className="h-6 w-6 text-brand" />
                    Payments
                </h1>
                <p className="text-sm text-muted-foreground">
                    Track your revenue and transactions
                </p>
            </div>

            {/* Currency Filter */}
            {currencies.length > 1 && (
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Button
                        variant={currencyFilter === "all" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrencyFilter("all")}
                        className={currencyFilter === "all" ? "bg-brand hover:bg-brand/90 text-white" : ""}
                    >
                        All
                    </Button>
                    {currencies.map((c) => (
                        <Button
                            key={c}
                            variant={currencyFilter === c ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrencyFilter(c)}
                            className={currencyFilter === c ? "bg-brand hover:bg-brand/90 text-white" : ""}
                        >
                            {c}
                        </Button>
                    ))}
                </div>
            )}

            <div className="grid sm:grid-cols-2 gap-4">
                <Card>
                    <CardContent className="pt-5">
                        <div className="flex items-center gap-2">
                            <div className="h-9 w-9 rounded-lg bg-success/10 flex items-center justify-center">
                                <IndianRupee className="h-4 w-4 text-success" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Revenue</p>
                                <p className="text-xl font-bold">₹{totalRevenue.toLocaleString()}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-5">
                        <div className="flex items-center gap-2">
                            <div className="h-9 w-9 rounded-lg bg-brand/10 flex items-center justify-center">
                                <Calendar className="h-4 w-4 text-brand" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">This Month</p>
                                <p className="text-xl font-bold">₹{thisMonthRevenue.toLocaleString()}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Revenue Chart */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Monthly Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-[250px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={MOCK_REVENUE_HISTORY}>
                                <defs>
                                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#E8001D" stopOpacity={0.15} />
                                        <stop offset="95%" stopColor="#E8001D" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#222222" />
                                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#A0A0A0' }} stroke="#222222" />
                                <YAxis
                                    tick={{ fontSize: 12, fill: '#A0A0A0' }}
                                    stroke="#222222"
                                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                                />
                                <Tooltip
                                    formatter={(value) => [`₹${Number(value).toLocaleString()}`, "Revenue"]}
                                    contentStyle={{
                                        borderRadius: "8px",
                                        border: "1px solid #222222",
                                        backgroundColor: "#111111",
                                        color: "#FFFFFF",
                                        fontSize: "13px",
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="#E8001D"
                                    strokeWidth={2}
                                    fill="url(#revenueGradient)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Transactions */}
            <Card>
                <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        {filteredPayments.sort(
                            (a, b) => new Date(b.paid_at!).getTime() - new Date(a.paid_at!).getTime()
                        ).map((p) => (
                            <div
                                key={p.id}
                                className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="h-9 w-9 rounded-full bg-brand/10 text-brand flex items-center justify-center text-xs font-semibold">
                                        {p.client?.full_name.split(" ").map((n) => n[0]).join("") || "?"}
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium">{p.client?.full_name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {p.program_name} ·{" "}
                                            {p.paid_at
                                                ? new Date(p.paid_at).toLocaleDateString("en-IN", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })
                                                : "Pending"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Badge
                                        variant="outline"
                                        className={`text-xs ${p.payment_type === "renewal"
                                            ? "border-brand text-brand"
                                            : "border-success text-success"
                                            }`}
                                    >
                                        {p.payment_type}
                                    </Badge>
                                    <span className="text-sm font-semibold min-w-[80px] text-right">
                                        {(p.currency || "INR") === "INR" ? "₹" : (p.currency || "INR") === "GBP" ? "£" : "$"}{p.amount.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
