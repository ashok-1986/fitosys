"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Brain, ArrowRight, Loader2, Plus, Sparkles, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface DemoClient {
    id: number;
    name: string;
    energy: number;
    sessions: number;
}

export default function AIDemoPage() {
    const [mounted, setMounted] = useState(false);
    const [coachName, setCoachName] = useState("Priya");
    const [clients, setClients] = useState<DemoClient[]>([
        { id: 1, name: "Rohan", energy: 6, sessions: 3 },
        { id: 2, name: "Neha", energy: 4, sessions: 1 },
        { id: 3, name: "Arjun", energy: 8, sessions: 4 },
    ]);
    const [generating, setGenerating] = useState(false);
    const [summary, setSummary] = useState<string | null>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    const addClient = () => {
        if (clients.length >= 5) return;
        setClients([
            ...clients,
            { id: Date.now(), name: "", energy: 5, sessions: 0 },
        ]);
    };

    const updateClient = (id: number, field: keyof DemoClient, value: string | number) => {
        setClients(clients.map(c => c.id === id ? { ...c, [field]: value } : c));
    };

    const removeClient = (id: number) => {
        setClients(clients.filter(c => c.id !== id));
    };

    const generateSummary = async () => {
        setGenerating(true);
        setSummary(null);

        try {
            const res = await fetch("/api/demo-summary", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    coach_name: coachName,
                    clients: clients.filter(c => c.name.trim() !== ""),
                }),
            });

            if (!res.ok) throw new Error("Failed to generate");
            if (!res.body) throw new Error("No response body");

            const reader = res.body.getReader();
            const decoder = new TextDecoder();

            let firstChunk = true;

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                if (firstChunk) {
                    setSummary("");
                    firstChunk = false;
                }

                const chunk = decoder.decode(value, { stream: true });
                setSummary((prev) => (prev || "") + chunk);
            }
        } catch (err) {
            console.error(err);
            setSummary("Could not generate summary at this time. Please try again.");
        } finally {
            setGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <nav className="border-b border-border bg-card">
                <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
                    <Link href="/">
                        <h1 className="text-xl font-bold tracking-tight">
                            <span className="text-brand">Fito</span>
                            <span className="text-foreground">sys</span>
                        </h1>
                    </Link>
                    <Link href="/">
                        <Button variant="ghost" size="sm">Back to Home</Button>
                    </Link>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto px-4 py-12 md:py-20 lg:grid lg:grid-cols-2 lg:gap-12 items-start">
                {/* Left Side: Input Form */}
                <div className="space-y-6 mb-12 lg:mb-0">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-bold uppercase tracking-wider mb-4">
                            <Brain className="h-3.5 w-3.5" /> LIVE AI DEMO
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
                            Try Your Monday Summary
                        </h1>
                        <p className="text-muted-foreground">
                            (Uses real AI — takes about 10 seconds to generate)
                        </p>
                    </div>

                    <Card className="border-border/50 bg-card/50 shadow-sm">
                        <CardContent className="p-6">
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="coach">Your name:</Label>
                                    <Input
                                        id="coach"
                                        value={coachName}
                                        onChange={(e) => setCoachName(e.target.value)}
                                        className="bg-background"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label>Add up to 5 clients this week:</Label>
                                        <span className="text-xs text-muted-foreground">{clients.length}/5</span>
                                    </div>

                                    <div className="space-y-3">
                                        {clients.map((client, index) => (
                                            <div key={client.id} className="flex flex-col sm:flex-row gap-2 items-end sm:items-center bg-background p-3 rounded-lg border border-border/50">
                                                <div className="w-full sm:flex-1 space-y-1">
                                                    <span className="text-[10px] text-muted-foreground uppercase font-semibold pl-1">Name</span>
                                                    <Input
                                                        placeholder="Name"
                                                        value={client.name}
                                                        onChange={(e) => updateClient(client.id, "name", e.target.value)}
                                                        className="h-9"
                                                    />
                                                </div>
                                                <div className="w-full sm:w-24 space-y-1">
                                                    <span className="text-[10px] text-muted-foreground uppercase font-semibold pl-1">Energy (/10)</span>
                                                    <Input
                                                        type="number"
                                                        min="1" max="10"
                                                        value={client.energy}
                                                        onChange={(e) => updateClient(client.id, "energy", parseInt(e.target.value) || 0)}
                                                        className="h-9"
                                                    />
                                                </div>
                                                <div className="w-full sm:w-24 space-y-1">
                                                    <span className="text-[10px] text-muted-foreground uppercase font-semibold pl-1">Sessions</span>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        value={client.sessions}
                                                        onChange={(e) => updateClient(client.id, "sessions", parseInt(e.target.value) || 0)}
                                                        className="h-9"
                                                    />
                                                </div>
                                                {clients.length > 1 && (
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-9 w-9 text-muted-foreground hover:text-destructive shrink-0 hidden sm:inline-flex"
                                                        onClick={() => removeClient(client.id)}
                                                    >
                                                        &times;
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {clients.length < 5 && (
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={addClient}
                                            className="w-full border-dashed"
                                        >
                                            <Plus className="h-4 w-4 mr-2" /> Add another client
                                        </Button>
                                    )}
                                </div>

                                <Button
                                    size="lg"
                                    className="w-full bg-brand hover:bg-brand/90 text-white font-bold h-12 shadow-md shadow-brand/20"
                                    onClick={generateSummary}
                                    disabled={generating || clients.every(c => c.name.trim() === "")}
                                >
                                    {generating ? (
                                        <>
                                            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Sparkles className="mr-2 h-5 w-5" /> Generate My Summary <ArrowRight className="ml-2 h-4 w-4" />
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Side: Results */}
                <div className="relative">
                    {summary === null && !generating && (
                        <div className="h-full min-h-[400px] border-2 border-dashed border-border/50 rounded-2xl flex flex-col items-center justify-center text-center p-8 bg-card/20">
                            <Brain className="h-12 w-12 text-muted-foreground/30 mb-4" />
                            <h3 className="text-lg font-semibold text-muted-foreground">Waiting for input</h3>
                            <p className="text-sm text-muted-foreground mt-2 max-w-[250px]">
                                Add your mock clients and click generate to see the AI in action.
                            </p>
                        </div>
                    )}

                    {summary === null && generating && (
                        <div className="h-full min-h-[400px] border border-brand/20 rounded-2xl flex flex-col items-center justify-center text-center p-8 bg-card shadow-[0_0_30px_rgba(232,0,29,0.05)]">
                            <div className="relative mb-6">
                                <div className="absolute inset-0 bg-brand/20 rounded-full blur-xl animate-pulse" />
                                <div className="relative h-16 w-16 bg-brand/10 border border-brand/30 rounded-full flex items-center justify-center">
                                    <Brain className="h-8 w-8 text-brand animate-pulse" />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold mb-2">Analyzing raw data...</h3>
                            <p className="text-sm text-muted-foreground animate-pulse">
                                Identifying patterns, scoring energy, and drafting coaching priorities.
                            </p>
                        </div>
                    )}

                    {summary !== null && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <Card className="border-border/50 shadow-xl overflow-hidden bg-card">
                                <div className="bg-[#111111] border-b border-[#222222] px-6 py-4 flex items-center gap-3">
                                    <div className="h-2.5 w-2.5 rounded-full bg-success animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                    <div>
                                        <h3 className="font-bold text-white text-sm font-playfair">Your Monday Coaching Pulse</h3>
                                        <p className="text-[#A0A0A0] text-[11px]">
                                            {mounted ? `Week of ${new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}` : 'Loading...'}
                                        </p>
                                    </div>
                                </div>
                                <CardContent className="p-0 bg-background">
                                    <div className="p-6 text-[#E0E0E0] text-[15px] leading-relaxed whitespace-pre-wrap font-playfair">
                                        {summary}
                                        {generating && <span className="ml-1 inline-block w-2.5 h-4 bg-brand animate-pulse align-middle" />}
                                    </div>
                                    <div className="bg-[#111111] border-t border-[#222222] p-6 text-center">
                                        <p className="text-[#A0A0A0] text-sm mb-4 font-playfair">
                                            This is what lands in your WhatsApp every Monday at 7 AM — automatically.
                                        </p>
                                        <Link href="/signup">
                                            <Button className="w-full bg-[#E8001D] hover:bg-[#9E0014] text-white">
                                                Start Free Trial <ArrowRight className="ml-2 h-4 w-4" />
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
