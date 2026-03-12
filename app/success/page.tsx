"use client";

import { use, useEffect, useState } from "react";
import { CheckCircle, Mail, Phone, Home } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NavBar } from "@/components/ui/navigation";

export default function SuccessPage({ params }: { params: Promise<{ clientId?: string }> }) {
  const resolvedParams = use(params);
  const [clientName, setClientName] = useState("there");
  const [coachName, setCoachName] = useState("your coach");
  const [programName, setProgramName] = useState("the program");
  const [startDate, setStartDate] = useState("");

  useEffect(() => {
    // In production, fetch enrollment details from API
    // For now, use URL params or defaults
    const urlParams = new URLSearchParams(typeof window !== "undefined" ? window.location.search : "");
    const name = urlParams.get("name");
    const coach = urlParams.get("coach");
    const program = urlParams.get("program");
    const start = urlParams.get("start");

    if (name) setClientName(name);
    if (coach) setCoachName(coach);
    if (program) setProgramName(program);
    if (start) setStartDate(start);
    else setStartDate(new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }));
  }, []);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white font-sans overflow-y-auto pb-24">
      <NavBar
        title="Success"
        back="Home"
        backHref="/"
      />

      <div className="flex items-center justify-center px-4 py-12">
        <Card className="max-w-md w-full border-brand/20">
          <CardHeader className="text-center pb-2">
            <div className="mx-auto mb-4">
              <CheckCircle className="h-20 w-20 text-[#34C759] mx-auto" />
            </div>
            <h1 className="text-2xl font-bold font-barlow uppercase">
              You&apos;re All Set! 🎉
            </h1>
            <p className="text-sm text-white/60 mt-2">
              Welcome to {coachName}&apos;s coaching program
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Success Message */}
            <div className="text-center space-y-2">
              <p className="text-sm text-white/80">
                Hi <span className="font-semibold">{clientName}</span>! Your enrollment in{" "}
                <span className="font-semibold">{programName}</span> is confirmed.
              </p>
              <p className="text-xs text-white/40">
                Start date: <span className="font-medium">{startDate}</span>
              </p>
            </div>

            {/* What's Next */}
            <div className="bg-[#1C1C1E] rounded-xl p-4 space-y-3">
              <p className="text-xs font-bold uppercase tracking-widest text-white/40">
                What&apos;s Next
              </p>
              <div className="space-y-2">
                <NextStep
                  icon={<Mail className="h-4 w-4" />}
                  text="You'll receive a WhatsApp confirmation shortly"
                />
                <NextStep
                  icon={<Phone className="h-4 w-4" />}
                  text={`Your coach ${coachName.split(' ')[0]} will reach out within 24 hours`}
                />
                <NextStep
                  icon={<CheckCircle className="h-4 w-4" />}
                  text="Complete your first weekly check-in on Sunday"
                />
              </div>
            </div>

            {/* Contact Info */}
            <div className="text-center space-y-2 pt-4 border-t">
              <p className="text-xs text-white/40">
                Need help? Contact your coach directly:
              </p>
              <div className="flex gap-2 justify-center">
                <Button size="sm" variant="outline" className="text-xs">
                  <Mail className="h-3 w-3 mr-1" />
                  Email
                </Button>
                <Button size="sm" variant="outline" className="text-xs">
                  <Phone className="h-3 w-3 mr-1" />
                  WhatsApp
                </Button>
              </div>
            </div>

            {/* CTA */}
            <div className="pt-4">
              <Button className="w-full bg-brand hover:bg-brand/90" size="lg" asChild>
                <a href="/">
                  <Home className="h-4 w-4 mr-2" />
                  Back to Home
                </a>
              </Button>
            </div>

            {/* Footer */}
            <p className="text-[10px] text-white/30 text-center pt-4 border-t">
              Powered by Fitosys • Payments secured by Razorpay
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function NextStep({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-brand mt-0.5">{icon}</div>
      <p className="text-sm text-white/70 leading-relaxed">{text}</p>
    </div>
  );
}
