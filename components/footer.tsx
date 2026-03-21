import Link from "next/link";
import Image from "next/image";

export function Footer() {
    return (
        <footer className="border-t border-border/50 bg-card/50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <Image
                                src="/Fitosys_Logo_v1.png"
                                alt="Fitosys"
                                width={140}
                                height={40}
                                className="object-contain"
                            />
                        </div>
                        <p className="text-sm text-muted-foreground max-w-md">
                            The business operating system for independent fitness, wellness, and yoga coaches.
                            Automate client onboarding, weekly check-ins, and renewals on WhatsApp.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-sm font-semibold text-foreground mb-4">Product</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link href="/#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Pricing
                                </Link>
                            </li>
                            <li>
                                <Link href="/demo" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Demo
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h3 className="text-sm font-semibold text-foreground mb-4">Company</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link href="/signup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Sign Up
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Privacy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Terms
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-8 pt-8 border-t border-border/50">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-xs text-muted-foreground">
                            © {new Date().getFullYear()} Fitosys by Alchemetryx. All rights reserved.
                        </p>
                        <div className="flex items-center gap-4">
                            <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                                Privacy Policy
                            </Link>
                            <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                                Terms of Service
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
