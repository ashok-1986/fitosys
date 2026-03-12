"use client";

import { use, useState, useEffect } from "react";
import { CheckCircle, Heart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { RazorpayButton } from "@/components/razorpay-button";

const GOALS = [
    "Weight Loss",
    "Muscle Gain",
    "Flexibility",
    "Overall Fitness",
    "Mental Wellness",
    "Spiritual Practice",
];

interface Coach {
    id: string;
    full_name: string;
    coaching_type: string[];
    slug: string;
}

interface Program {
    id: string;
    name: string;
    description?: string;
    duration_weeks: number;
    price: number;
    currency: string;
    is_active: boolean;
}

export default function IntakePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    
    const [coach, setCoach] = useState<Coach | null>(null);
    const [programs, setPrograms] = useState<Program[]>([]);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState<string | null>(null);

    const [form, setForm] = useState({
        full_name: "",
        whatsapp_number: "",
        email: "",
        age: "",
        primary_goal: "",
        health_notes: "",
        program_id: "",
        agree_terms: false,
    });
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch coach and programs on mount
    useEffect(() => {
        async function fetchData() {
            try {
                const res = await fetch(`/api/programs/public/${slug}`);
                if (!res.ok) {
                    if (res.status === 404) {
                        setFetchError("Coach not found or inactive");
                    } else {
                        setFetchError("Failed to load coach details");
                    }
                    return;
                }
                const data = await res.json();
                setCoach(data.coach);
                setPrograms(data.programs || []);
            } catch {
                setFetchError("Failed to connect to server");
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [slug]);

    const selectedProgram = programs.find((p) => p.id === form.program_id);

    const isFormValid =
        form.full_name &&
        form.email &&
        form.whatsapp_number &&
        form.primary_goal &&
        form.program_id &&
        form.agree_terms;

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-brand" />
            </div>
        );
    }

    if (fetchError || !coach) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center px-4">
                <Card className="max-w-md w-full text-center p-8 shadow-lg border-destructive/50">
                    <h2 className="text-2xl font-bold text-destructive">Coach Not Found</h2>
                    <p className="text-muted-foreground mt-2">{fetchError}</p>
                </Card>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center px-4">
                <Card className="max-w-md w-full text-center p-8 shadow-lg">
                    <CheckCircle className="h-16 w-16 text-success mx-auto mb-4" />
                    <h2 className="text-2xl font-bold">You&apos;re all set! 🎉</h2>
                    <p className="text-muted-foreground mt-2">
                        Welcome to {coach.full_name}&apos;s coaching program. You&apos;ll receive a
                        WhatsApp confirmation shortly.
                    </p>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Hero */}
            <div className="bg-card border-b border-border">
                <div className="max-w-lg mx-auto px-4 py-10 text-center">
                    <div className="h-16 w-16 rounded-full bg-brand/10 text-brand flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                        {coach.full_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold">{coach.full_name}</h1>
                    <div className="flex items-center justify-center gap-2 mt-2 text-sm text-muted-foreground">
                        {coach.coaching_type.map((t) => (
                            <span
                                key={t}
                                className="capitalize px-2 py-0.5 rounded-full bg-brand/5 text-brand text-xs"
                            >
                                {t}
                            </span>
                        ))}
                    </div>
                    <p className="mt-4 text-muted-foreground">
                        Ready to start your journey? Fill in your details below.
                    </p>
                </div>
            </div>

            {/* Form */}
            <div className="max-w-lg mx-auto px-4 py-8">
                <div className="space-y-6">
                    {/* Personal Details */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">Your Details</h2>
                        <div className="space-y-2">
                            <Label htmlFor="full_name">Full Name *</Label>
                            <Input
                                id="full_name"
                                placeholder="Your full name"
                                value={form.full_name}
                                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label htmlFor="whatsapp">WhatsApp Number *</Label>
                                <Input
                                    id="whatsapp"
                                    type="tel"
                                    placeholder="+91 98765 43210"
                                    value={form.whatsapp_number}
                                    onChange={(e) =>
                                        setForm({ ...form, whatsapp_number: e.target.value })
                                    }
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="age">Age *</Label>
                                <Input
                                    id="age"
                                    type="number"
                                    placeholder="28"
                                    min={16}
                                    max={80}
                                    value={form.age}
                                    onChange={(e) => setForm({ ...form, age: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address *</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    {/* Goals */}
                    <div className="space-y-3">
                        <Label>Primary Goal *</Label>
                        <div className="grid grid-cols-2 gap-2">
                            {GOALS.map((goal) => (
                                <button
                                    key={goal}
                                    type="button"
                                    onClick={() => setForm({ ...form, primary_goal: goal })}
                                    className={`p-3 rounded-lg border text-sm text-left transition-all ${form.primary_goal === goal
                                        ? "border-brand bg-brand/5 text-brand font-medium"
                                        : "border-border hover:border-muted-foreground"
                                        }`}
                                >
                                    {goal}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="health_notes">Health Conditions (Optional)</Label>
                        <Textarea
                            id="health_notes"
                            placeholder="Any health conditions, injuries, or allergies we should know about..."
                            value={form.health_notes}
                            onChange={(e) =>
                                setForm({ ...form, health_notes: e.target.value })
                            }
                            rows={3}
                        />
                    </div>

                    {/* Program Selection */}
                    <div className="space-y-3">
                        <h2 className="text-lg font-semibold">Select Your Program</h2>
                        <div className="space-y-2">
                            {programs.map((prog) => (
                                <button
                                    key={prog.id}
                                    type="button"
                                    onClick={() => setForm({ ...form, program_id: prog.id })}
                                    className={`w-full p-4 rounded-lg border text-left transition-all ${form.program_id === prog.id
                                        ? "border-brand bg-brand/5 ring-1 ring-brand"
                                        : "border-border hover:border-muted-foreground"
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">{prog.name}</p>
                                            {prog.description && (
                                                <p className="text-xs text-muted-foreground mt-1">
                                                    {prog.description}
                                                </p>
                                            )}
                                        </div>
                                        <div className="text-right shrink-0 ml-4">
                                            <p className="text-lg font-bold text-brand">
                                                ₹{prog.price.toLocaleString()}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {prog.duration_weeks} weeks
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Terms & Payment */}
                    <div className="space-y-4">
                        <label className="flex items-start gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={form.agree_terms}
                                onChange={(e) =>
                                    setForm({ ...form, agree_terms: e.target.checked })
                                }
                                className="mt-0.5 h-4 w-4 rounded border-border accent-brand"
                                required
                            />
                            <span className="text-sm text-muted-foreground">
                                I agree to the{" "}
                                <a href="/terms" className="text-brand underline">
                                    Terms of Service
                                </a>{" "}
                                and{" "}
                                <a href="/privacy" className="text-brand underline">
                                    Privacy Policy
                                </a>
                            </span>
                        </label>

                        {error && (
                            <p className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">
                                {error}
                            </p>
                        )}

                        {isFormValid ? (
                            <RazorpayButton
                                programId={form.program_id}
                                slug={slug}
                                clientData={{
                                    full_name: form.full_name,
                                    whatsapp_number: form.whatsapp_number,
                                    email: form.email,
                                    age: Number(form.age),
                                    primary_goal: form.primary_goal,
                                    health_notes: form.health_notes || undefined,
                                }}
                                label={
                                    selectedProgram
                                        ? `Pay ₹${selectedProgram.price.toLocaleString()} — Secure Checkout`
                                        : "Pay Securely with Razorpay"
                                }
                                onSuccess={() => setSubmitted(true)}
                                onError={(err) => setError(err)}
                            />
                        ) : (
                            <Button
                                disabled
                                className="w-full h-12 bg-brand hover:bg-brand/90 text-white text-base font-semibold"
                            >
                                {selectedProgram
                                    ? `Pay ₹${selectedProgram.price.toLocaleString()} — Secure Checkout`
                                    : "Select a program to continue"}
                            </Button>
                        )}

                        <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
                            <Heart className="h-3 w-3" /> Powered by Fitosys · Payments via
                            Razorpay
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
