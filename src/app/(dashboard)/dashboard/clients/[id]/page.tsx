"use client";

import { use, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
    ArrowLeft,
    MessageCircle,
    CreditCard,
    Zap,
    Calendar,
    Mail,
    Phone,
    Loader2,
    TrendingDown,
    TrendingUp,
    Dumbbell,
    Flame,
    ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ClientData {
    id: string;
    full_name: string;
    whatsapp_number: string;
    email: string;
    age: number | null;
    primary_goal: string | null;
    health_notes: string | null;
    status: string;
}

interface EnrollmentData {
    id: string;
    program_id: string;
    start_date: string;
    end_date: string;
    status: string;
    amount_paid: number;
    currency: string;
    programs?: { name: string; duration_weeks: number };
}

interface CheckInData {
    id: string;
    week_number: number;
    check_date: string;
    weight_kg: number | null;
    sessions_completed: number | null;
    energy_score: number | null;
    notes: string | null;
    responded_at: string | null;
}

interface PaymentData {
    id: string;
    amount: number;
    currency: string;
    payment_type: string;
    paid_at: string | null;
    enrollments?: { programs?: { name: string } };
}

// SVG Progress Ring component
function ProgressRing({
    percent,
    size = 80,
    strokeWidth = 6,
}: {
    percent: number;
    size?: number;
    strokeWidth?: number;
}) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percent / 100) * circumference;

    return (
        <svg width={size} height={size} className="transform -rotate-90">
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                className="text-border"
            />
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                className="text-brand transition-all duration-700 ease-out"
            />
        </svg>
    );
}

