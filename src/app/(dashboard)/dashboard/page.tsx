"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    Users,
    IndianRupee,
    RefreshCw,
    BarChart3,
    AlertTriangle,
    ChevronRight,
    MessageCircle,
    Zap,
    Send,
    Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useApiData } from "@/lib/hooks";

interface DashboardApiData {
    active_clients: number;
    revenue_this_month: number;
    currency: string;
    renewals_due_this_week: number;
    checkin_response_rate_last_week: number;
    clients_needing_attention: {
        id: string;
        name: string;
        reason: string;
        last_energy_score: number | null;
    }[];
    last_summary_preview: string | null;
    renewals: {
        client_name: string;
        client_id: string;
        program: string;
        end_date: string;
        days_remaining: number;
    }[];
}

interface CoachProfile {
    full_name: string;
}

function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    accent,
}: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ElementType;
    accent: string;
}) {
    const [animated, setAnimated] = useState(false);
    useEffect(() => {
        const t = setTimeout(() => setAnimated(true), 100);
        return () => clearTimeout(t);
    }, []);

    return (
        <Card className="relative overflow-hidden group hover:shadow-lg transition-shadow duration-300">
            <div
                className={`absolute top-0 left-0 w-1 h-full ${accent}`}
                style={{ transition: "height 0.5s ease" }}
            />
            <CardContent className="p-5">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground font-medium">
                            {title}
                        </p>
                        <p
                            className={`text-2xl md:text-3xl font-bold mt-1 transition-all duration-700 ${animated ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}
                        >
                            {value}
                        </p>
                        {subtitle && (
                            <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
                        )}
                    </div>
                    <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

function EnergyBadge({ score }: { score: number | null }) {
    if (score === null) return null;
    const color =
        score <= 3
            ? "bg-red-100 text-red-700"
            : score <= 5
                ? "bg-amber-100 text-amber-700"
                : score <= 7
                    ? "bg-blue-100 text-blue-700"
                    : "bg-emerald-100 text-emerald-700";
    return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${color}`}>
            <Zap className="h-3 w-3" />
            {score}/10
        </span>
    );
}

export default function DashboardPage() {
    const { data, loading } = useApiData<DashboardApiData>("/api/coaches/dashboard");
    const { data: coach } = useApiData<CoachProfile>("/api/coaches/profile");

    const greeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 17) return "Good afternoon";
        return "Good evening";
    };

    if (loading || !data) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                    {greeting()}, {coach?.full_name?.split(" ")[0] || "Coach"} 👋
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                    {new Date().toLocaleDateString("en-IN", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                    title="Active Clients"
                    value={data.active_clients}
                    icon={Users}
                    accent="bg-brand"
                />
                <StatCard
                    title="Revenue (Month)"
                    value={`₹${data.revenue_this_month.toLocaleString()}`}
                    icon={IndianRupee}
                    accent="bg-success"
                />
                <StatCard
                    title="Renewals Due (7d)"
                    value={data.renewals_due_this_week}
                    icon={RefreshCw}
                    accent="bg-warning"
                />
                <StatCard
                    title="Response Rate"
                    value={`${Math.round(data.checkin_response_rate_last_week * 100)}%`}
                    subtitle="Last week"
                    icon={BarChart3}
                    accent="bg-brand"
                />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Clients Needing Attention */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <AlertTriangle className="h-4 w-4 text-warning" />
                            Needs Attention
                        </CardTitle>
                        <Badge variant="secondary" className="text-xs">
                            {data.clients_needing_attention.length}
                        </Badge>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {data.clients_needing_attention.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-6">
                                🎉 All clients on track!
                            </p>
                        ) : (
                            data.clients_needing_attention.map((client) => (
                                <div
                                    key={client.id}
                                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                                >
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="h-9 w-9 rounded-full bg-brand/10 text-brand flex items-center justify-center text-sm font-semibold shrink-0">
                                            {client.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-medium truncate">
                                                {client.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground truncate">
                                                {client.reason}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <EnergyBadge score={client.last_energy_score} />
                                        <Link href={`/dashboard/clients/${client.id}`}>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>

                {/* Renewals Due */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="text-lg font-semibold flex items-center gap-2">
                            <RefreshCw className="h-4 w-4 text-brand" />
                            Renewals Due
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {data.renewals.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-6">
                                No renewals due this week
                            </p>
                        ) : (
                            data.renewals.map((r) => (
                                <div
                                    key={r.client_id}
                                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                                >
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium">{r.client_name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {r.program} — ends{" "}
                                            {new Date(r.end_date).toLocaleDateString("en-IN", {
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <Badge
                                            variant="outline"
                                            className="text-xs border-warning text-warning"
                                        >
                                            {r.days_remaining}d left
                                        </Badge>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-8 text-xs"
                                        >
                                            <Send className="h-3 w-3 mr-1" />
                                            Remind
                                        </Button>
                                    </div>
                                </div>
                            ))
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Weekly Pulse Preview */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                    <CardTitle className="text-lg font-semibold flex items-center gap-2">
                        <MessageCircle className="h-4 w-4 text-success" />
                        Last Week&apos;s Pulse
                    </CardTitle>
                    <Link href="/dashboard/pulse">
                        <Button variant="ghost" size="sm" className="text-brand">
                            View Full Summary
                            <ChevronRight className="h-4 w-4 ml-1" />
                        </Button>
                    </Link>
                </CardHeader>
                <CardContent>
                    {data.last_summary_preview ? (
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            {data.last_summary_preview}
                        </p>
                    ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">
                            No summary yet. Check-ins will generate your first pulse.
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
