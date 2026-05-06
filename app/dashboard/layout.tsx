import { IconSidebar } from "@/components/dashboard/icon-sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { TabBar } from "@/components/ui/navigation";
import Link from "next/link";
import Image from "next/image";
import { Bell } from "lucide-react";
import { redirect } from "next/navigation";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { getTrialDaysRemaining, getTrialStatus } from "@/lib/plans/trial";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let coachName = "Coach";
  let coachInitials = "C";
  let coach: any = null;

  if (user) {
    const serviceSupabase = await createServiceClient();
    const { data } = await serviceSupabase
      .from("coaches")
      .select("full_name, whatsapp_number, plan, trial_expires_at")
      .eq("id", user.id)
      .single();
    
    coach = data;

    const needsOnboarding = coach?.whatsapp_number === "PENDING_SETUP";
    if (needsOnboarding) {
      redirect("/onboarding/profile");
    }

    if (coach?.full_name) {
      coachName = coach.full_name.split(" ")[0];
      coachInitials = coach.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
  }

  const trialStatus = getTrialStatus(coach);
  const trialDaysRemaining = getTrialDaysRemaining(coach);

  let banner = null;
  if (trialStatus === "active" || trialStatus === "expired") {
    if (trialDaysRemaining > 7) {
      banner = (
        <div className="bg-emerald-900/30 border-b border-emerald-500/20 px-4 py-2.5 text-center text-[13px] text-emerald-400">
          You are on a free trial — {trialDaysRemaining} days remaining. Up to 5 clients. No credit card needed.
        </div>
      );
    } else if (trialDaysRemaining >= 4 && trialDaysRemaining <= 7) {
      banner = (
        <div className="bg-amber-900/30 border-b border-amber-500/20 px-4 py-2.5 text-center text-[13px] text-amber-400 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
          <span>Your trial expires in {trialDaysRemaining} days. Add a plan to keep your clients running.</span>
          <Link href="/dashboard/billing" className="bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 px-3 py-1 rounded-full text-xs font-medium transition-colors">Upgrade Now</Link>
        </div>
      );
    } else {
      banner = (
        <div className="bg-red-900/30 border-b border-red-500/20 px-4 py-2.5 text-center text-[13px] text-red-400 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
          <span>Trial expires in {trialDaysRemaining} days. Client onboarding will pause after expiry.</span>
          <Link href="/dashboard/billing" className="bg-red-500/20 hover:bg-red-500/30 text-red-300 px-3 py-1 rounded-full text-xs font-medium transition-colors">Upgrade Now</Link>
        </div>
      );
    }
  }

  return (
    <div className="shell">
      {/* Desktop icon sidebar */}
      <IconSidebar notificationsCount={3} />

      {/* Main content area */}
      <main className="main flex flex-col h-screen overflow-hidden">
        {banner}
        {/* Top bar with greeting */}
        <Topbar coachName={coachName} coachInitials={coachInitials} />

        {/* Mobile header fallback (hidden on desktop) */}
        <header className="md:hidden sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-white/5 h-16 px-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image
              src="/logov2.png"
              alt="Fitosys Logo"
              width={100}
              height={22}
              className="h-5 w-auto object-contain brightness-0 invert"
            />
          </Link>
          <button className="h-10 w-10 flex items-center justify-center rounded-full bg-[#111111] border border-white/5">
            <Bell className="h-5 w-5 text-[#A0A0A0]" />
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scroll-area pb-16 md:pb-0">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden">
        <TabBar
          tabs={[
            { id: "home", label: "Home", href: "/dashboard", icon: <Bell className="h-5 w-5" /> },
            { id: "clients", label: "Clients", href: "/dashboard/clients", icon: <Bell className="h-5 w-5" /> },
            { id: "programs", label: "Programs", href: "/dashboard/programs", icon: <Bell className="h-5 w-5" /> },
            { id: "pulse", label: "Pulse", href: "/dashboard/pulse", icon: <Bell className="h-5 w-5" /> },
            { id: "settings", label: "Settings", href: "/dashboard/settings", icon: <Bell className="h-5 w-5" /> },
          ]}
        />
      </div>
    </div>
  );
}