export default function ClientProfilePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);
    const [client, setClient] = useState<ClientData | null>(null);
    const [enrollment, setEnrollment] = useState<EnrollmentData | null>(null);
    const [checkins, setCheckins] = useState<CheckInData[]>([]);
    const [payments, setPayments] = useState<PaymentData[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = useCallback(async () => {
        setLoading(true);
        try {
            const [clientRes, checkinsRes, paymentsRes] = await Promise.all([
                fetch(`/api/clients/${id}`),
                fetch(`/api/clients/${id}/checkins`),
                fetch(`/api/clients/${id}/payments`),
            ]);

            if (clientRes.ok) {
                const clientData = await clientRes.json();
                setClient(clientData);

                // Also fetch active enrollment for this client
                const enrollRes = await fetch(
                    `/api/enrollments?client_id=${id}`
                );
                if (enrollRes.ok) {
                    const enrollments = await enrollRes.json();
                    const active = (enrollments || []).find(
                        (e: EnrollmentData) => e.status === "active"
                    );
                    setEnrollment(active || null);
                }
            }
            if (checkinsRes.ok) setCheckins(await checkinsRes.json());
            if (paymentsRes.ok) setPayments(await paymentsRes.json());
        } catch (e) {
            console.error("Failed to load client data:", e);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (!client) {
        return (
            <div className="text-center py-20">
                <p className="text-muted-foreground">Client not found.</p>
                <Link href="/dashboard/clients">
                    <Button variant="outline" className="mt-4">
                        Back to Clients
                    </Button>
                </Link>
            </div>
        );
    }

    // Aggregated stats
    const respondedCheckins = checkins.filter((c) => c.responded_at);
    const totalSessions = respondedCheckins.reduce(
        (sum, c) => sum + (c.sessions_completed || 0),
        0
    );

    const weights = respondedCheckins
        .filter((c) => c.weight_kg)
        .sort(
            (a, b) =>
                new Date(a.check_date).getTime() -
                new Date(b.check_date).getTime()
        );
    const firstWeight = weights[0]?.weight_kg;
    const lastWeight = weights[weights.length - 1]?.weight_kg;
    const weightDelta =
        firstWeight && lastWeight ? lastWeight - firstWeight : null;

    const latestCheckin = respondedCheckins.sort(
        (a, b) =>
            new Date(b.check_date).getTime() -
            new Date(a.check_date).getTime()
    )[0];

    // Check-in streak: count consecutive weeks responded
    const sortedCheckins = [...checkins].sort(
        (a, b) => b.week_number - a.week_number
    );
    let streak = 0;
    for (const c of sortedCheckins) {
        if (c.responded_at) streak++;
        else break;
    }

    // Program progress
    let progressPercent = 0;
    let daysRemaining = 0;
    let totalDays = 0;
    if (enrollment) {
        const start = new Date(enrollment.start_date).getTime();
        const end = new Date(enrollment.end_date).getTime();
        const now = Date.now();
        totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        const elapsed = Math.ceil((now - start) / (1000 * 60 * 60 * 24));
        progressPercent = Math.min(
            100,
            Math.max(0, Math.round((elapsed / totalDays) * 100))
        );
        daysRemaining = Math.max(
            0,
            Math.ceil((end - now) / (1000 * 60 * 60 * 24))
        );
    }

    const handleWhatsApp = () => {
        const phone = client.whatsapp_number.replace(/\D/g, "");
        window.open(`https://wa.me/${phone}`, "_blank");
    };

    return (
        <div className="space-y-6">
            {/* Back + Header */}
            <div>
                <Link
                    href="/dashboard/clients"
                    className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4"
                >
                    <ArrowLeft className="h-4 w-4" /> Back to Clients
                </Link>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-full bg-brand/10 text-brand flex items-center justify-center text-xl font-bold">
                            {client.full_name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h1 className="text-2xl font-bold">
                                    {client.full_name}
                                </h1>
                                <Badge
                                    variant={
                                        client.status === "active"
                                            ? "default"
                                            : "secondary"
                                    }
                                    className={
                                        client.status === "active"
                                            ? "bg-emerald-500/10 text-emerald-400 border-0"
                                            : ""
                                    }
                                >
                                    {client.status}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                                <span className="flex items-center gap-1">
                                    <Phone className="h-3 w-3" />
                                    {client.whatsapp_number}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Mail className="h-3 w-3" />
                                    {client.email}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleWhatsApp}
                        >
                            <MessageCircle className="h-4 w-4 mr-1" />
                            WhatsApp
                            <ExternalLink className="h-3 w-3 ml-1 opacity-50" />
                        </Button>
                        <Button
                            size="sm"
                            className="bg-brand hover:bg-brand/90 text-white"
                        >
                            <CreditCard className="h-4 w-4 mr-1" />
                            Renewal Link
                        </Button>
                    </div>
                </div>
            </div>

            <Tabs defaultValue="overview">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="checkins">Check-ins</TabsTrigger>
                    <TabsTrigger value="payments">Payments</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4 mt-4">
                    {/* Program Progress */}
                    {enrollment && (
                        <Card>
                            <CardContent className="pt-5">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <p className="text-sm text-muted-foreground">
                                            Current Program
                                        </p>
                                        <p className="text-lg font-semibold mt-1">
                                            {enrollment.programs?.name ||
                                                "Program"}
                                        </p>
                                        <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(
                                                    enrollment.start_date
                                                ).toLocaleDateString("en-IN", {
                                                    month: "short",
                                                    day: "numeric",
                                                })}{" "}
                                                →{" "}
                                                {new Date(
                                                    enrollment.end_date
                                                ).toLocaleDateString("en-IN", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric",
                                                })}
                                            </span>
                                            <span>
                                                {daysRemaining > 0
                                                    ? `${daysRemaining} days left`
                                                    : "Expired"}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="relative flex items-center justify-center">
                                        <ProgressRing
                                            percent={progressPercent}
                                        />
                                        <span className="absolute text-sm font-bold">
                                            {progressPercent}%
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <Card>
                            <CardContent className="pt-5">
                                <p className="text-xs text-muted-foreground">
                                    Total Sessions
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <Dumbbell className="h-4 w-4 text-brand" />
                                    <span className="text-xl font-bold">
                                        {totalSessions}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-5">
                                <p className="text-xs text-muted-foreground">
                                    Weight Change
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    {weightDelta !== null ? (
                                        <>
                                            {weightDelta <= 0 ? (
                                                <TrendingDown className="h-4 w-4 text-emerald-400" />
                                            ) : (
                                                <TrendingUp className="h-4 w-4 text-amber-400" />
                                            )}
                                            <span className="text-xl font-bold">
                                                {weightDelta > 0 ? "+" : ""}
                                                {weightDelta.toFixed(1)} kg
                                            </span>
                                        </>
                                    ) : (
                                        <span className="text-xl font-bold text-muted-foreground">
                                            —
                                        </span>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-5">
                                <p className="text-xs text-muted-foreground">
                                    Energy Score
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <Zap className="h-4 w-4 text-amber-400" />
                                    <span className="text-xl font-bold">
                                        {latestCheckin?.energy_score ?? "—"}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        /10
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="pt-5">
                                <p className="text-xs text-muted-foreground">
                                    Check-in Streak
                                </p>
                                <div className="flex items-center gap-2 mt-1">
                                    <Flame className="h-4 w-4 text-orange-400" />
                                    <span className="text-xl font-bold">
                                        {streak}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                        weeks
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Info cards */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        <Card>
                            <CardContent className="pt-5">
                                <p className="text-sm text-muted-foreground mb-1">
                                    Goal
                                </p>
                                <p className="font-semibold">
                                    {client.primary_goal || "Not set"}
                                </p>
                                {client.age && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Age: {client.age}
                                    </p>
                                )}
                            </CardContent>
                        </Card>
                        {client.health_notes && (
                            <Card>
                                <CardContent className="pt-5">
                                    <p className="text-sm text-muted-foreground mb-1">
                                        Health Notes
                                    </p>
                                    <p className="text-sm">
                                        {client.health_notes}
                                    </p>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="checkins" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Check-in History
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {checkins.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-6">
                                    No check-ins yet.
                                </p>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="border-b text-muted-foreground">
                                                <th className="text-left py-2 pr-4 font-medium">
                                                    Week
                                                </th>
                                                <th className="text-left py-2 pr-4 font-medium">
                                                    Date
                                                </th>
                                                <th className="text-right py-2 pr-4 font-medium">
                                                    Weight
                                                </th>
                                                <th className="text-right py-2 pr-4 font-medium">
                                                    Sessions
                                                </th>
                                                <th className="text-right py-2 pr-4 font-medium">
                                                    Energy
                                                </th>
                                                <th className="text-left py-2 font-medium">
                                                    Notes
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {checkins.map((c) => (
                                                <tr
                                                    key={c.id}
                                                    className="border-b last:border-0"
                                                >
                                                    <td className="py-3 pr-4">
                                                        Wk {c.week_number}
                                                    </td>
                                                    <td className="py-3 pr-4">
                                                        {new Date(
                                                            c.check_date
                                                        ).toLocaleDateString(
                                                            "en-IN",
                                                            {
                                                                month: "short",
                                                                day: "numeric",
                                                            }
                                                        )}
                                                    </td>
                                                    <td className="py-3 pr-4 text-right">
                                                        {c.weight_kg
                                                            ? `${c.weight_kg} kg`
                                                            : "—"}
                                                    </td>
                                                    <td className="py-3 pr-4 text-right">
                                                        {c.sessions_completed ??
                                                            "—"}
                                                    </td>
                                                    <td className="py-3 pr-4 text-right">
                                                        {c.energy_score
                                                            ? `${c.energy_score}/10`
                                                            : "—"}
                                                    </td>
                                                    <td className="py-3 text-muted-foreground truncate max-w-[200px]">
                                                        {c.notes ||
                                                            (c.responded_at
                                                                ? "—"
                                                                : "No response")}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="payments" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">
                                Payment History
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {payments.length === 0 ? (
                                <p className="text-sm text-muted-foreground text-center py-6">
                                    No payments yet.
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {payments.map((p) => (
                                        <div
                                            key={p.id}
                                            className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                                        >
                                            <div>
                                                <p className="text-sm font-medium">
                                                    {p.enrollments?.programs
                                                        ?.name || "Payment"}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {p.paid_at
                                                        ? new Date(
                                                            p.paid_at
                                                        ).toLocaleDateString(
                                                            "en-IN",
                                                            {
                                                                year: "numeric",
                                                                month: "short",
                                                                day: "numeric",
                                                            }
                                                        )
                                                        : "Pending"}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Badge
                                                    variant={
                                                        p.payment_type ===
                                                            "renewal"
                                                            ? "outline"
                                                            : "secondary"
                                                    }
                                                    className="text-xs"
                                                >
                                                    {p.payment_type}
                                                </Badge>
                                                <span className="text-sm font-semibold">
                                                    {p.currency === "INR"
                                                        ? "₹"
                                                        : p.currency === "GBP"
                                                            ? "£"
                                                            : "$"}
                                                    {p.amount.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
