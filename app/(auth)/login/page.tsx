"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { loginAction, googleSignInAction } from "@/app/actions/auth";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");

        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
            const result = await loginAction(formData);
            if (!result.success) {
                setError(result.error);
            }
        });
    };

    return (
        <Card className="border-white/5 bg-[#111111] shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-[#E8001D]" />
            <CardHeader className="space-y-1 text-center pt-10">
                {/* Logo */}
                <div className="flex justify-center mb-6">
                    <Image
                        src="/logov2.png"
                        alt="Fitosys"
                        width={140}
                        height={32}
                        className="object-contain brightness-0 invert"
                        priority
                    />
                </div>
                <CardTitle className="text-2xl font-semibold">Welcome back</CardTitle>
                <CardDescription>
                    Sign in to your coaching dashboard
                </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    {error && (
                        <div className="bg-destructive/10 text-destructive text-sm px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <Button
                        variant="outline"
                        className="w-full"
                        type="button"
                        onClick={() => startTransition(async () => {
                            await googleSignInAction();
                        })}
                        disabled={isPending}
                    >
                        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                            <path d="M1 1h22v22H1z" fill="none" />
                        </svg>
                        Continue with Google
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">
                                Or continue with email
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email" className="text-[11px] font-bold uppercase tracking-widest text-[#A0A0A0]">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="coach@example.com"
                            required
                            autoComplete="email"
                            className="bg-white/5 border-white/10 focus:border-[#E8001D]/50 transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password" title="Password" className="text-[11px] font-bold uppercase tracking-widest text-[#A0A0A0]">Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                required
                                autoComplete="current-password"
                                className="bg-white/5 border-white/10 focus:border-[#E8001D]/50 transition-all"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex flex-col gap-4">
                    <Button
                        type="submit"
                        className="w-full bg-brand hover:bg-brand/90 text-white"
                        disabled={isPending}
                    >
                        {isPending ? (
                            <span className="flex items-center gap-2">
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                Signing in...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                <LogIn className="h-4 w-4" />
                                Sign In
                            </span>
                        )}
                    </Button>
                    <p className="text-sm text-muted-foreground text-center">
                        Don&apos;t have an account?{" "}
                        <Link
                            href="/signup"
                            className="text-brand hover:underline font-medium"
                        >
                            Sign up
                        </Link>
                    </p>
                </CardFooter>
            </form>
        </Card>
    );
}
