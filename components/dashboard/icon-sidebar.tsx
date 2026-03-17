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
  LogOut
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface IconSidebarProps {
  notificationsCount?: number;
}

export function IconSidebar({ notificationsCount = 0 }: IconSidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { icon: LayoutDashboard, href: "/dashboard", label: "Dashboard" },
    { icon: Calendar, href: "/dashboard/calendar", label: "Calendar" },
    { icon: Users, href: "/dashboard/clients", label: "Clients", hasNotification: notificationsCount > 0 },
    { icon: BarChart3, href: "/dashboard/pulse", label: "Pulse" },
    { icon: FileText, href: "/dashboard/programs", label: "Programs" },
  ];

  const handleAddClick = () => {
    // TODO: Open quick add modal
    console.log("Add new client/program");
  };

  const handleSignOut = async () => {
    // TODO: Implement sign out
    console.log("Sign out");
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
    </aside>
  );
}
