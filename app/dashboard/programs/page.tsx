"use client";

import { useState, useEffect } from "react";
import { Plus, Zap, ToggleLeft, ToggleRight, Copy, Check, Loader2, Sparkles } from "lucide-react";

interface Program {
    id: string;
    name: string;
    description: string | null;
    duration_weeks: number;
    price: number;
    currency: string;
    checkin_type: string;
    is_active: boolean;
    created_at: string;
}

const CHECKIN_TYPES = ["fitness", "yoga", "wellness", "nutrition"];

const checkinLabel = (type: string) =>
    type.charAt(0).toUpperCase() + type.slice(1);

export default function ProgramsPage() {
    const [programs, setPrograms] = useState<Program[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [saving, setSaving] = useState(false);
    const [generatingDesc, setGeneratingDesc] = useState(false);
    const [copied, setCopied] = useState(false);
    const [slug, setSlug] = useState("");
    const [form, setForm] = useState({
        name: "",
        duration_weeks: "8",
        price: "",
        checkin_type: "fitness",
        description: "",
    });
    const [formError, setFormError] = useState<string | null>(null);

    useEffect(() => {
        fetchPrograms();
        fetchSlug();
    }, []);

    const fetchPrograms = async () => {
        setLoading(true);
        const res = await fetch("/api/programs");
        if (res.ok) {
            const data = await res.json();
            setPrograms(data);
        }
        setLoading(false);
    };

    const fetchSlug = async () => {
        const res = await fetch("/api/coaches/profile");
        if (res.ok) {
            const data = await res.json();
            setSlug(data.slug || "");
        }
    };

    const handleToggle = async (program: Program) => {
        const res = await fetch(`/api/programs/${program.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ is_active: !program.is_active }),
        });
        if (res.ok) {
            setPrograms(prev =>
                prev.map(p => p.id === program.id ? { ...p, is_active: !p.is_active } : p)
            );
        }
    };

    const handleGenerateDescription = async () => {
        if (!form.name || !form.checkin_type) return;
        setGeneratingDesc(true);
        try {
            const res = await fetch("/api/programs/generate-description", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: form.name, checkin_type: form.checkin_type }),
            });
            const data = await res.json();
            if (data.description) {
                setForm(prev => ({ ...prev, description: data.description }));
            }
        } catch {
            // silent fail — coach can write manually
        } finally {
            setGeneratingDesc(false);
        }
    };

    const handleCreate = async () => {
        setFormError(null);
        if (!form.name || !form.price || !form.duration_weeks) {
            setFormError("Program name, duration, and price are required.");
            return;
        }
        setSaving(true);
        const res = await fetch("/api/programs", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: form.name,
                duration_weeks: Number(form.duration_weeks),
                price: Number(form.price),
                checkin_type: form.checkin_type,
                description: form.description || null,
            }),
        });
        setSaving(false);
        if (res.ok) {
            setShowForm(false);
            setForm({ name: "", duration_weeks: "8", price: "", checkin_type: "fitness", description: "" });
            fetchPrograms();
        } else {
            const data = await res.json();
            setFormError(data.error || "Failed to create program.");
        }
    };

    const copyLink = () => {
        if (!slug) return;
        navigator.clipboard.writeText(`${window.location.origin}/join/${slug}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const border = "1px solid rgba(255,255,255,0.06)";
    const surface = "#111111";

    return (
        <div style={{ padding: "24px", fontFamily: "var(--font-urbanist, sans-serif)", maxWidth: "900px" }}>

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
                <div>
                    <h1 style={{ fontFamily: "var(--font-barlow, sans-serif)", fontSize: "28px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.02em", color: "#FFFFFF", lineHeight: 1, marginBottom: "4px" }}>
                        Programs
                    </h1>
                    <p style={{ fontSize: "13px", color: "#888888" }}>
                        Create programs to share with clients via your onboarding link
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    style={{ display: "flex", alignItems: "center", gap: "8px", background: "#E8001D", color: "#FFFFFF", border: "none", borderRadius: "8px", padding: "10px 18px", fontSize: "13px", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-urbanist, sans-serif)" }}
                >
                    <Plus style={{ width: "14px", height: "14px" }} />
                    New Program
                </button>
            </div>

            {/* Onboarding link banner */}
            {slug && (
                <div style={{ background: surface, border, borderRadius: "10px", padding: "14px 18px", marginBottom: "20px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
                    <div>
                        <p style={{ fontSize: "11px", fontWeight: 700, color: "#888888", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>Your onboarding link</p>
                        <p style={{ fontSize: "13px", color: "#C8C8C8", fontFamily: "var(--font-mono, monospace)" }}>
                            {window.location.origin}/join/{slug}
                        </p>
                    </div>
                    <button
                        onClick={copyLink}
                        style={{ display: "flex", alignItems: "center", gap: "6px", background: copied ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.05)", border: copied ? "1px solid rgba(16,185,129,0.3)" : border, borderRadius: "7px", padding: "8px 14px", fontSize: "12px", fontWeight: 600, color: copied ? "#10B981" : "#C8C8C8", cursor: "pointer", fontFamily: "var(--font-urbanist, sans-serif)", whiteSpace: "nowrap" }}
                    >
                        {copied ? <Check style={{ width: "13px", height: "13px" }} /> : <Copy style={{ width: "13px", height: "13px" }} />}
                        {copied ? "Copied" : "Copy link"}
                    </button>
                </div>
            )}

            {/* Create program form */}
            {showForm && (
                <div style={{ background: surface, border: "1px solid rgba(232,0,29,0.2)", borderRadius: "10px", padding: "20px", marginBottom: "20px" }}>
                    <h3 style={{ fontFamily: "var(--font-barlow, sans-serif)", fontSize: "18px", fontWeight: 500, textTransform: "uppercase", color: "#FFFFFF", marginBottom: "20px" }}>
                        New Program
                    </h3>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                        <div>
                            <label style={{ fontSize: "11px", fontWeight: 700, color: "#888888", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "6px" }}>Program Name</label>
                            <input
                                type="text"
                                placeholder="12-Week Transformation"
                                value={form.name}
                                onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                                style={{ width: "100%", background: "#161616", border, borderRadius: "7px", padding: "10px 12px", fontSize: "13px", color: "#FFFFFF", outline: "none", fontFamily: "var(--font-urbanist, sans-serif)" }}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: "11px", fontWeight: 700, color: "#888888", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "6px" }}>Check-in Type</label>
                            <select
                                value={form.checkin_type}
                                onChange={e => setForm(prev => ({ ...prev, checkin_type: e.target.value }))}
                                style={{ width: "100%", background: "#161616", border, borderRadius: "7px", padding: "10px 12px", fontSize: "13px", color: "#FFFFFF", outline: "none", fontFamily: "var(--font-urbanist, sans-serif)", cursor: "pointer" }}
                            >
                                {CHECKIN_TYPES.map(t => (
                                    <option key={t} value={t}>{checkinLabel(t)}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label style={{ fontSize: "11px", fontWeight: 700, color: "#888888", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "6px" }}>Duration (weeks)</label>
                            <input
                                type="number"
                                placeholder="8"
                                value={form.duration_weeks}
                                onChange={e => setForm(prev => ({ ...prev, duration_weeks: e.target.value }))}
                                style={{ width: "100%", background: "#161616", border, borderRadius: "7px", padding: "10px 12px", fontSize: "13px", color: "#FFFFFF", outline: "none", fontFamily: "var(--font-urbanist, sans-serif)" }}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: "11px", fontWeight: 700, color: "#888888", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: "6px" }}>Price (₹)</label>
                            <input
                                type="number"
                                placeholder="9999"
                                value={form.price}
                                onChange={e => setForm(prev => ({ ...prev, price: e.target.value }))}
                                style={{ width: "100%", background: "#161616", border, borderRadius: "7px", padding: "10px 12px", fontSize: "13px", color: "#FFFFFF", outline: "none", fontFamily: "var(--font-urbanist, sans-serif)" }}
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: "16px" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                            <label style={{ fontSize: "11px", fontWeight: 700, color: "#888888", textTransform: "uppercase", letterSpacing: "0.06em" }}>Description</label>
                            <button
                                onClick={handleGenerateDescription}
                                disabled={generatingDesc || !form.name}
                                style={{ display: "flex", alignItems: "center", gap: "5px", background: "rgba(232,0,29,0.1)", border: "1px solid rgba(232,0,29,0.2)", borderRadius: "6px", padding: "4px 10px", fontSize: "11px", fontWeight: 600, color: "#E8001D", cursor: form.name ? "pointer" : "not-allowed", opacity: form.name ? 1 : 0.4, fontFamily: "var(--font-urbanist, sans-serif)" }}
                            >
                                {generatingDesc
                                    ? <Loader2 style={{ width: "11px", height: "11px" }} className="animate-spin" />
                                    : <Sparkles style={{ width: "11px", height: "11px" }} />
                                }
                                {generatingDesc ? "Generating..." : "Generate with AI"}
                            </button>
                        </div>
                        <textarea
                            placeholder="Enter a description or use AI to generate one..."
                            value={form.description}
                            onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
                            rows={3}
                            style={{ width: "100%", background: "#161616", border, borderRadius: "7px", padding: "10px 12px", fontSize: "13px", color: "#FFFFFF", outline: "none", fontFamily: "var(--font-urbanist, sans-serif)", resize: "vertical", lineHeight: 1.6 }}
                        />
                    </div>

                    {formError && (
                        <p style={{ fontSize: "12px", color: "#EF4444", marginBottom: "12px" }}>{formError}</p>
                    )}

                    <div style={{ display: "flex", gap: "10px" }}>
                        <button
                            onClick={handleCreate}
                            disabled={saving}
                            style={{ display: "flex", alignItems: "center", gap: "6px", background: "#E8001D", color: "#FFFFFF", border: "none", borderRadius: "8px", padding: "10px 20px", fontSize: "13px", fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1, fontFamily: "var(--font-urbanist, sans-serif)" }}
                        >
                            {saving && <Loader2 style={{ width: "13px", height: "13px" }} className="animate-spin" />}
                            {saving ? "Saving..." : "Create Program"}
                        </button>
                        <button
                            onClick={() => { setShowForm(false); setFormError(null); }}
                            style={{ background: "transparent", border, borderRadius: "8px", padding: "10px 20px", fontSize: "13px", color: "#C8C8C8", cursor: "pointer", fontFamily: "var(--font-urbanist, sans-serif)" }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            {/* Programs list */}
            {loading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: "48px" }}>
                    <Loader2 style={{ width: "24px", height: "24px", color: "#E8001D" }} className="animate-spin" />
                </div>
            ) : programs.length === 0 ? (
                <div style={{ background: surface, border, borderRadius: "10px", padding: "48px", textAlign: "center" }}>
                    <Zap style={{ width: "28px", height: "28px", color: "#333333", margin: "0 auto 12px" }} />
                    <p style={{ fontSize: "14px", color: "#C8C8C8", marginBottom: "6px" }}>No programs yet</p>
                    <p style={{ fontSize: "12px", color: "#888888" }}>Create your first program to start onboarding clients</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {programs.map(program => (
                        <div
                            key={program.id}
                            style={{ background: surface, border, borderRadius: "10px", padding: "16px 20px", display: "flex", alignItems: "center", gap: "16px", opacity: program.is_active ? 1 : 0.5 }}
                        >
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                                    <span style={{ fontSize: "15px", fontWeight: 600, color: "#FFFFFF" }}>{program.name}</span>
                                    <span style={{ fontSize: "10px", fontWeight: 700, color: "#888888", background: "rgba(255,255,255,0.05)", padding: "2px 8px", borderRadius: "4px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                                        {checkinLabel(program.checkin_type)}
                                    </span>
                                    {!program.is_active && (
                                        <span style={{ fontSize: "10px", fontWeight: 700, color: "#888888", background: "rgba(255,255,255,0.05)", padding: "2px 8px", borderRadius: "4px", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                                            Inactive
                                        </span>
                                    )}
                                </div>
                                {program.description && (
                                    <p style={{ fontSize: "12px", color: "#888888", marginBottom: "6px", lineHeight: 1.5 }}>{program.description}</p>
                                )}
                                <div style={{ display: "flex", gap: "16px" }}>
                                    <span style={{ fontSize: "12px", color: "#C8C8C8" }}>{program.duration_weeks} weeks</span>
                                    <span style={{ fontSize: "12px", color: "#C8C8C8" }}>₹{program.price.toLocaleString("en-IN")}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => handleToggle(program)}
                                style={{ background: "none", border: "none", cursor: "pointer", color: program.is_active ? "#10B981" : "#888888", padding: "4px", display: "flex", alignItems: "center" }}
                                title={program.is_active ? "Deactivate" : "Activate"}
                            >
                                {program.is_active
                                    ? <ToggleRight style={{ width: "24px", height: "24px" }} />
                                    : <ToggleLeft style={{ width: "24px", height: "24px" }} />
                                }
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
