"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, CheckCircle, AlertCircle, Zap, Target, MessageCircle } from "lucide-react";
import { RazorpayButton } from "@/components/razorpay-button";

const RButton = RazorpayButton as any;

interface RenewData {
    order_id: string;
    enrollment_id: string;
    client_name: string;
    coach_name: string;
    coach_whatsapp: string | null;
    program_name: string;
    program_duration_weeks: number;
    end_date: string;
    amount: number;
    currency: string;
    stats: {
        total_sessions: number;
        avg_energy: number | null;
        total_checkins: number;
    };
}

function RenewContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("order");
    const enrollmentId = searchParams.get("enrollment");

    const [data, setData] = useState<RenewData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!orderId || !enrollmentId) {
            setError("Invalid renewal link. Please contact your coach.");
            setLoading(false);
            return;
        }

        fetch(`/api/renew?order=${orderId}&enrollment=${enrollmentId}`)
            .then(res => res.json())
            .then(json => {
                if (json.error) {
                    setError(json.error);
                } else {
                    setData(json);
                }
            })
            .catch(() => setError("Failed to load renewal details."))
            .finally(() => setLoading(false));
    }, [orderId, enrollmentId]);

    if (loading) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#0A0A0A" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                    <Loader2 style={{ width: "28px", height: "28px", color: "#E8001D" }} className="animate-spin" />
                    <p style={{ fontSize: "13px", color: "#C8C8C8", fontFamily: "var(--font-urbanist, sans-serif)" }}>Loading your renewal...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#0A0A0A", padding: "24px" }}>
                <div style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "32px", maxWidth: "440px", width: "100%", textAlign: "center" }}>
                    <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(239,68,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                        <AlertCircle style={{ width: "24px", height: "24px", color: "#EF4444" }} />
                    </div>
                    <h2 style={{ fontFamily: "var(--font-barlow, sans-serif)", fontSize: "24px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.02em", color: "#FFFFFF", marginBottom: "12px" }}>
                        Link Expired
                    </h2>
                    <p style={{ fontSize: "14px", color: "#C8C8C8", lineHeight: 1.6, marginBottom: "24px", fontFamily: "var(--font-urbanist, sans-serif)" }}>
                        {error}
                    </p>
                    {data?.coach_whatsapp && (
                        <a
                            href={`https://wa.me/${data.coach_whatsapp.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#25D366", color: "#FFFFFF", padding: "12px 24px", borderRadius: "8px", textDecoration: "none", fontSize: "13px", fontWeight: 600, fontFamily: "var(--font-urbanist, sans-serif)" }}
                        >
                            <MessageCircle style={{ width: "16px", height: "16px" }} />
                            Message {data.coach_name || "your coach"}
                        </a>
                    )}
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#0A0A0A", padding: "24px" }}>
                <div style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "32px", maxWidth: "440px", width: "100%", textAlign: "center" }}>
                    <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "rgba(16,185,129,0.1)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
                        <CheckCircle style={{ width: "24px", height: "24px", color: "#10B981" }} />
                    </div>
                    <h2 style={{ fontFamily: "var(--font-barlow, sans-serif)", fontSize: "28px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.02em", color: "#FFFFFF", marginBottom: "12px" }}>
                        Renewed.
                    </h2>
                    <p style={{ fontSize: "14px", color: "#C8C8C8", lineHeight: 1.6, fontFamily: "var(--font-urbanist, sans-serif)" }}>
                        Your {data?.program_name} has been renewed. Coach {data?.coach_name?.split(" ")[0]} will be in touch on WhatsApp.
                    </p>
                </div>
            </div>
        );
    }

    if (!data) return null;

    const endDateFormatted = new Date(data.end_date).toLocaleDateString("en-IN", {
        day: "numeric", month: "long", year: "numeric"
    });

    return (
        <div style={{ minHeight: "100vh", background: "#0A0A0A", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", fontFamily: "var(--font-urbanist, sans-serif)" }}>
            <div style={{ maxWidth: "480px", width: "100%" }}>

                {/* Header */}
                <div style={{ textAlign: "center", marginBottom: "28px" }}>
                    <div style={{ width: "48px", height: "48px", background: "#E8001D", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", fontFamily: "var(--font-barlow, sans-serif)", fontSize: "18px", fontWeight: 500, color: "#FFFFFF" }}>
                        {data.coach_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)}
                    </div>
                    <p style={{ fontSize: "12px", color: "#888888", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600, marginBottom: "6px" }}>Coach {data.coach_name.split(" ")[0]}</p>
                    <h1 style={{ fontFamily: "var(--font-barlow, sans-serif)", fontSize: "32px", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.02em", color: "#FFFFFF", lineHeight: 1.1, marginBottom: "8px" }}>
                        Keep the<br /><span style={{ color: "#E8001D" }}>momentum.</span>
                    </h1>
                    <p style={{ fontSize: "13px", color: "#C8C8C8" }}>
                        Your {data.program_name} ends on {endDateFormatted}
                    </p>
                </div>

                {/* Progress card */}
                <div style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "20px", marginBottom: "12px" }}>
                    <p style={{ fontSize: "11px", fontWeight: 700, color: "#888888", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "16px" }}>Your progress this program</p>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                        <div style={{ textAlign: "center" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", marginBottom: "4px" }}>
                                <Zap style={{ width: "12px", height: "12px", color: "#E8001D" }} />
                            </div>
                            <div style={{ fontSize: "22px", fontWeight: 700, color: "#FFFFFF", lineHeight: 1 }}>
                                {data.stats.avg_energy !== null ? `${data.stats.avg_energy}/10` : "—"}
                            </div>
                            <div style={{ fontSize: "10px", color: "#888888", marginTop: "4px" }}>Avg energy</div>
                        </div>
                        <div style={{ textAlign: "center", borderLeft: "1px solid rgba(255,255,255,0.06)", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", marginBottom: "4px" }}>
                                <Target style={{ width: "12px", height: "12px", color: "#E8001D" }} />
                            </div>
                            <div style={{ fontSize: "22px", fontWeight: 700, color: "#FFFFFF", lineHeight: 1 }}>
                                {data.stats.total_sessions}
                            </div>
                            <div style={{ fontSize: "10px", color: "#888888", marginTop: "4px" }}>Sessions done</div>
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", marginBottom: "4px" }}>
                                <CheckCircle style={{ width: "12px", height: "12px", color: "#E8001D" }} />
                            </div>
                            <div style={{ fontSize: "22px", fontWeight: 700, color: "#FFFFFF", lineHeight: 1 }}>
                                {data.stats.total_checkins}
                            </div>
                            <div style={{ fontSize: "10px", color: "#888888", marginTop: "4px" }}>Check-ins</div>
                        </div>
                    </div>
                </div>

                {/* Program + amount card */}
                <div style={{ background: "#111111", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "20px", marginBottom: "16px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                            <div style={{ fontSize: "15px", fontWeight: 600, color: "#FFFFFF", marginBottom: "4px" }}>{data.program_name}</div>
                            <div style={{ fontSize: "12px", color: "#C8C8C8" }}>{data.program_duration_weeks} weeks · renews from today</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <div style={{ fontFamily: "var(--font-barlow, sans-serif)", fontSize: "28px", fontWeight: 500, color: "#FFFFFF", lineHeight: 1 }}>
                                ₹{data.amount.toLocaleString("en-IN")}
                            </div>
                            <div style={{ fontSize: "10px", color: "#888888", marginTop: "2px" }}>incl. GST</div>
                        </div>
                    </div>
                </div>

                {/* Pay button */}
                <RButton
                    programId={""}
                    slug={""}
                    clientData={{
                        full_name: data.client_name,
                        whatsapp_number: "",
                        email: "",
                        age: 0,
                        primary_goal: "",
                    }}
                    label={`Renew for ₹${data.amount.toLocaleString("en-IN")} →`}
                    onSuccess={() => setSuccess(true)}
                    onError={(err: string) => setError(err)}
                    orderId={data.order_id}
                    enrollmentId={data.enrollment_id}
                    isRenewal={true}
                />

                <p style={{ fontSize: "11px", color: "#888888", textAlign: "center", marginTop: "12px" }}>
                    Secured by Razorpay · UPI, card, net banking accepted
                </p>
            </div>
        </div>
    );
}

export default function RenewPage() {
    return (
        <Suspense fallback={
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "#0A0A0A" }}>
                <Loader2 style={{ width: "28px", height: "28px", color: "#E8001D" }} className="animate-spin" />
            </div>
        }>
            <RenewContent />
        </Suspense>
    );
}
