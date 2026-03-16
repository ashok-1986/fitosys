"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  LayoutDashboard,
  Calendar,
  Users,
  BarChart3,
  FileText,
  Plus,
  Settings,
  LogOut,
  UserPlus,
  Dumbbell
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface IconSidebarProps {
  notificationsCount?: number;
}

export function IconSidebar({ notificationsCount = 0 }: IconSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [quickAddOpen, setQuickAddOpen] = useState(false);

  const navItems = [
    { icon: LayoutDashboard, href: "/dashboard", label: "Dashboard" },
    { icon: Calendar, href: "/dashboard/calendar", label: "Calendar" },
    { icon: Users, href: "/dashboard/clients", label: "Clients", hasNotification: notificationsCount > 0 },
    { icon: BarChart3, href: "/dashboard/analytics", label: "Analytics" },
    { icon: FileText, href: "/dashboard/programs", label: "Programs" },
  ];

  const handleAddClick = () => {
    setQuickAddOpen(true);
  };

  const handleAddClient = () => {
    setQuickAddOpen(false);
    router.push("/dashboard/intake");
  };

  const handleAddProgram = () => {
    setQuickAddOpen(false);
    router.push("/dashboard/programs");
  };

  const handleSignOut = async () => {
    try {
      const { logoutAction } = await import("@/app/actions/auth");
      await logoutAction();
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sb-logo">
        <Image src="/logov2.png" alt="Fitosys Logo" width={34} height={34} />
      </div>

      {/* Navigation */}
      <nav className="sb-nav">
        {navItems.map((item) => {
          const isActive = pathname === item.href || 
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "sb-btn",
                isActive && "on"
              )}
              aria-label={item.label}
              title={item.label}
            >
              <item.icon className="h-4 w-4" aria-hidden="true" />
              {item.hasNotification && <div className="sb-dot" />}
            </Link>
          );
        })}
        
        {/* Add button */}
        <button
          className="sb-btn"
          aria-label="Add new"
          title="Add new"
          onClick={handleAddClick}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
        </button>
      </nav>

      {/* Footer actions */}
      <div className="sb-foot">
        <Link
          href="/dashboard/settings"
          className="sb-btn"
          aria-label="Settings"
          title="Settings"
        >
          <Settings className="h-4 w-4" aria-hidden="true" />
        </Link>
        <button
          className="sb-btn"
          aria-label="Sign out"
          title="Sign out"
          onClick={handleSignOut}
        >
          <LogOut className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {/* Quick Add Modal */}
      <Dialog open={quickAddOpen} onOpenChange={setQuickAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Quick Add</DialogTitle>
            <DialogDescription>
              Add a new client or program to get started quickly
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button
              onClick={handleAddClient}
              variant="outline"
              className="h-24 flex flex-col gap-2 hover:bg-brand hover:text-white hover:border-brand"
            >
              <UserPlus className="h-8 w-8" />
              <span className="font-semibold">Add Client</span>
            </Button>
            <Button
              onClick={handleAddProgram}
              variant="outline"
              className="h-24 flex flex-col gap-2 hover:bg-brand hover:text-white hover:border-brand"
            >
              <Dumbbell className="h-8 w-8" />
              <span className="font-semibold">Add Program</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </aside>
  );
}
