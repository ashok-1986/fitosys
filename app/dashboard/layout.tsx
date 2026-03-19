import { IconSidebar } from "@/components/dashboard/icon-sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { TabBar } from "@/components/ui/navigation";
import Link from "next/link";
import Image from "next/image";
import { Bell } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let coachName = "Coach";
  let coachInitials = "C";

  if (user) {
    const { data: coach } = await supabase
      .from("coaches")
      .select("full_name")
      .eq("id", user.id)
      .single();

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

  return (
    <div className="shell">
      {/* Desktop icon sidebar */}
      <IconSidebar notificationsCount={3} />

      {/* Main content area */}
      <main className="main">
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
        <div className="flex-1 overflow-y-auto scroll-area">
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
