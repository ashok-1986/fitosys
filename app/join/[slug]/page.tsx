"use client";

import { cn } from "@/lib/utils";
import { use, useState } from "react";
import { useQuery } from "@tanstack/react-query";
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

interface IntakeData {
    coach: Coach;
    programs: Program[];
}

const fetchIntakeData = async (slug: string): Promise<IntakeData> => {
    const res = await fetch(`/api/programs/public/${slug}`);
    if (!res.ok) {
        if (res.status === 404) {
            throw new Error("Coach not found or inactive");
        }
        throw new Error("Failed to load coach details");
    }
    return res.json();
};

export default function IntakePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);

    const { data, isLoading: loading, error: fetchError } = useQuery<IntakeData, Error>({
        queryKey: ["intakeData", slug],
        queryFn: () => fetchIntakeData(slug),
    });

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

    const coach = data?.coach;
    const programs = data?.programs || [];

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
                    <p className="text-muted-foreground mt-2">{fetchError?.message || "An unknown error occurred."}</p>
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
        <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-brand/30">
            {/* Top Bar / Coach Badge */}
            <div className="relative border-b border-white/5 bg-gradient-to-b from-brand/5 to-transparent">
                <div className="max-w-xl mx-auto px-6 py-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#9e0014] to-brand flex items-center justify-center text-xl font-display font-black text-white shadow-lg shadow-brand/20">
                            {coach.full_name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                            <p className="text-[10px] font-display font-bold tracking-widest text-white/40 uppercase">Your Coach</p>
                            <h2 className="text-base font-bold text-white">{coach.full_name}</h2>
                            <div className="flex gap-2 mt-1">
                                {coach.coaching_type.map(t => (
                                    <span key={t} className="text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-sm bg-white/5 text-white/60 border border-white/10">
                                        {t}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-display font-black uppercase leading-[0.9] mb-2">
                        Start Your <span className="text-brand">Journey</span>
                    </h1>
                    <p className="text-sm text-white/50 max-w-sm">
                        Complete your profile and choose a program to begin training with {coach.full_name.split(" ")[0]}.
                    </p>
                </div>
            </div>

            <div className="max-w-xl mx-auto px-6 py-10">
                {/* Step Indicator */}
                <div className="flex gap-2 mb-10">
                    <div className={cn("flex-1 h-1 rounded-full transition-colors duration-500", form.full_name && form.whatsapp_number ? "bg-brand" : "bg-white/10")} />
                    <div className={cn("flex-1 h-1 rounded-full transition-colors duration-500", form.primary_goal ? "bg-brand/40" : "bg-white/10")} />
                    <div className={cn("flex-1 h-1 rounded-full transition-colors duration-500", form.program_id ? "bg-brand/20" : "bg-white/10")} />
                </div>

                <div className="space-y-12">
                    {/* Personal Details Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand/10 text-brand text-xs font-display font-bold border border-brand/20">01</span>
                            <h3 className="font-display text-lg font-bold tracking-widest uppercase text-white/90">Personal Profile</h3>
                        </div>

                        <div className="grid gap-5">
                            <div className="space-y-2">
                                <Label htmlFor="full_name" className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Full Name</Label>
                                <Input
                                    id="full_name"
                                    placeholder="Enter your full name"
                                    className="h-12 bg-white/[0.03] border-white/10 focus:border-brand/50 transition-all text-white placeholder:text-white/20"
                                    value={form.full_name}
                                    onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="whatsapp" className="text-[10px] uppercase tracking-widest text-white/40 font-bold">WhatsApp Number</Label>
                                    <Input
                                        id="whatsapp"
                                        type="tel"
                                        placeholder="+91"
                                        className="h-12 bg-white/[0.03] border-white/10 focus:border-brand/50 transition-all text-white placeholder:text-white/20"
                                        value={form.whatsapp_number}
                                        onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="age" className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Age</Label>
                                    <Input
                                        id="age"
                                        type="number"
                                        placeholder="24"
                                        className="h-12 bg-white/[0.03] border-white/10 focus:border-brand/50 transition-all text-white placeholder:text-white/20"
                                        value={form.age}
                                        onChange={(e) => setForm({ ...form, age: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-[10px] uppercase tracking-widest text-white/40 font-bold">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="your@email.com"
                                    className="h-12 bg-white/[0.03] border-white/10 focus:border-brand/50 transition-all text-white placeholder:text-white/20"
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Goals Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand/10 text-brand text-xs font-display font-bold border border-brand/20">02</span>
                            <h3 className="font-display text-lg font-bold tracking-widest uppercase text-white/90">Your Fitness Goal</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {GOALS.map((goal) => (
                                <button
                                    key={goal}
                                    type="button"
                                    onClick={() => setForm({ ...form, primary_goal: goal })}
                                    className={cn(
                                        "group relative p-4 rounded-xl border text-sm text-center transition-all duration-300 overflow-hidden",
                                        form.primary_goal === goal
                                            ? "border-brand bg-brand/5 text-white ring-1 ring-brand/50"
                                            : "border-white/5 bg-white/[0.02] text-white/40 hover:border-white/20"
                                    )}
                                >
                                    {form.primary_goal === goal && (
                                        <div className="absolute top-0 left-0 w-1 h-full bg-brand" />
                                    )}
                                    <span className={cn(
                                        "relative z-10 transition-colors",
                                        form.primary_goal === goal && "font-bold text-white"
                                    )}>
                                        {goal}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Program Selection Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand/10 text-brand text-xs font-display font-bold border border-brand/20">03</span>
                            <h3 className="font-display text-lg font-bold tracking-widest uppercase text-white/90">Select Program</h3>
                        </div>

                        <div className="grid gap-4">
                            {programs.map((prog) => (
                                <button
                                    key={prog.id}
                                    type="button"
                                    onClick={() => setForm({ ...form, program_id: prog.id })}
                                    className={cn(
                                        "group relative w-full p-6 rounded-2xl border text-left transition-all duration-500 overflow-hidden",
                                        form.program_id === prog.id
                                            ? "border-brand bg-brand text-white shadow-2xl shadow-brand/20"
                                            : "border-white/5 bg-white/[0.02] hover:border-white/20"
                                    )}
                                >
                                    {/* Selected State Indicator */}
                                    {form.program_id === prog.id && (
                                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl pointer-events-none" />
                                    )}

                                    <div className="flex items-center justify-between relative z-10">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <p className={cn("text-base font-bold", form.program_id === prog.id ? "text-white" : "text-white/90")}>
                                                    {prog.name}
                                                </p>
                                                {form.program_id === prog.id && <CheckCircle className="h-4 w-4 text-white" />}
                                            </div>
                                            <p className={cn("text-xs leading-relaxed max-w-xs", form.program_id === prog.id ? "text-white/70" : "text-white/40")}>
                                                {prog.description || `${prog.duration_weeks} weeks of professional coaching`}
                                            </p>
                                            <div className={cn("inline-block mt-4 text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded bg-black/20", form.program_id === prog.id ? "bg-white/10 text-white" : "text-white/30")}>
                                                {prog.duration_weeks} WEEKS DURATION
                                            </div>
                                        </div>
                                        <div className="text-right pl-6 border-l border-white/10">
                                            <p className={cn("text-3xl font-display font-black leading-none", form.program_id === prog.id ? "text-white" : "text-brand")}>
                                                ₹{prog.price.toLocaleString()}
                                            </p>
                                            <p className={cn("text-[9px] font-bold tracking-widest uppercase mt-1", form.program_id === prog.id ? "text-white/60" : "text-white/30")}>
                                                One-time Payment
                                            </p>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Checkout Section */}
                    <div className="pt-8 border-t border-white/10">
                        <label className="flex items-center gap-4 cursor-pointer mb-8 group">
                            <div className={cn(
                                "h-5 w-5 rounded border flex items-center justify-center transition-all",
                                form.agree_terms ? "bg-brand border-brand" : "border-white/20 group-hover:border-white/40"
                            )}>
                                {form.agree_terms && <CheckCircle className="h-3 w-3 text-white" />}
                            </div>
                            <input
                                type="checkbox"
                                className="hidden"
                                checked={form.agree_terms}
                                onChange={(e) => setForm({ ...form, agree_terms: e.target.checked })}
                            />
                            <span className="text-xs text-white/40 group-hover:text-white/60 transition-colors">
                                I agree to the <a href="/terms" className="text-white hover:text-brand underline decoration-white/20 underline-offset-4">Terms</a> and <a href="/privacy" className="text-white hover:text-brand underline decoration-white/20 underline-offset-4">Privacy Policy</a>
                            </span>
                        </label>

                        {error && (
                            <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium flex gap-3 items-center">
                                <div className="h-5 w-5 rounded-full bg-destructive flex items-center justify-center text-[10px] font-bold text-white">!</div>
                                {error}
                            </div>
                        )}

                        <div className="relative group">
                            {isFormValid ? (
                                <>
                                    <div className="absolute -inset-1 bg-brand/20 blur opacity-0 group-hover:opacity-100 transition duration-500" />
                                    <div className="relative">
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
                                            label={selectedProgram ? `PAY ₹${selectedProgram.price.toLocaleString()} — SECURE CHECKOUT` : "SECURE CHECKOUT"}
                                            onSuccess={() => setSubmitted(true)}
                                            onError={(err) => setError(err)}
                                        />
                                    </div>
                                </>
                            ) : (
                                <Button
                                    disabled
                                    className="w-full h-14 bg-white/5 border border-white/10 text-white/20 text-xs font-display font-bold tracking-widest uppercase rounded-xl"
                                >
                                    {selectedProgram ? "Complete all fields to pay" : "Select a program above"}
                                </Button>
                            )}
                        </div>

                        <div className="mt-8 flex flex-col items-center gap-4">
                            <div className="flex items-center gap-6 opacity-20 grayscale">
                                <img src="/razorpay-logo.png" alt="Razorpay" className="h-4" />
                                <div className="h-4 w-[1px] bg-white" />
                                <img src="/upi-logo.png" alt="UPI" className="h-4" />
                            </div>
                            <p className="text-[10px] text-white/30 font-display tracking-widest uppercase flex items-center gap-2">
                                <Heart className="h-3 w-3 fill-white/10" /> Powered by Fitosys Technology
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
