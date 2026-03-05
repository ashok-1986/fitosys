"use client";

import { useState } from "react";
import Link from "next/link";
import {
    Search,
    ChevronRight,
    Zap,
    UserPlus,
    Loader2,
    Calendar,
    AlertTriangle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useApiData } from "@/lib/hooks";

interface ClientData {
    id: string;
    full_name: string;
    whatsapp_number: string;
    email: string;
    status: string;
    program_name: string | null;
    start_date: string | null;
    end_date: string | null;
    energy_score: number | null;
    last_checkin_date: string | null;
    renewal_due: boolean;
}

type FilterType = "all" | "active" | "inactive" | "renewal_due";

function EnergyBadge({ score }: { score: number | null }) {
    if (score === null) return <span className="text-xs text-muted-foreground">—</span>;
    const color =
        score >= 7
            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
            : score >= 4
                ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                : "bg-red-500/10 text-red-400 border-red-500/20";
    return (
        <Badge variant="outline" className={`text-xs ${color}`}>
            <Zap className="h-3 w-3 mr-1" />
            {score}/10
        </Badge>
    );
}

function formatDate(dateStr: string | null): string {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "2-digit",
    });
}

export default function ClientsPage() {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState<FilterType>("all");
    const { data: allClients, loading } = useApiData<ClientData[]>("/api/clients");

    const clients = (allClients || []).filter((c) => {
        const matchSearch =
            c.full_name.toLowerCase().includes(search.toLowerCase()) ||
            c.whatsapp_number.includes(search);
        const matchFilter =
            filter === "all" ||
            (filter === "active" && c.status === "active") ||
            (filter === "inactive" && c.status === "inactive") ||
            (filter === "renewal_due" && c.renewal_due);
        return matchSearch && matchFilter;
    });

    const activeCount = (allClients || []).filter((c) => c.status === "active").length;
    const renewalCount = (allClients || []).filter((c) => c.renewal_due).length;

    const FILTERS: { key: FilterType; label: string; count?: number }[] = [
        { key: "all", label: "All" },
        { key: "active", label: "Active", count: activeCount },
        { key: "inactive", label: "Inactive" },
        { key: "renewal_due", label: "Renewal Due", count: renewalCount },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Clients</h1>
                    <p className="text-sm text-muted-foreground">
                        {activeCount} active clients
                        {renewalCount > 0 && (
                            <span className="text-amber-400 ml-2">
                                · {renewalCount} renewal{renewalCount !== 1 ? "s" : ""} due
                            </span>
                        )}
                    </p>
                </div>
                <Button className="bg-brand hover:bg-brand/90 text-white">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Add Client
                </Button>
            </div>

            {/* Search + Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name or phone..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {FILTERS.map((f) => (
                        <Button
                            key={f.key}
                            variant={filter === f.key ? "default" : "outline"}
                            size="sm"
                            onClick={() => setFilter(f.key)}
                            className={
                                filter === f.key ? "bg-brand hover:bg-brand/90 text-white" : ""
                            }
                        >
                            {f.label}
                            {f.count !== undefined && f.count > 0 && (
                                <span className="ml-1 text-xs opacity-70">({f.count})</span>
                            )}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Client List — Table on desktop, cards on mobile */}
            {clients.length === 0 ? (
                <Card className="p-8 text-center">
                    <p className="text-muted-foreground">No clients found.</p>
                    <Button className="mt-4 bg-brand hover:bg-brand/90 text-white">
                        <UserPlus className="h-4 w-4 mr-2" />
                        Add Your First Client
                    </Button>
                </Card>
            ) : (
                <>
                    {/* Desktop table */}
                    <div className="hidden lg:block">
                        <Card className="overflow-hidden">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-border text-muted-foreground text-left">
                                        <th className="px-4 py-3 font-medium">Name</th>
                                        <th className="px-4 py-3 font-medium">Program</th>
                                        <th className="px-4 py-3 font-medium">Start</th>
                                        <th className="px-4 py-3 font-medium">End</th>
                                        <th className="px-4 py-3 font-medium">Last Check-in</th>
                                        <th className="px-4 py-3 font-medium">Energy</th>
                                        <th className="px-4 py-3 font-medium">Status</th>
                                        <th className="px-4 py-3"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {clients.map((client) => (
                                        <tr
                                            key={client.id}
                                            className="border-b border-border/50 last:border-0 hover:bg-card/50 transition-colors cursor-pointer"
                                        >
                                            <td className="px-4 py-3">
                                                <Link
                                                    href={`/dashboard/clients/${client.id}`}
                                                    className="flex items-center gap-3"
                                                >
                                                    <div className="h-8 w-8 rounded-full bg-brand/10 text-brand flex items-center justify-center text-xs font-semibold shrink-0">
                                                        {client.full_name
                                                            .split(" ")
                                                            .map((n) => n[0])
                                                            .join("")}
                                                    </div>
                                                    <span className="font-medium">
                                                        {client.full_name}
                                                    </span>
                                                </Link>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {client.program_name || "—"}
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {formatDate(client.start_date)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <span
                                                    className={
                                                        client.renewal_due
                                                            ? "text-amber-400 font-medium"
                                                            : "text-muted-foreground"
                                                    }
                                                >
                                                    {formatDate(client.end_date)}
                                                    {client.renewal_due && (
                                                        <AlertTriangle className="inline h-3 w-3 ml-1" />
                                                    )}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-muted-foreground">
                                                {formatDate(client.last_checkin_date)}
                                            </td>
                                            <td className="px-4 py-3">
                                                <EnergyBadge score={client.energy_score} />
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge
                                                    variant={
                                                        client.status === "active"
                                                            ? "default"
                                                            : "secondary"
                                                    }
                                                    className={`text-xs ${client.status === "active" ? "bg-emerald-500/10 text-emerald-400 border-0" : ""}`}
                                                >
                                                    {client.status}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3">
                                                <Link href={`/dashboard/clients/${client.id}`}>
                                                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </Card>
                    </div>

                    {/* Mobile cards */}
                    <div className="lg:hidden space-y-2">
                        {clients.map((client) => (
                            <Link
                                key={client.id}
                                href={`/dashboard/clients/${client.id}`}
                                className="block"
                            >
                                <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 min-w-0 flex-1">
                                            <div className="h-10 w-10 rounded-full bg-brand/10 text-brand flex items-center justify-center text-sm font-semibold shrink-0">
                                                {client.full_name
                                                    .split(" ")
                                                    .map((n) => n[0])
                                                    .join("")}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-sm font-medium truncate">
                                                        {client.full_name}
                                                    </p>
                                                    <Badge
                                                        variant={
                                                            client.status === "active"
                                                                ? "default"
                                                                : "secondary"
                                                        }
                                                        className={`text-xs ${client.status === "active" ? "bg-emerald-500/10 text-emerald-400 border-0" : ""}`}
                                                    >
                                                        {client.status}
                                                    </Badge>
                                                    {client.renewal_due && (
                                                        <Badge
                                                            variant="outline"
                                                            className="text-xs bg-amber-500/10 text-amber-400 border-amber-500/20"
                                                        >
                                                            <AlertTriangle className="h-3 w-3 mr-1" />
                                                            Renewal
                                                        </Badge>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                                                    {client.program_name && (
                                                        <span>{client.program_name}</span>
                                                    )}
                                                    {client.end_date && (
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="h-3 w-3" />
                                                            {formatDate(client.end_date)}
                                                        </span>
                                                    )}
                                                    <EnergyBadge score={client.energy_score} />
                                                </div>
                                            </div>
                                        </div>
                                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
