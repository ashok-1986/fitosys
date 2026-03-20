import { StatPair } from "@/components/ui/StatPair";

const TICKER_ITEMS = [
    { value: "₹72,000+", label: "Lost every year to renewals a system should have caught" },
    { value: "3–5 hrs", label: "Spent on WhatsApp admin every week instead of coaching" },
    { value: "10–20%", label: "Annual client churn from missed follow-ups, not poor coaching" },
    { value: "0", label: "Visibility into which clients are quietly about to leave" },
    { value: "Every Sunday", label: "Lost to manual check-in messages that take hours to send" },
    // Duplicate for seamless loop
    { value: "₹72,000+", label: "Lost every year to renewals a system should have caught" },
    { value: "3–5 hrs", label: "Spent on WhatsApp admin every week instead of coaching" },
    { value: "10–20%", label: "Annual client churn from missed follow-ups, not poor coaching" },
    { value: "0", label: "Visibility into which clients are quietly about to leave" },
    { value: "Every Sunday", label: "Lost to manual check-in messages that take hours to send" },
];

export function PainTicker() {
    return (
        <div className="w-full bg-[var(--surface)] border-y border-[var(--border)] py-10 overflow-hidden flex relative">
            <div className="flex animate-[marquee_25s_linear_infinite] whitespace-nowrap min-w-max">
                {TICKER_ITEMS.map((item, i) => (
                    <div key={i} className="flex items-center justify-center min-w-[360px]">
                        <div className="flex flex-col items-center text-center">
                            <StatPair value={item.value} label={item.label} valueColor="text-[var(--white)]" />
                        </div>
                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--red-border)] mx-12 shrink-0" />
                    </div>
                ))}
            </div>
        </div>
    );
}
