"use client";

import { use, useEffect, useState, Suspense } from "react";
import { Loader2 } from "lucide-react";
import { SuccessContent, SuccessDetail } from "@/components/ui/success-content";

function GenericSuccessContent() {
  const [clientName, setClientName] = useState("Client");
  const [details, setDetails] = useState<SuccessDetail[]>([]);

  useEffect(() => {
    const urlParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
    const name = urlParams.get("name") || "there";
    const coach = urlParams.get("coach") || "Your Coach";
    const program = urlParams.get("program") || "Your Program";
    const amount = urlParams.get("amount");

    setClientName(name);
    const newDetails: SuccessDetail[] = [
      { label: "Coach", value: coach },
      { label: "Program", value: program },
      { label: "Status", value: "Confirmed" }
    ];

    if (amount) {
      newDetails.push({ label: "Amount", value: `₹${amount}`, isCurrency: true });
    }

    setDetails(newDetails);
  }, []);

  return (
    <SuccessContent
      subtitle={`Hi ${clientName}! Everything is set. Check your WhatsApp for next steps.`}
      details={details}
      ctaText="Back to Home"
      ctaHref="/"
    />
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-brand" />
      </div>
    }>
      <GenericSuccessContent />
    </Suspense>
  );
}
