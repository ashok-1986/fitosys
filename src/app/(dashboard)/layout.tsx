"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
    LayoutDashboard,
    Users,
    Package,
    Activity,
    CreditCard,
    Settings,
    Menu,
    X,
    LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const NAV_ITEMS = [
    { href: "/dashboard", label: "Home", icon: LayoutDashboard },
    { href: "/dashboard/clients", label: "Clients", icon: Users },
    { href: "/dashboard/programs", label: "Programs", icon: Package },
    { href: "/dashboard/pulse", label: "Weekly Pulse", icon: Activity },
    { href: "/dashboard/payments", label: "Payments", icon: CreditCard },
    { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

function NavLinks({ onClick }: { onClick?: () => void }) {
    const pathname = usePathname();

    return (
        <nav className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => {
                const isActive =
                    pathname === item.href ||
                    (item.href !== "/dashboard" && pathname.startsWith(item.href));
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        onClick={onClick}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                            ? "bg-brand/10 text-brand"
                            : "text-muted-foreground hover:bg-accent hover:text-foreground"
                            }`}
                    >
                        <item.icon className="h-4 w-4 shrink-0" />
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    );
}

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [open, setOpen] = useState(false);

    return (
        <div className="min-h-screen bg-background">
            {/* Desktop Sidebar */}
            <aside className="hidden md:flex fixed inset-y-0 left-0 z-30 w-64 flex-col border-r border-border bg-card">
                <div className="flex h-16 items-center px-6 border-b border-border">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <h1 className="text-xl font-bold tracking-tight">
                            <span className="text-brand">Fito</span>
                            <span className="text-foreground">sys</span>
                        </h1>
                    </Link>
                </div>
                <div className="flex-1 px-4 py-4 overflow-y-auto">
                    <NavLinks />
                </div>
                <div className="p-4 border-t border-border">
                    <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-foreground transition-colors w-full">
                        <LogOut className="h-4 w-4" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Mobile Header */}
            <header className="md:hidden fixed top-0 inset-x-0 z-30 h-14 bg-card border-b border-border flex items-center px-4">
                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon" className="mr-3">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 p-0">
                        <div className="flex h-14 items-center justify-between px-6 border-b border-border">
                            <h1 className="text-xl font-bold tracking-tight">
                                <span className="text-brand">Fito</span>
                                <span className="text-foreground">sys</span>
                            </h1>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setOpen(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                        <div className="px-4 py-4">
                            <NavLinks onClick={() => setOpen(false)} />
                        </div>
                    </SheetContent>
                </Sheet>
                <h1 className="text-lg font-bold tracking-tight">
                    <span className="text-brand">Fito</span>
                    <span className="text-foreground">sys</span>
                </h1>
            </header>

            {/* Main Content */}
            <main className="md:pl-64 pt-14 md:pt-0 min-h-screen">
                <div className="p-4 md:p-8 max-w-7xl mx-auto">{children}</div>
            </main>
        </div>
    );
}
