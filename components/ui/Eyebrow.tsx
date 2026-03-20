import React from "react";

interface EyebrowProps {
    label: string;
}

export function Eyebrow({ label }: EyebrowProps) {
    return (
        <div className="flex items-center gap-3">
            <div className="w-10 h-px bg-[var(--red)]" />
            <span className="text-[13px] font-medium tracking-[0.08em] uppercase text-[var(--red)] font-sans">
                {label}
            </span>
        </div>
    );
}
