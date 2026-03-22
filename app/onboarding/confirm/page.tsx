"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, Circle, Copy, Check, ArrowRight, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function OnboardingConfirmPage() {
    const router = useRouter();
    const [slug, setSlug] = useState("");
    const [coachName, setCoachName] = useState("");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetch("/api/coaches/profile")
            .then(res => res.json())
            .then(data => {
                setSlug(data.slug || "");
                setCoachName(data.full_name?.split(" ")[0] || "Coach");
            })
            .catch(() => { });
    }, []);

    const copyLink = () => {
        if (!slug) return;
        navigator.clipboard.writeText(`${window.location.origin}/join/${slug}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const border = "1px solid rgba(255,255,255,0.06)";

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
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        background: "rgba(232,0,29,0.1)",
                        border: "1px solid rgba(232,0,29,0.2)",
                        borderRadius: "7px",
                        padding: "7px 14px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#E8001D",
                        textDecoration: "none",
                        fontFamily: "var(--font-urbanist, sans-serif)",
                        marginTop: "10px",
                    } as React.CSSProperties}
                >
                    <Zap style={{ width: "12px", height: "12px" }} />
                    Create Program
                </Link>
            ),
        },
        {
            done: false,
            title: "Share your onboarding link",
            description: "Send this link to clients. They fill a form and pay — no back and forth.",
            action: slug ? (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "10px" }}>
                    <code style={{
                        fontSize: "12px",
                        color: "#C8C8C8",
                        background: "#161616",
                        border,
                        borderRadius: "6px",
                        padding: "6px 10px",
                        fontFamily: "var(--font-mono, monospace)",
                        flex: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}>
                        {typeof window !== "undefined" ? window.location.origin : "https://fitosys.alchemetryx.com"}/join/{slug}
                    </code>
                    <button
                        onClick={copyLink}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "5px",
                            background: copied ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.05)",
                            border: copied ? "1px solid rgba(16,185,129,0.3)" : border,
                            borderRadius: "6px",
                            padding: "6px 12px",
                            fontSize: "12px",
                            fontWeight: 600,
                            color: copied ? "#10B981" : "#C8C8C8",
                            cursor: "pointer",
                            fontFamily: "var(--font-urbanist, sans-serif)",
                            whiteSpace: "nowrap",
                            flexShrink: 0,
                        }}
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
        <div style={{
            minHeight: "100vh",
            background: "#0A0A0A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            fontFamily: "var(--font-urbanist, sans-serif)",
        }}>
            <div style={{ maxWidth: "480px", width: "100%" }}>

                {/* Logo */}
                <div style={{ textAlign: "center", marginBottom: "32px" }}>
                    <Image
                        src="/Fitosys_Logo_v1.png"
                        alt="Fitosys"
                        width={120}
                        height={32}
                        style={{ objectFit: "contain", filter: "brightness(0) invert(1)" }}
                    />
                </div>

                {/* Progress */}
                <div style={{ display: "flex", gap: "6px", marginBottom: "32px" }}>
                    <div style={{ flex: 1, height: "3px", background: "#E8001D", borderRadius: "2px" }} />
                    <div style={{ flex: 1, height: "3px", background: "#E8001D", borderRadius: "2px" }} />
                </div>

                <div style={{ background: "#111111", border, borderRadius: "12px", padding: "28px" }}>
                    <h1 style={{
                        fontFamily: "var(--font-barlow, sans-serif)",
                        fontSize: "26px",
                        fontWeight: 500,
                        textTransform: "uppercase",
                        letterSpacing: "0.02em",
                        color: "#FFFFFF",
                        marginBottom: "6px",
                        lineHeight: 1.1,
                    }}>
                        You&apos;re <span style={{ color: "#E8001D" }}>set up,</span><br />{coachName}.
                    </h1>
                    <p style={{ fontSize: "13px", color: "#888888", marginBottom: "28px" }}>
                        Three things to get your first client onboarded
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                        {steps.map((step, i) => (
                            <div
                                key={i}
                                style={{
                                    display: "flex",
                                    gap: "14px",
                                    padding: "16px 0",
                                    borderBottom: i < steps.length - 1 ? border : "none",
                                }}
                            >
                                <div style={{ flexShrink: 0, marginTop: "2px" }}>
                                    {step.done
                                        ? <CheckCircle style={{ width: "18px", height: "18px", color: "#10B981" }} />
                                        : <Circle style={{ width: "18px", height: "18px", color: "#444444" }} />
                                    }
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{
                                        fontSize: "14px",
                                        fontWeight: 600,
                                        color: step.done ? "#10B981" : "#FFFFFF",
                                        marginBottom: "4px",
                                    }}>
                                        {step.title}
                                    </div>
                                    <div style={{ fontSize: "12px", color: "#888888", lineHeight: 1.5 }}>
                                        {step.description}
                                    </div>
                                    {step.action}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => router.push("/dashboard")}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            width: "100%",
                            background: "#E8001D",
                            color: "#FFFFFF",
                            border: "none",
                            borderRadius: "8px",
                            padding: "13px",
                            fontSize: "14px",
                            fontWeight: 600,
                            cursor: "pointer",
                            fontFamily: "var(--font-urbanist, sans-serif)",
                            marginTop: "24px",
                        }}
                    >
                        <span>Go to Dashboard</span>
                        <ArrowRight style={{ width: "14px", height: "14px" }} />
                    </button>
                </div>
            </div>
        </div>
    );
}
