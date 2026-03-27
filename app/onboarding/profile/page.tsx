"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, ArrowRight } from "lucide-react";
import Image from "next/image";

const COACHING_TYPES = ["fitness", "yoga", "wellness", "nutrition"];

export default function OnboardingProfilePage() {
    const router = useRouter();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [form, setForm] = useState({
        full_name: "",
        whatsapp_number: "",
        coaching_type: [] as string[],
        city: "",
    });

    useEffect(() => {
        fetch("/api/coaches/profile")
            .then(res => res.json())
            .then(data => {
                if (data.full_name) {
                    setForm(prev => ({
                        ...prev,
                        full_name: data.full_name || "",
                        whatsapp_number: data.whatsapp_number === "PENDING_SETUP" ? "" : (data.whatsapp_number || ""),
                        coaching_type: data.coaching_type || [],
                        city: data.city || "",
                    }));
                }
            })
            .catch(() => { });
    }, []);

    const toggleCoachingType = (type: string) => {
        setForm(prev => ({
            ...prev,
            coaching_type: prev.coaching_type.includes(type)
                ? prev.coaching_type.filter(t => t !== type)
                : [...prev.coaching_type, type],
        }));
    };

    const handleSubmit = async () => {
        setError(null);
        if (!form.full_name || !form.whatsapp_number || form.coaching_type.length === 0) {
            setError("Full name, WhatsApp number, and at least one coaching type are required.");
            return;
        }
        if (!form.whatsapp_number.startsWith("+")) {
            setError("WhatsApp number must include country code (e.g. +91XXXXXXXXXX).");
            return;
        }
        setSaving(true);
        try {
            const res = await fetch("/api/coaches/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    full_name: form.full_name,
                    whatsapp_number: form.whatsapp_number,
                    coaching_type: form.coaching_type,
                    city: form.city || null,
                }),
            });
            if (!res.ok) {
                const data = await res.json();
                setError(data.error || "Failed to save profile.");
                return;
            }
            // Use window.location to force a full navigation after cookie update
            window.location.href = "/onboarding/confirm";
        } catch {
            setError("Something went wrong. Please try again.");
        } finally {
            setSaving(false);
        }
    };

    const border = "1px solid rgba(255,255,255,0.06)";
    const inputStyle = {
        width: "100%",
        background: "#161616",
        border,
        borderRadius: "8px",
        padding: "11px 14px",
        fontSize: "14px",
        color: "#FFFFFF",
        outline: "none",
        fontFamily: "var(--font-urbanist, sans-serif)",
    };
    const labelStyle = {
        fontSize: "11px",
        fontWeight: 700 as const,
        color: "#888888",
        textTransform: "uppercase" as const,
        letterSpacing: "0.06em",
        display: "block" as const,
        marginBottom: "6px",
    };

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
                    <div style={{ flex: 1, height: "3px", background: "rgba(255,255,255,0.1)", borderRadius: "2px" }} />
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
                        Build your <span style={{ color: "#E8001D" }}>profile</span>
                    </h1>
                    <p style={{ fontSize: "13px", color: "#888888", marginBottom: "24px" }}>
                        This is how your clients will know you
                    </p>

                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

                        <div>
                            <label style={labelStyle}>Full Name</label>
                            <input
                                type="text"
                                placeholder="Priya Sharma"
                                value={form.full_name}
                                onChange={e => setForm(prev => ({ ...prev, full_name: e.target.value }))}
                                style={inputStyle}
                            />
                        </div>

                        <div>
                            <label style={labelStyle}>WhatsApp Number</label>
                            <input
                                type="tel"
                                placeholder="+91XXXXXXXXXX"
                                value={form.whatsapp_number}
                                onChange={e => setForm(prev => ({ ...prev, whatsapp_number: e.target.value }))}
                                style={inputStyle}
                            />
                            <p style={{ fontSize: "11px", color: "#888888", marginTop: "4px" }}>
                                Include country code. Check-ins and summaries will be sent here.
                            </p>
                        </div>

                        <div>
                            <label style={labelStyle}>Coaching Type</label>
                            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                {COACHING_TYPES.map(type => (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => toggleCoachingType(type)}
                                        style={{
                                            padding: "7px 16px",
                                            borderRadius: "20px",
                                            border: form.coaching_type.includes(type)
                                                ? "1px solid rgba(232,0,29,0.5)"
                                                : border,
                                            background: form.coaching_type.includes(type)
                                                ? "rgba(232,0,29,0.1)"
                                                : "#161616",
                                            color: form.coaching_type.includes(type)
                                                ? "#E8001D"
                                                : "#888888",
                                            fontSize: "13px",
                                            fontWeight: form.coaching_type.includes(type) ? 600 : 400,
                                            cursor: "pointer",
                                            fontFamily: "var(--font-urbanist, sans-serif)",
                                            textTransform: "capitalize",
                                            transition: "all 0.15s",
                                        }}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label style={labelStyle}>City <span style={{ color: "#555555", fontWeight: 400 }}>(optional)</span></label>
                            <input
                                type="text"
                                placeholder="Mumbai"
                                value={form.city}
                                onChange={e => setForm(prev => ({ ...prev, city: e.target.value }))}
                                style={inputStyle}
                            />
                        </div>

                    </div>

                    {error && (
                        <p style={{ fontSize: "12px", color: "#EF4444", marginTop: "16px" }}>{error}</p>
                    )}

                    <button
                        onClick={handleSubmit}
                        disabled={saving}
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
                            cursor: saving ? "not-allowed" : "pointer",
                            opacity: saving ? 0.7 : 1,
                            fontFamily: "var(--font-urbanist, sans-serif)",
                            marginTop: "24px",
                        }}
                    >
                        {saving
                            ? <><Loader2 style={{ width: "14px", height: "14px" }} className="animate-spin" /> Saving...</>
                            : <><span>Continue</span><ArrowRight style={{ width: "14px", height: "14px" }} /></>
                        }
                    </button>
                </div>
            </div>
        </div>
    );
}
