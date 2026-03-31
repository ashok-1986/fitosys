"use client";

import { cn } from "@/lib/utils";
import { use, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Heart, Loader2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

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
    whatsapp_number: string;
    upi_id: string | null;
    payment_instructions: string | null;
    accepted_payment_methods: string[];
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
    const [loadingIntake, setLoadingIntake] = useState(false);
    const [intakeResponse, setIntakeResponse] = useState<{ enrollmentId: string, programName: string, coachName: string } | null>(null);
    const [copied, setCopied] = useState(false);

    const coach = data?.coach;
    const programs = data?.programs || [];
    const selectedProgram = programs.find((p) => p.id === form.program_id);

    const canGoToStep2 = form.full_name && form.whatsapp_number && form.email && form.age;
    const canGoToStep3 = form.primary_goal;

    const isFormValid = canGoToStep2 && canGoToStep3 && form.program_id && form.agree_terms;

    const submitIntake = async () => {
        setLoadingIntake(true);
        setError(null);
        try {
            const res = await fetch("/api/public/intake", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    slug,
                    full_name: form.full_name,
                    whatsapp_number: form.whatsapp_number,
                    email: form.email,
                    age: Number(form.age),
                    primary_goal: form.primary_goal,
                    health_notes: form.health_notes,
                    program_id: form.program_id,
                    agree_terms: true
                })
            });
            const resData = await res.json();
            if (!res.ok) throw new Error(resData.error || "Failed to submit");

            setIntakeResponse({
                enrollmentId: resData.enrollmentId,
                programName: resData.programName,
                coachName: resData.coachName
            });
            setStep(4);
        } catch (err: any) {
            setError(err.message || "An error occurred");
        } finally {
            setLoadingIntake(false);
        }
    };

    const handleCopy = () => {
        if (coach?.upi_id) {
            navigator.clipboard.writeText(coach.upi_id);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

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
                        Welcome to the system, {form.full_name.split(" ")[0]}. Coach {coach.full_name.split(" ")[0]} will confirm your payment and send a WhatsApp welcome message.
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
                        <div className={cn("h-1 w-8 rounded-full transition-all duration-500", step >= 4 ? "bg-[#E8001D]" : "bg-white/10")} />
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col max-w-xl mx-auto w-full px-6 py-12">
                <div className="mb-10">
                    <h1 className="text-5xl md:text-6xl font-display font-black uppercase leading-[0.85] mb-4">
                        {step === 1 && <>Build Your <span className="text-[#E8001D]">Profile</span></>}
                        {step === 2 && <>Define Your <span className="text-[#E8001D]">Goals</span></>}
                        {step === 3 && <>Finalise <span className="text-[#E8001D]">Enrollment</span></>}
                        {step === 4 && <>Send Your <span className="text-[#E8001D]">Payment</span></>}
                    </h1>
                    <p className="text-white/40 text-sm font-medium tracking-wide">
                        {step === 1 && "Start by introducing yourself to your coach."}
                        {step === 2 && "Help us understand what you want to achieve."}
                        {step === 3 && "Select a program and secure your spot."}
                        {step === 4 && "Pay directly to your coach via UPI. No middleman."}
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
                                        <Button
                                            className="w-full h-14 bg-white text-black hover:bg-white/90 font-display font-black uppercase tracking-widest text-xs disabled:opacity-20"
                                            onClick={submitIntake}
                                            disabled={!isFormValid || loadingIntake}
                                        >
                                            {loadingIntake ? (
                                                <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                                            ) : `Continue to Payment →`}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 4 && selectedProgram && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                            {/* Block 1 - Amount Card */}
                            <div className="bg-[#111111] border border-[rgba(255,255,255,0.06)] rounded-[12px] p-5 text-center">
                                <h3 className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-2">Amount to Pay</h3>
                                <div className="font-['Barlow_Condensed'] text-[48px] font-medium text-white leading-none mb-1">
                                    ₹{selectedProgram.price.toLocaleString()}
                                </div>
                                <p className="text-[13px] text-white/40">for {selectedProgram.name}</p>
                            </div>

                            {/* Block 2 - UPI Details Card */}
                            <div className="bg-[#111111] border border-[rgba(255,255,255,0.06)] rounded-[12px] p-5">
                                {coach.upi_id ? (
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-3">Pay To</h3>
                                            <div className="flex items-center justify-between bg-[#1a1a1a] p-3 rounded-lg border border-white/5 hover:border-white/10 transition-colors group">
                                                <span className="text-[20px] font-bold text-white select-all">{coach.upi_id}</span>
                                                <button
                                                    onClick={handleCopy}
                                                    className="p-2 text-white/50 hover:text-white transition-colors flex items-center gap-2 bg-white/5 rounded-md hover:bg-white/10"
                                                >
                                                    {copied ? (
                                                        <span className="text-[11px] font-bold uppercase tracking-widest text-green-400 flex items-center gap-1">
                                                            <CheckCircle className="h-3 w-3" /> Copied!
                                                        </span>
                                                    ) : (
                                                        <Copy className="h-4 w-4" />
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-3 gap-3">
                                            {["GPay", "PhonePe", "Paytm"].map((app) => (
                                                <a
                                                    key={app}
                                                    href={`upi://pay?pa=${coach.upi_id}&am=${selectedProgram.price}&cu=INR&tn=FitosysCoaching`}
                                                    className="flex items-center justify-center bg-[#1a1a1a] border border-[rgba(255,255,255,0.08)] hover:border-[rgba(255,255,255,0.2)] hover:text-white rounded-[8px] py-2.5 px-3 text-center transition-all group"
                                                >
                                                    <span className="font-['Urbanist'] text-[12px] font-semibold uppercase tracking-[0.04em] text-[#888888] group-hover:text-white">
                                                        Open {app}
                                                    </span>
                                                </a>
                                            ))}
                                        </div>

                                        {coach.payment_instructions && (
                                            <div className="pt-2">
                                                <h3 className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-2">Payment Instructions</h3>
                                                <p className="text-[13px] text-[#888888] leading-relaxed">
                                                    {coach.payment_instructions}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="text-center py-6">
                                        <p className="text-[15px] text-white/80 mb-6">Contact your coach directly for payment details.</p>
                                        <a
                                            href={`https://wa.me/${coach.whatsapp_number?.replace(/\D/g, '') || ''}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="inline-flex h-12 items-center justify-center rounded-xl bg-[#25D366]/10 px-6 text-[13px] font-bold text-[#25D366] hover:bg-[#25D366]/20 transition-colors uppercase tracking-widest gap-2"
                                        >
                                            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                                            </svg>
                                            Message Coach on WhatsApp
                                        </a>
                                    </div>
                                )}
                            </div>

                            {/* Block 3 - Confirmation Button */}
                            <div>
                                <Button
                                    className="w-full h-14 bg-[#E8001D] hover:bg-[#C20000] text-white font-display font-black uppercase tracking-widest text-xs"
                                    onClick={() => setSubmitted(true)}
                                >
                                    I've Sent the Payment ✓
                                </Button>
                                <p className="text-[11px] text-white/30 text-center mt-3">
                                    Your coach will confirm receipt and activate your program within a few hours.
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                <footer className="mt-20 pt-10 border-t border-white/5 flex flex-col items-center gap-6">
                    <p className="text-[9px] text-white/20 font-display font-black tracking-[0.2em] uppercase flex items-center gap-2">
                        Powered by Fitosys Technology
                    </p>
                </footer>
            </main>
        </div>
    );
}
