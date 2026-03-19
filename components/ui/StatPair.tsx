import React from "react";

interface StatPairProps {
    value: string | number;
    label: string;
    valueColor?: string; // e.g. "text-[var(--red)]" or "text-white"
}

export function StatPair({ value, label, valueColor = "text-white" }: StatPairProps) {
    return (
        <div className="flex flex-col gap-1">
            {/* Number: D5 Scale (48px/40px/32px) + Barlow Condensed */}
            <div className={`font-display font-medium text-[32px] md:text-[40px] lg:text-[48px] leading-none tracking-[0.02em] uppercase ${valueColor}`}>
                {value}
            </div>
            {/* Label: B4 Scale (13px) + Urbanist */}
            <div className="font-sans text-[13px] text-[var(--grey)] leading-[1.4]">
                {label}
            </div>
        </div>
    );
}
