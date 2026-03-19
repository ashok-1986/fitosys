import { StatPair } from "@/components/ui/StatPair";

const TICKER_ITEMS = [
    { value: "₹72K+", label: "annual revenue lost per coach to ghosted renewals" },
    { value: "11hrs", label: "spent per week on manual WhatsApp check-ins" },
    { value: "30min", label: "to automate onboarding with Razorpay & UPI" },
    { value: "7AM", label: "Gemini AI Monday briefing delivered to your inbox" },
    { value: "Zero", label: "manual GST invoices. Fully automated by Fitosys." },
    // Duplicate for seamless loop
    { value: "₹72K+", label: "annual revenue lost per coach to ghosted renewals" },
    { value: "11hrs", label: "spent per week on manual WhatsApp check-ins" },
    { value: "30min", label: "to automate onboarding with Razorpay & UPI" },
    { value: "7AM", label: "Gemini AI Monday briefing delivered to your inbox" },
    { value: "Zero", label: "manual GST invoices. Fully automated by Fitosys." },
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
