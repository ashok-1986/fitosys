import { StatPair } from "@/components/ui/StatPair";

const TICKER_ITEMS = [
    { value: "48h", label: "Average delay in trainer response" },
    { value: "31%", label: "Clients who churn after week 4" },
    { value: "11hrs", label: "Spent strictly on admin per week" },
    { value: "2.5x", label: "More likely to renew if checked-in weekly" },
    // Duplicate for seamless loop
    { value: "48h", label: "Average delay in trainer response" },
    { value: "31%", label: "Clients who churn after week 4" },
    { value: "11hrs", label: "Spent strictly on admin per week" },
    { value: "2.5x", label: "More likely to renew if checked-in weekly" },
];

export function PainTicker() {
    return (
        <div className="w-full bg-[var(--surface)] border-y border-[var(--border)] py-10 overflow-hidden flex relative">
            {/* 
        Tailwind v4 `animate-[...]` lets us use custom arbitrary keyframes.
        The keyframes `marquee` is injected in globals.css 
      */}
            <div className="flex animate-[marquee_25s_linear_infinite] whitespace-nowrap min-w-max">
                {TICKER_ITEMS.map((item, i) => (
                    <div key={i} className="flex items-center justify-center min-w-[300px]">
                        <div className="flex flex-col items-center text-center">
                            <StatPair value={item.value} label={item.label} valueColor="text-[var(--white)]" />
                        </div>
                        {/* The dot separator */}
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--red-border)] mx-12 shrink-0" />
                    </div>
                ))}
            </div>
        </div>
    );
}
