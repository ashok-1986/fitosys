"use client";

import React, { useState, useTransition } from "react";
import { NavBar } from "@/components/ui/navigation";
import { ProgressBar } from "@/components/ui/design-system";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { submitCheckin } from "@/lib/actions";

export default function CheckinScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientId = searchParams.get("clientId");
  
  const [step, setStep] = useState(0);
  const [energy, setEnergy] = useState(7);
  const [sessions, setSessions] = useState(3);
  const [win, setWin] = useState("");
  const [struggle, setStruggle] = useState("");
  
  const [isPending, startTransition] = useTransition();
  const [isDone, setIsDone] = useState(false);

  const questions = [
    { id: "energy", label: "How's your energy this week?", type: "scale" },
    { id: "sessions", label: "Training sessions completed?", type: "sessions" },
    { id: "win", label: "One win this week 🏆", type: "text" },
    { id: "struggle", label: "What challenged you? 💪", type: "text" },
  ];

  const total = questions.length;

  const handleNext = () => {
    if (step < total - 1) {
      setStep(s => s + 1);
    } else {
      // Final Submit
      if (!clientId) {
        alert("Client ID is missing. Cannot save checkin.");
        setIsDone(true);
        return;
      }

      startTransition(async () => {
        await submitCheckin({
          coach_id: "00000000-0000-0000-0000-000000000000", // Fallback for MVP
          client_id: clientId,
          energy,
          sessions,
          win,
          struggle
        });
        setIsDone(true);
      });
    }
  };

  if (isDone) {
    return (
      <div className="flex-1 w-full bg-[#0A0A0A] text-white flex flex-col items-center justify-center p-8 min-h-screen font-sans">
        <div className="text-6xl mb-6">✅</div>
        <h2 className="text-3xl font-bold font-barlow tracking-wider mb-3 text-center uppercase">
          Check-in Saved
        </h2>
        <p className="text-[15px] text-white/60 leading-relaxed text-center mb-8 max-w-xs">
          The tracking data has been securely logged to the database.
        </p>
        <button 
          onClick={() => router.push("/dashboard")}
          className="bg-[#F20000] hover:bg-[#C20000] text-white px-12 py-4 rounded-xl text-base font-bold font-barlow tracking-widest uppercase transition-colors shadow-[0_4px_24px_rgba(242,0,0,0.18)]"
        >
          Done
        </button>
      </div>
    );
  }

  const q = questions[step];

  return (
    <div className="flex-1 w-full flex flex-col min-h-screen bg-[#0A0A0A] text-white font-sans overflow-hidden">
      <NavBar 
        title="Log Check-in" 
        back="Cancel" 
        backHref="/dashboard/clients" 
      />

      {/* ── Progress ── */}
      <div className="px-5 pt-3">
        <div className="flex justify-between mb-2">
          <p className="text-xs text-white/40">Step {step + 1} of {total}</p>
        </div>
        <ProgressBar value={step + 1} max={total} color="#F20000" />
      </div>

      <div className="flex-1 px-6 pt-10 overflow-y-auto pb-4">
        <h2 className="text-2xl font-bold leading-tight mb-10 tracking-tight">{q.label}</h2>

        {/* ── Energy Scale Slider ── */}
        {q.type === "scale" && (
          <div className="w-full max-w-md mx-auto">
            <div className="text-[64px] font-black font-barlow text-[#F20000] text-center mb-8 leading-none">
              {energy}
            </div>
            
            <input 
              type="range" 
              min={1} 
              max={10} 
              value={energy} 
              onChange={e => setEnergy(parseInt(e.target.value))}
              className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer outline-none accent-[#F20000]"
              style={{
                background: `linear-gradient(to right, #F20000 ${((energy - 1) / 9) * 100}%, rgba(255,255,255,0.1) ${((energy - 1) / 9) * 100}%)`
              }}
            />
            
            <div className="flex justify-between mt-3 px-1">
              <span className="text-xs text-white/40 uppercase tracking-widest font-semibold">Exhausted</span>
              <span className="text-xs text-white/40 uppercase tracking-widest font-semibold">Unstoppable</span>
            </div>
          </div>
        )}

        {/* ── Sessions Grid ── */}
        {q.type === "sessions" && (
          <div className="flex justify-center gap-3 flex-wrap max-w-xs mx-auto">
            {[0, 1, 2, 3, 4, 5, 6, 7].map(n => (
              <button 
                key={n} 
                onClick={() => setSessions(n)} 
                className={cn(
                  "w-14 h-14 rounded-2xl text-xl font-bold font-barlow tracking-widest transition-all",
                  sessions === n 
                    ? "bg-[#F20000] border-[#F20000] text-white shadow-[0_4px_16px_rgba(242,0,0,0.25)] scale-105" 
                    : "bg-[#1C1C1E] border-white/10 text-white/50 border hover:bg-white/5"
                )}
              >
                {n}
              </button>
            ))}
          </div>
        )}

        {/* ── Text Feedback ── */}
        {q.type === "text" && (
          <textarea
            placeholder={q.id === "win" ? "e.g. Hit a new PB on deadlifts..." : "e.g. Sleep was poor this week due to work stress..."}
            value={q.id === "win" ? win : struggle}
            onChange={(e) => q.id === "win" ? setWin(e.target.value) : setStruggle(e.target.value)}
            className="w-full bg-[#1C1C1E] border border-white/10 rounded-2xl p-4 text-white text-[15px] resize-none h-36 outline-none focus:border-white/30 transition-colors placeholder:text-white/30"
          />
        )}
      </div>

      {/* ── Fixed Footer Actions ── */}
      <div className="px-6 pb-8 pt-4 flex gap-3 bg-[#0A0A0A]">
        {step > 0 && (
          <button 
            type="button"
            onClick={() => setStep(s => s - 1)} 
            className="flex-1 bg-[#1C1C1E] border border-white/10 rounded-xl p-4 text-white/60 text-[15px] font-medium transition-colors active:scale-[0.98] hover:bg-white/5"
            disabled={isPending}
          >
            Back
          </button>
        )}
        <button 
          type="button"
          onClick={handleNext} 
          disabled={isPending}
          className="flex-[2] bg-[#F20000] hover:bg-[#C20000] border-none rounded-xl p-4 text-white text-base font-bold font-barlow tracking-widest uppercase transition-colors shadow-[0_4px_24px_rgba(242,0,0,0.18)] active:scale-[0.98] disabled:opacity-50"
        >
          {isPending ? "Saving..." : step === total - 1 ? "Submit ✓" : "Continue →"}
        </button>
      </div>
    </div>
  );
}
