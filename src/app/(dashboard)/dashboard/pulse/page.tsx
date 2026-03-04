"use client";

import { useState, useMemo } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import {
    Activity,
    MessageCircle,
    ChevronLeft,
    ChevronRight,
    Send,
    Loader2,
    ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useApiData } from "@/lib/hooks";

interface SummaryData {
    id: string;
    week_start_date: string;
    week_end_date: string;
    summary_text: string;
    total_clients: number;
    responded_count: number;
    avg_energy_score: number | null;
    generated_at: string;
}

interface CheckInData {
    id: string;
    client_id: string;
    check_date: string;
    responded_at: string | null;
    clients?: { id: string; full_name: string; whatsapp_number: string };
}

export default function PulsePage() {
    const [weekOffset, setWeekOffset] = useState(0);

    // Calculate week date from offset
    const weekDate = useMemo(() => {
        const d = new Date();
        d.setDate(d.getDate() - (d.getDay() + 7 * weekOffset));
        return d.toISOString().split("T")[0];
    }, [weekOffset]);

    const { data: summaries, loading: summaryLoading } = useApiData<SummaryData[]>(
        `/api/checkins/summary/${weekDate}`
    );
    const { data: checkins, loading: checkinsLoading } = useApiData<CheckInData[]>(
        `/api/checkins/weekly?week=${weekDate}`
    );

    const summary = summaries?.[0];
    const loading = summaryLoading || checkinsLoading;

    const nonResponders = (checkins || []).filter((c) => !c.responded_at);

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
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <Activity className="h-6 w-6 text-brand" />
                        Weekly Pulse
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {summary
                            ? `Week of ${new Date(summary.week_start_date).toLocaleDateString("en-IN", { month: "short", day: "numeric" })} — ${new Date(summary.week_end_date).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}`
                            : "No summary available for this week"}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" disabled={weekOffset >= 11} onClick={() => setWeekOffset((w) => w + 1)}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground min-w-[80px] text-center">
                        {weekOffset === 0 ? "This Week" : `${weekOffset}w ago`}
                    </span>
                    <Button variant="outline" size="icon" disabled={weekOffset === 0} onClick={() => setWeekOffset((w) => w - 1)}>
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* AI Summary */}
                <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between pb-3">
                        <CardTitle className="text-lg flex items-center gap-2">
                            <MessageCircle className="h-4 w-4 text-success" />
                            AI Coaching Summary
                        </CardTitle>
                        <Badge className="bg-success/10 text-success border-0 text-xs">
                            Gemini AI
                        </Badge>
                    </CardHeader>
                    <CardContent>
                        {summary ? (
                            <>
                                <div className="bg-muted/50 rounded-lg p-4 whitespace-pre-line text-sm leading-relaxed">
                                    {summary.summary_text}
                                </div>
                                <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                                    <span>
                                        Generated{" "}
                                        {new Date(summary.generated_at).toLocaleString("en-IN", {
                                            month: "short",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })}
                                    </span>
                                    <span>·</span>
                                    <span>
                                        {summary.responded_count} of {summary.total_clients} responded
                                    </span>
                                </div>
                            </>
                        ) : (
                            <p className="text-sm text-muted-foreground text-center py-6">
                                No AI summary generated for this week yet. Summaries are generated after check-in responses come in.
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Non-Responders */}
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">Non-Responders</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {nonResponders.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-4">
                                🎉 Everyone responded!
                            </p>
                        ) : (
                            nonResponders.map((checkin) => {
                                const name = checkin.clients?.full_name || "Unknown";
                                return (
                                    <div
                                        key={checkin.id}
                                        className="flex items-center justify-between p-2.5 rounded-lg bg-muted/50"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded-full bg-warning/10 text-warning flex items-center justify-center text-xs font-semibold">
                                                {name.split(" ").map((n: string) => n[0]).join("")}
                                            </div>
                                            <span className="text-sm">{name}</span>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-8 text-xs"
                                            onClick={() => {
                                                const phone = checkin.clients?.whatsapp_number?.replace(/\D/g, "");
                                                if (phone) window.open(`https://wa.me/${phone}`, "_blank");
                                            }}
                                        >
                                            <Send className="h-3 w-3 mr-1" />
                                            Follow up
                                        </Button>
                                    </div>
                                );
                            })
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Response Rate Chart — will be populated when enough data exists */}
            {summary && (
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg">This Week&apos;s Stats</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <p className="text-2xl font-bold">{summary.responded_count}/{summary.total_clients}</p>
                                <p className="text-xs text-muted-foreground">Responded</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {summary.total_clients > 0
                                        ? Math.round((summary.responded_count / summary.total_clients) * 100)
                                        : 0}%
                                </p>
                                <p className="text-xs text-muted-foreground">Response Rate</p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{summary.avg_energy_score ?? "—"}</p>
                                <p className="text-xs text-muted-foreground">Avg Energy</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

