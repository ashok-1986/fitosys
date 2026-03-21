"use client";

import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  FileText,
  Settings,
  LogOut,
  Link2,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

interface IconSidebarProps {
  notificationsCount?: number;
}

export function IconSidebar({ notificationsCount = 0 }: IconSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { icon: LayoutDashboard, href: "/dashboard", label: "Home" },
    { icon: Users, href: "/dashboard/clients", label: "Clients", hasNotification: notificationsCount > 0 },
    { icon: BarChart3, href: "/dashboard/pulse", label: "Pulse" },
    { icon: FileText, href: "/dashboard/programs", label: "Programs" },
  ];

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <aside style={{
      width: "200px",
      background: "#0A0A0A",
      borderRight: "1px solid rgba(255,255,255,0.06)",
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
      height: "100vh",
    }}>
      {/* Logo */}
      <div style={{
        height: "64px",
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        flexShrink: 0,
      }}>
        <Image
          src="/Fitosys_Logo_v1.png"
          alt="Fitosys"
          width={110}
          height={24}
          className="object-contain brightness-0 invert"
        />
      </div>

      {/* Navigation */}
      <nav style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: "2px",
        padding: "12px 10px",
      }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "9px 12px",
                borderRadius: "7px",
                position: "relative",
                textDecoration: "none",
                background: isActive ? "rgba(232,0,29,0.1)" : "transparent",
                color: isActive ? "#FFFFFF" : "#444444",
                transition: "all 0.15s",
                fontSize: "13px",
                fontWeight: isActive ? 600 : 400,
                fontFamily: "var(--font-urbanist, sans-serif)",
              }}
              className="sidebar-nav-item"
            >
              {isActive && (
                <span style={{
                  position: "absolute",
                  left: 0,
                  top: "28%",
                  bottom: "28%",
                  width: "2px",
                  background: "#E8001D",
                  borderRadius: "0 2px 2px 0",
                }} />
              )}
              <item.icon style={{ width: "15px", height: "15px", flexShrink: 0 }} />
              <span>{item.label}</span>
              {item.hasNotification && (
                <span style={{
                  marginLeft: "auto",
                  width: "6px",
                  height: "6px",
                  background: "#E8001D",
                  borderRadius: "50%",
                  flexShrink: 0,
                }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div style={{
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "10px 10px",
        display: "flex",
        flexDirection: "column",
        gap: "2px",
      }}>
        <button
          onClick={() => {
            // Copy onboarding link to clipboard
            // Slug comes from coach profile — wire this properly later
            navigator.clipboard.writeText(`${window.location.origin}/join/your-slug`);
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "9px 12px",
            borderRadius: "7px",
            background: "rgba(232,0,29,0.1)",
            border: "1px solid rgba(232,0,29,0.2)",
            cursor: "pointer",
            color: "#E8001D",
            fontSize: "13px",
            fontFamily: "var(--font-urbanist, sans-serif)",
            width: "100%",
            margin: "8px 0 0 0",
          }}
        >
          <Link2 style={{ width: "15px", height: "15px" }} />
          <span style={{ fontWeight: 600 }}>Share Link</span>
        </button>
        <Link
          href="/dashboard/settings"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "9px 12px",
            borderRadius: "7px",
            textDecoration: "none",
            color: "#444444",
            fontSize: "13px",
            fontFamily: "var(--font-urbanist, sans-serif)",
            transition: "color 0.15s",
          }}
        >
          <Settings style={{ width: "15px", height: "15px" }} />
          <span>Settings</span>
        </Link>
        <button
          onClick={handleSignOut}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "9px 12px",
            borderRadius: "7px",
            background: "none",
            border: "none",
            cursor: "pointer",
            color: "#444444",
            fontSize: "13px",
            fontFamily: "var(--font-urbanist, sans-serif)",
            width: "100%",
            textAlign: "left",
            transition: "color 0.15s",
          }}
        >
          <LogOut style={{ width: "15px", height: "15px" }} />
          <span>Sign out</span>
        </button>
      </div>
    </aside>
  );
}