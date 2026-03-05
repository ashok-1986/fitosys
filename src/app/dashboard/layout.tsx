import Link from "next/link";
import { Activity, Users, Settings, Bell, LayoutDashboard, CheckSquare } from "lucide-react";
import { TabBar } from "@/components/ui/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0A0A0A] font-sans text-white selection:bg-[#E8001D]/30">
      {/* ── Mobile Header (Visible only on small screens) ── */}
      <header className="md:hidden sticky top-0 z-40 bg-[#0A0A0A]/80 backdrop-blur-md border-b border-white/5 h-16 px-4 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
            <span className="font-barlow font-bold text-xl tracking-wide uppercase text-white">
                Fito<span className="text-[#E8001D]">sys</span>
            </span>
        </Link>
        <button className="h-10 w-10 flex items-center justify-center rounded-full bg-[#111111] border border-white/5">
            <Bell className="h-5 w-5 text-[#A0A0A0]" />
        </button>
      </header>

      <div className="flex w-full max-w-[1400px] mx-auto">
        {/* ── Desktop Sidebar ── */}
        <aside className="hidden md:flex flex-col w-64 h-screen sticky top-0 border-r border-white/5 bg-[#0A0A0A] p-6 justify-between">
          <div>
            <Link href="/dashboard" className="flex items-center gap-2 mb-12 px-2 hover:opacity-80 transition-opacity">
                <img 
                    src="/fitosys-logo.png" 
                    alt="Fitosys" 
                    className="h-10 w-auto object-contain"
                />
            </Link>

            <nav className="flex flex-col gap-2">
              <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-[#E8001D]/10 text-[#E8001D] font-semibold transition-colors">
                <LayoutDashboard className="h-5 w-5" />
                Pulse
              </Link>
              <Link href="/dashboard/clients" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#A0A0A0] hover:text-white hover:bg-white/5 font-semibold transition-colors">
                <Users className="h-5 w-5" />
                Roster
              </Link>
              <Link href="/dashboard/automations" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#A0A0A0] hover:text-white hover:bg-white/5 font-semibold transition-colors">
                <Activity className="h-5 w-5" />
                Workflows
              </Link>
            </nav>
          </div>

          <div className="flex flex-col gap-2">
             <Link href="/dashboard/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-[#A0A0A0] hover:text-white hover:bg-white/5 font-semibold transition-colors">
                <Settings className="h-5 w-5" />
                Settings
              </Link>
          </div>
        </aside>

        {/* ── Main Content Area ── */}
        <main className="flex-1 w-full pb-24 md:pb-12 min-h-screen">
          {children}
        </main>
      </div>

      {/* ── Mobile Bottom Tab Bar ── */}
      <div className="md:hidden">
        <TabBar 
          tabs={[
            { id: "home", label: "Pulse", href: "/dashboard", icon: <LayoutDashboard className="h-5 w-5" /> },
            { id: "clients", label: "Roster", href: "/dashboard/clients", icon: <Users className="h-5 w-5" /> },
            { id: "checkin", label: "Check-in", href: "/dashboard/checkin", icon: <CheckSquare className="h-5 w-5" /> },
            { id: "settings", label: "Settings", href: "/dashboard/settings", icon: <Settings className="h-5 w-5" /> },
          ]} 
        />
      </div>
    </div>
  );
}
