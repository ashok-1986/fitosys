"use client";

import { Calendar as CalendarIcon, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function CalendarPlaceholderPage() {
    return (
        <div className="p-8 max-w-4xl mx-auto h-[80vh] flex flex-col items-center justify-center text-center">
            <div className="h-20 w-20 rounded-2xl bg-brand/5 border border-brand/10 flex items-center justify-center mb-8">
                <CalendarIcon className="h-10 w-10 text-brand" />
            </div>

            <h1 className="text-4xl font-display font-medium uppercase tracking-tight mb-4 text-white">
                Calendar <span className="text-white/20">Phase 2</span>
            </h1>

            <p className="text-muted-foreground text-lg max-w-md leading-relaxed mb-12">
                Manage client sessions, significant dates, and renewal periods in a unified view. Coming soon to your business OS.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full opacity-40">
                {[
                    { label: "Check-in Windows", desc: "Automated Sunday slots" },
                    { label: "Renewal Alerts", desc: "Expiry date visualization" },
                    { label: "Client sessions", desc: "Booking integration" },
                ].map((feature, i) => (
                    <Card key={i} className="bg-white/5 border-white/5 p-6 rounded-xl">
                        <Clock className="h-5 w-5 text-brand mb-3 mx-auto" />
                        <h3 className="text-sm font-bold uppercase tracking-widest text-white mb-2">{feature.label}</h3>
                        <p className="text-xs text-muted-foreground">{feature.desc}</p>
                    </Card>
                ))}
            </div>
        </div>
    );
}
