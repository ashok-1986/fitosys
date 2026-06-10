"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Circle, Copy, Check, ArrowRight, Lightning } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";

export default function OnboardingConfirmPage() {
    const router = useRouter();
    const [slug, setSlug] = useState("");
    const [coachName, setCoachName] = useState("");
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        Promise.all([
            fetch("/api/coaches/profile").then(res => {
                if (!res.ok) throw new Error("Failed to fetch profile");
                return res.json();
            }),
            fetch("/api/programs").then(res => {
                if (!res.ok) throw new Error("Failed to fetch programs");
                return res.json();
            }),
        ]).then(([profile, programs]) => {
            if (cancelled) return;
            const hasPrograms = Array.isArray(programs) && programs.some(p => p.is_active);
            if (hasPrograms) {
                router.push("/dashboard");
                return;
            }
            setSlug(profile.slug || "");
            setCoachName(profile.full_name?.split(" ")[0] || "Coach");
            setLoading(false);
        }).catch((err) => {
            if (cancelled) return;
            console.error("Failed to load onboarding data:", err);
            setError("Failed to load. Please try again.");
            setLoading(false);
        });
        return () => { cancelled = true; };
    }, [router]);

    const copyLink = () => {
        if (!slug) return;
        navigator.clipboard.writeText(`${window.location.origin}/join/${slug}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const retry = () => {
        setError(null);
        setLoading(true);
        window.location.reload();
    };

    return (
        <div className="min-h-[100dvh] bg-[#0A0A0A] flex items-center justify-center p-6 font-urbanist">
            {/* Logo */}
            <div className="max-w-[480px] w-full">
                <div className="text-center mb-8 animate-[fadeIn_300ms_ease-out_forwards]">
                    <Image
                        src="/Fitosys_Logo_v1.png"
                        alt="Fitosys"
                        width={120}
                        height={32}
                        className="mx-auto object-contain invert"
                    />
                </div>

                {/* Progress bars */}
                <div className="flex gap-1.5 mb-8">
                    <div className="flex-1 h-[3px] bg-[#E8001D] rounded-sm transition-[width_500ms_cubic-bezier(0.23,1,0.32,1)]" />
                    <div className="flex-1 h-[3px] bg-[#E8001D] rounded-sm transition-[width_500ms_cubic-bezier(0.23,1,0.32,1)]" />
                </div>

                {/* Card */}
                <div className="bg-[#111111] border border-white/[0.06] rounded-xl p-7 animate-[fadeSlideIn_400ms_cubic-bezier(0.23,1,0.32,1)_forwards] opacity-0">
                    {loading ? (
                        <LoadingSkeleton />
                    ) : error ? (
                        <ErrorState error={error} onRetry={retry} />
                    ) : (
                        <Content
                            coachName={coachName}
                            slug={slug}
                            copied={copied}
                            onCopyLink={copyLink}
                            onGoToDashboard={() => router.push("/dashboard")}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

function LoadingSkeleton() {
    return (
        <div className="space-y-0">
            {/* Heading skeleton */}
            <div className="skeleton-line h-[52px] w-3/4 mb-2" />
            <div className="skeleton-line h-4 w-1/2 mb-7" />

            {/* Step 1 */}
            <div className="flex gap-3.5 py-4 border-b border-white/[0.06]">
                <div className="skeleton-line w-[18px] h-[18px] rounded-full mt-0.5 shrink-0" />
                <div className="flex-1 space-y-1.5">
                    <div className="skeleton-line h-3.5 w-2/5" />
                    <div className="skeleton-line h-3 w-3/4" />
                </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-3.5 py-4 border-b border-white/[0.06]">
                <div className="skeleton-line w-[18px] h-[18px] rounded-full mt-0.5 shrink-0" />
                <div className="flex-1 space-y-1.5">
                    <div className="skeleton-line h-3.5 w-1/2" />
                    <div className="skeleton-line h-3 w-[85%]" />
                </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-3.5 py-4">
                <div className="skeleton-line w-[18px] h-[18px] rounded-full mt-0.5 shrink-0" />
                <div className="flex-1 space-y-1.5">
                    <div className="skeleton-line h-3.5 w-2/5" />
                    <div className="skeleton-line h-3 w-2/3" />
                </div>
            </div>

            {/* Button skeleton */}
            <div className="skeleton-line h-[45px] w-full mt-6 rounded-lg" />
        </div>
    );
}

function ErrorState({ error, onRetry }: { error: string; onRetry: () => void }) {
    return (
        <div className="text-center py-6">
            <p className="text-sm text-red-500 mb-4">{error}</p>
            <button
                onClick={onRetry}
                className="bg-[#E8001D] text-white border-none rounded-lg px-5 py-2.5 text-[13px] font-semibold cursor-pointer transition-transform duration-[160ms] hover:bg-[#C20000] active:scale-[0.97]"
            >
                Try Again
            </button>
        </div>
    );
}

function Content({
    coachName,
    slug,
    copied,
    onCopyLink,
    onGoToDashboard,
}: {
    coachName: string;
    slug: string;
    copied: boolean;
    onCopyLink: () => void;
    onGoToDashboard: () => void;
}) {
    const steps = [
        {
            done: true,
            title: "Profile complete",
            description: "Your name, WhatsApp, and coaching type are saved.",
        },
        {
            done: false,
            title: "Create your first program",
            description: "Add a program so clients can select and pay when they onboard.",
            action: (
                <Link
                    href="/dashboard/programs"
                    className="inline-flex items-center gap-1.5 bg-[rgba(232,0,29,0.1)] border border-[rgba(232,0,29,0.2)] rounded-md px-3.5 py-1.5 text-[12px] font-semibold text-[#E8001D] no-underline mt-2.5 transition-colors duration-150 hover:bg-[rgba(232,0,29,0.15)]"
                >
                    <Lightning style={{ width: "12px", height: "12px" }} weight="bold" />
                    Create Program
                </Link>
            ),
        },
        {
            done: false,
            title: "Share your onboarding link",
            description: "Send this link to clients. They fill a form and pay — no back and forth.",
            action: slug ? (
                <div className="flex items-center gap-2 mt-2.5">
                    <code className="text-[12px] text-[#C8C8C8] bg-[#161616] border border-white/[0.06] rounded-md px-2.5 py-1.5 font-mono flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                        {typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_APP_URL || "https://fitosys.alchemetryx.com"}/join/{slug}
                    </code>
                    <button
                        onClick={onCopyLink}
                        className={`shrink-0 flex items-center gap-1 rounded-md px-3 py-1.5 text-[12px] font-semibold cursor-pointer transition-all duration-150 border ${
                            copied
                                ? "bg-[rgba(16,185,129,0.1)] border-[rgba(16,185,129,0.3)] text-[#10B981]"
                                : "bg-[rgba(255,255,255,0.05)] border-white/[0.06] text-[#C8C8C8]"
                        } active:scale-[0.97]`}
                    >
                        {copied
                            ? <><Check style={{ width: "12px", height: "12px" }} />Copied</>
                            : <><Copy style={{ width: "12px", height: "12px" }} />Copy</>
                        }
                    </button>
                </div>
            ) : null,
        },
    ];

    return (
        <>
            <h1 className="font-barlow text-[26px] font-medium uppercase tracking-wide text-white mb-1.5 leading-tight">
                You&apos;re <span className="text-[#E8001D]">set up,</span><br />{coachName}.
            </h1>
            <p className="text-[13px] text-[#888888] mb-7">
                Three things to get your first client onboarded
            </p>

            <div className="flex flex-col gap-0">
                {steps.map((step, i) => (
                    <div
                        key={i}
                        className="flex gap-3.5 py-4 animate-[fadeSlideIn_400ms_cubic-bezier(0.23,1,0.32,1)_forwards] opacity-0"
                        style={{ animationDelay: `${i * 80}ms`, borderBottom: i < steps.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}
                    >
                        <div className="shrink-0 mt-0.5">
                            {step.done
                                ? <CheckCircle style={{ width: "18px", height: "18px" }} color="#10B981" />
                                : <Circle style={{ width: "18px", height: "18px" }} color="#444444" />
                            }
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className={`text-[14px] font-semibold mb-1 ${step.done ? "text-[#10B981]" : "text-white"}`}>
                                {step.title}
                            </div>
                            <div className="text-[12px] text-[#888888] leading-relaxed">
                                {step.description}
                            </div>
                            {step.action}
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={onGoToDashboard}
                className="flex items-center justify-center gap-2 w-full bg-[#E8001D] text-white border-none rounded-lg py-3.5 text-[14px] font-semibold cursor-pointer mt-6 transition-all duration-150 hover:bg-[#C20000] active:scale-[0.97]"
            >
                <span>Go to Dashboard</span>
                <ArrowRight style={{ width: "14px", height: "14px" }} />
            </button>
        </>
    );
}