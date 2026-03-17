"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const supabase = createClient();
            const { error } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) throw error;

            setSuccess(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to send reset email");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4">
            <Card className="w-full max-w-md border-[rgba(232,0,29,0.25)] bg-[#111111]">
                <CardHeader className="space-y-1 text-center">
                    {/* Logo */}
                    <Link href="/" className="flex justify-center mb-4">
                        <span className="font-display font-black text-3xl tracking-tight">
                            FITO<span className="text-[#E8001D]">SYS</span>
                        </span>
                    </Link>

                    {!success ? (
                        <>
                            <CardTitle className="text-2xl font-semibold text-white">
                                Forgot password?
                            </CardTitle>
                            <CardDescription className="text-[#A0A0A0]">
                                No worries — we'll send you reset instructions
                            </CardDescription>
                        </>
                    ) : (
                        <>
                            <CardTitle className="text-2xl font-semibold text-white">
                                Check your email
                            </CardTitle>
                            <CardDescription className="text-[#A0A0A0]">
                                We've sent password reset instructions to your email
                            </CardDescription>
                        </>
                    )}
                </CardHeader>

                <CardContent>
                    {!success ? (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="bg-[#EF4444]/10 border border-[#EF4444]/20 text-[#EF4444] text-sm px-4 py-3 rounded-lg flex items-center gap-2">
                                    <AlertCircle size={16} />
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-[#A0A0A0]">
                                    Email address
                                </Label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#A0A0A0]" />
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="coach@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="pl-10 bg-[#1A1A1A] border-[rgba(232,0,29,0.25)] text-white placeholder:text-[#666] focus:border-[#E8001D]"
                                        required
                                    />
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-[#E8001D] hover:bg-[#C20000] text-white font-semibold"
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <span className="h-4 w-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        Sending...
                                    </span>
                                ) : (
                                    "Send reset link"
                                )}
                            </Button>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <div className="bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-sm px-4 py-3 rounded-lg flex items-center gap-2">
                                <CheckCircle size={16} />
                                Reset email sent successfully
                            </div>

                            <div className="text-sm text-[#A0A0A0] space-y-2">
                                <p>
                                    <strong>Didn't receive the email?</strong>
                                </p>
                                <ul className="list-disc list-inside space-y-1 ml-2">
                                    <li>Check your spam folder</li>
                                    <li>Make sure you entered the correct email</li>
                                    <li>Wait a few minutes and try again</li>
                                </ul>
                            </div>

                            <Button
                                onClick={() => {
                                    setSuccess(false);
                                    setEmail("");
                                }}
                                variant="outline"
                                className="w-full border-[rgba(232,0,29,0.25)] text-white hover:bg-[#1A1A1A]"
                            >
                                Try another email
                            </Button>
                        </div>
                    )}
                </CardContent>

                <CardFooter className="flex flex-col space-y-4">
                    <div className="text-sm text-center">
                        <Link
                            href="/login"
                            className="text-[#A0A0A0] hover:text-white flex items-center justify-center gap-2"
                        >
                            <ArrowLeft size={14} />
                            Back to login
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    );
}
