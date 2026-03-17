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

    const [step, setStep] = useState(1);
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

    const canGoToStep2 = form.full_name && form.whatsapp_number && form.email && form.age;
    const canGoToStep3 = form.primary_goal;

    const isFormValid = canGoToStep2 && canGoToStep3 && form.program_id && form.agree_terms;

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#E8001D]" />
            </div>
        );
    }

    if (fetchError || !coach) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
                <Card className="max-w-md w-full text-center p-8 bg-[#111111] border-white/5 shadow-2xl">
                    <h2 className="text-2xl font-display font-black uppercase text-[#E8001D]">Coach Not Found</h2>
                    <p className="text-white/40 mt-4 text-sm font-sans">{fetchError?.message || "This coaching link is invalid or inactive."}</p>
                    <Button asChild className="mt-8 bg-white text-black hover:bg-white/90">
                        <a href="/">Back to Home</a>
                    </Button>
                </Card>
            </div>
        );
    }

    if (submitted) {
        return (
            <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
                <Card className="max-w-md w-full text-center p-10 bg-[#111111] border-white/5 shadow-3xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-success" />
                    <div className="h-20 w-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-8">
                        <CheckCircle className="h-10 w-10 text-success" />
                    </div>
                    <h2 className="text-4xl font-display font-black uppercase leading-none mb-4">You&apos;re <span className="text-success">In.</span></h2>
                    <p className="text-white/50 text-sm leading-relaxed mb-8">
                        Welcome to the system, {form.full_name.split(" ")[0]}. Coach {coach.full_name.split(" ")[0]} will reach out on WhatsApp within the hour.
                    </p>
                    <div className="p-6 rounded-xl bg-white/[0.02] border border-white/5 text-left space-y-3 mb-8">
                        <div className="flex justify-between text-xs">
                            <span className="text-white/30 uppercase tracking-widest font-bold">Program</span>
                            <span className="text-white font-bold">{selectedProgram?.name}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-white/30 uppercase tracking-widest font-bold">Starts</span>
                            <span className="text-white font-bold">Today · {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                    </div>
                    <p className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold italic">Check your WhatsApp for the welcome message</p>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white font-sans selection:bg-[#E8001D]/30 flex flex-col">
            {/* Header */}
            <header className="border-b border-white/5 bg-[#0A0A0A]/80 backdrop-blur-md sticky top-0 z-50">
                <div className="max-w-xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-[#E8001D] flex items-center justify-center text-[10px] font-display font-black text-white shadow-lg shadow-[#E8001D]/20">
                            {coach.full_name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div className="hidden sm:block">
                            <h2 className="text-[10px] font-display font-bold text-white uppercase tracking-widest leading-none mb-1">{coach.full_name}</h2>
                            <p className="text-[8px] text-white/30 font-bold tracking-widest uppercase">Verified Coach</p>
                        </div>
                    </div>

                    <div className="flex gap-1.5">
                        <div className={cn("h-1 w-8 rounded-full transition-all duration-500", step >= 1 ? "bg-[#E8001D]" : "bg-white/10")} />
                        <div className={cn("h-1 w-8 rounded-full transition-all duration-500", step >= 2 ? "bg-[#E8001D]" : "bg-white/10")} />
                        <div className={cn("h-1 w-8 rounded-full transition-all duration-500", step >= 3 ? "bg-[#E8001D]" : "bg-white/10")} />
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col max-w-xl mx-auto w-full px-6 py-12">
                <div className="mb-10">
                    <h1 className="text-5xl md:text-6xl font-display font-black uppercase leading-[0.85] mb-4">
                        {step === 1 && <>Build Your <span className="text-[#E8001D]">Profile</span></>}
                        {step === 2 && <>Define Your <span className="text-[#E8001D]">Goals</span></>}
                        {step === 3 && <>Finalise <span className="text-[#E8001D]">Enrollment</span></>}
                    </h1>
                    <p className="text-white/40 text-sm font-medium tracking-wide">
                        {step === 1 && "Start by introducing yourself to your coach."}
                        {step === 2 && "Help us understand what you want to achieve."}
                        {step === 3 && "Select a program and secure your spot."}
                    </p>
                </div>

                <div className="flex-1">
                    {step === 1 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="grid gap-6">
                                <div className="space-y-2">
                                    <Label htmlFor="full_name" className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Full Name</Label>
                                    <Input
                                        id="full_name"
                                        placeholder="Rahul Mehta"
                                        className="h-14 bg-white/[0.03] border-white/5 focus:border-[#E8001D]/30 transition-all text-white placeholder:text-white/10 font-sans"
                                        value={form.full_name}
                                        onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="whatsapp" className="text-[10px] uppercase tracking-widest text-white/30 font-bold">WhatsApp Number</Label>
                                        <Input
                                            id="whatsapp"
                                            type="tel"
                                            placeholder="+91"
                                            className="h-14 bg-white/[0.03] border-white/5 focus:border-[#E8001D]/30 transition-all text-white placeholder:text-white/10 font-sans"
                                            value={form.whatsapp_number}
                                            onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="age" className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Age</Label>
                                        <Input
                                            id="age"
                                            type="number"
                                            placeholder="24"
                                            className="h-14 bg-white/[0.03] border-white/5 focus:border-[#E8001D]/30 transition-all text-white placeholder:text-white/10 font-sans"
                                            value={form.age}
                                            onChange={(e) => setForm({ ...form, age: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-[10px] uppercase tracking-widest text-white/30 font-bold">Email Address</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="rahul@example.com"
                                        className="h-14 bg-white/[0.03] border-white/5 focus:border-[#E8001D]/30 transition-all text-white placeholder:text-white/10 font-sans"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <Button
                                className="w-full h-14 bg-white text-black hover:bg-white/90 font-display font-black uppercase tracking-widest text-xs disabled:opacity-20"
                                onClick={() => setStep(2)}
                                disabled={!canGoToStep2}
                            >
                                Next Step: Identify Goals →
                            </Button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="grid grid-cols-2 gap-4">
                                {GOALS.map((goal) => (
                                    <button
                                        key={goal}
                                        type="button"
                                        onClick={() => setForm({ ...form, primary_goal: goal })}
                                        className={cn(
                                            "group relative p-6 rounded-2xl border text-xs text-center transition-all duration-300 font-bold uppercase tracking-widest",
                                            form.primary_goal === goal
                                                ? "border-[#E8001D] bg-[#E8001D]/5 text-white shadow-lg shadow-[#E8001D]/10"
                                                : "border-white/5 bg-white/[0.02] text-white/30 hover:border-white/20 hover:text-white"
                                        )}
                                    >
                                        {goal}
                                    </button>
                                ))}
                            </div>

                            <div className="flex gap-4">
                                <Button
                                    variant="outline"
                                    className="h-14 border-white/10 bg-transparent text-white/40 hover:bg-white/5 hover:text-white font-display font-black uppercase tracking-widest text-[10px] px-8"
                                    onClick={() => setStep(1)}
                                >
                                    Back
                                </Button>
                                <Button
                                    className="flex-1 h-14 bg-white text-black hover:bg-white/90 font-display font-black uppercase tracking-widest text-[10px] disabled:opacity-20"
                                    onClick={() => setStep(3)}
                                    disabled={!canGoToStep3}
                                >
                                    Next Step: Select Program →
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                            <div className="grid gap-4">
                                {programs.map((prog) => (
                                    <button
                                        key={prog.id}
                                        type="button"
                                        onClick={() => setForm({ ...form, program_id: prog.id })}
                                        className={cn(
                                            "group relative w-full p-6 rounded-2xl border text-left transition-all duration-500 overflow-hidden",
                                            form.program_id === prog.id
                                                ? "border-[#E8001D] bg-[#E8001D] text-white shadow-2xl shadow-[#E8001D]/30"
                                                : "border-white/5 bg-white/[0.02] hover:border-white/20"
                                        )}
                                    >
                                        <div className="flex items-center justify-between relative z-10">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <p className={cn("text-base font-bold", form.program_id === prog.id ? "text-white" : "text-white/90")}>
                                                        {prog.name}
                                                    </p>
                                                    {form.program_id === prog.id && <CheckCircle className="h-4 w-4 text-white" />}
                                                </div>
                                                <p className={cn("text-[11px] leading-relaxed max-w-[200px]", form.program_id === prog.id ? "text-white/70" : "text-white/30")}>
                                                    {prog.description || `${prog.duration_weeks} weeks of professional coaching`}
                                                </p>
                                            </div>
                                            <div className="text-right pl-6 border-l border-white/10">
                                                <p className={cn("text-2xl font-display font-black leading-none", form.program_id === prog.id ? "text-white" : "text-[#E8001D]")}>
                                                    ₹{prog.price.toLocaleString()}
                                                </p>
                                                <p className={cn("text-[8px] font-bold tracking-[0.2em] uppercase mt-1", form.program_id === prog.id ? "text-white/60" : "text-white/20")}>
                                                    Inc. GST
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            <div className="pt-6 border-t border-white/5">
                                <label className="flex items-center gap-4 cursor-pointer mb-8 group">
                                    <div className={cn(
                                        "h-5 w-5 rounded-sm border flex items-center justify-center transition-all",
                                        form.agree_terms ? "bg-[#E8001D] border-[#E8001D]" : "border-white/10 group-hover:border-white/30"
                                    )}>
                                        {form.agree_terms && <CheckCircle className="h-3 w-3 text-white" />}
                                    </div>
                                    <input
                                        type="checkbox"
                                        className="hidden"
                                        checked={form.agree_terms}
                                        onChange={(e) => setForm({ ...form, agree_terms: e.target.checked })}
                                    />
                                    <span className="text-[10px] text-white/30 font-bold uppercase tracking-wider group-hover:text-white/60 transition-colors">
                                        I accept the terms & conditions
                                    </span>
                                </label>

                                {error && (
                                    <div className="mb-6 p-4 rounded-xl bg-[#E8001D]/10 border border-[#E8001D]/20 text-[#E8001D] text-[11px] font-bold uppercase tracking-widest flex gap-3 items-center">
                                        <div className="h-5 w-5 rounded-full bg-[#E8001D] flex items-center justify-center text-[10px] font-black text-white">!</div>
                                        {error}
                                    </div>
                                )}

                                <div className="flex gap-4">
                                    <Button
                                        variant="outline"
                                        className="h-14 border-white/10 bg-transparent text-white/40 hover:bg-white/5 hover:text-white font-display font-black uppercase tracking-widest text-[10px] px-8"
                                        onClick={() => setStep(2)}
                                    >
                                        Back
                                    </Button>
                                    <div className="flex-1 relative group">
                                        {isFormValid ? (
                                            <>
                                                <div className="absolute -inset-1 bg-[#E8001D]/20 blur opacity-0 group-hover:opacity-100 transition duration-500" />
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
                                                        label={selectedProgram ? `Pay ₹${selectedProgram.price.toLocaleString()} Securely →` : "Pay Securely →"}
                                                        onSuccess={() => setSubmitted(true)}
                                                        onError={(err) => setError(err)}
                                                    />
                                                </div>
                                            </>
                                        ) : (
                                            <Button
                                                disabled
                                                className="w-full h-14 bg-white/5 border border-white/5 text-white/10 text-[10px] font-display font-black tracking-widest uppercase rounded-xl"
                                            >
                                                Complete details to pay
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <footer className="mt-20 pt-10 border-t border-white/5 flex flex-col items-center gap-6">
                    <div className="flex items-center gap-6 opacity-20 grayscale filter">
                        <img src="/razorpay-logo.png" alt="Razorpay" className="h-4" />
                        <div className="h-4 w-[1px] bg-white" />
                        <img src="/upi-logo.png" alt="UPI" className="h-4" />
                    </div>
                    <p className="text-[9px] text-white/20 font-display font-black tracking-[0.2em] uppercase flex items-center gap-2">
                        Powered by Fitosys Technology
                    </p>
                </footer>
            </main>
        </div>
    );
}
