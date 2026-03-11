import { IconSidebar } from "@/components/dashboard/icon-sidebar";
import { Topbar } from "@/components/dashboard/topbar";
import { TabBar } from "@/components/ui/navigation";
import Link from "next/link";
import { Bell } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="shell">
      {/* Desktop icon sidebar */}
      <IconSidebar notificationsCount={3} />

      {/* Main content area */}
      <main className="main">
        {/* Top bar with greeting */}
        <Topbar coachName="Priya" coachInitials="PK" />

        {/* Mobile header fallback (hidden on desktop) */}
        <header className="md:hidden sticky top-0 z-40 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/5 h-16 px-4 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="font-barlow font-bold text-xl tracking-wide uppercase text-white">
              Fito<span className="text-[#F20000]">sys</span>
            </span>
          </Link>
          <button className="h-10 w-10 flex items-center justify-center rounded-full bg-[#111111] border border-white/5">
            <Bell className="h-5 w-5 text-[#A0A0A0]" />
          </button>
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Tab Bar */}
      <div className="md:hidden">
        <TabBar
          tabs={[
            { id: "home", label: "Home", href: "/dashboard", icon: <Bell className="h-5 w-5" /> },
            { id: "clients", label: "Clients", href: "/dashboard/clients", icon: <Bell className="h-5 w-5" /> },
            { id: "checkin", label: "Check-in", href: "/dashboard/checkin", icon: <Bell className="h-5 w-5" /> },
            { id: "settings", label: "Settings", href: "/dashboard/settings", icon: <Bell className="h-5 w-5" /> },
          ]}
        />
      </div>
    </div>
  );
}
