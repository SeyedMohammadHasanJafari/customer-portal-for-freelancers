"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sparkles,
  LayoutDashboard,
  FolderKanban,
  Users,
  Receipt,
  Settings,
  ShieldAlert,
  ExternalLink,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DashboardSidebarProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string | null;
    isDemo?: boolean;
  };
}

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const isDemo = user.role === "DEMO" || user.isDemo;

  const navLinks = [
    {
      label: "Overview",
      href: "/dashboard",
      icon: LayoutDashboard,
      active: pathname === "/dashboard",
    },
    {
      label: "Projects",
      href: "/dashboard/projects",
      icon: FolderKanban,
      active: pathname.startsWith("/dashboard/projects"),
    },
    {
      label: "Clients",
      href: "/dashboard/clients",
      icon: Users,
      active: pathname.startsWith("/dashboard/clients"),
    },
    {
      label: "Invoices",
      href: "/dashboard/invoices",
      icon: Receipt,
      active: pathname.startsWith("/dashboard/invoices"),
    },
    {
      label: "Settings",
      href: "/dashboard/settings",
      icon: Settings,
      active: pathname.startsWith("/dashboard/settings"),
    },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="lg:hidden fixed top-3 left-4 z-50">
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-xl border border-border/80 bg-background/90 backdrop-blur-md text-foreground shadow-sm"
          aria-label="Toggle navigation menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Backdrop for mobile */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed top-0 bottom-0 left-0 z-40 w-64 border-r border-border/60 bg-card/60 backdrop-blur-xl flex flex-col justify-between transition-transform duration-300 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="p-5 space-y-6">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center shadow-md shadow-primary/20 text-white font-bold">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text">
                Lumina Portal
              </span>
              <span className="block text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                Freelancer Suite
              </span>
            </div>
          </div>

          {/* Demo Mode Badge */}
          {isDemo && (
            <div className="p-3 rounded-xl border border-amber-500/30 bg-amber-500/10 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-amber-500">
                <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                <span>Demo Mode Active</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-tight">
                Simulated workspace with live analytics and pre-loaded client projects.
              </p>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group",
                    item.active
                      ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  <ChevronRight
                    className={cn(
                      "w-3 h-3 transition-transform",
                      item.active ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    )}
                  />
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Client Portal Preview Card in Sidebar Footer */}
        <div className="p-5 border-t border-border/50 space-y-3">
          <div className="p-3 rounded-xl bg-accent/40 border border-border/60 text-xs space-y-1.5">
            <span className="font-semibold text-foreground flex items-center justify-between">
              Client Portal View
              <ExternalLink className="w-3 h-3 text-muted-foreground" />
            </span>
            <p className="text-[11px] text-muted-foreground">
              Preview what your clients see on their white-labeled portal.
            </p>
            <Link
              href="/portal/demo"
              className="inline-block text-[11px] font-bold text-primary hover:underline pt-0.5"
            >
              Open Client Preview →
            </Link>
          </div>

          <div className="text-[11px] text-muted-foreground flex items-center justify-between px-1">
            <span>© {new Date().getFullYear()} Lumina SaaS</span>
            <span className="text-[10px] font-mono opacity-70">v1.0-prod</span>
          </div>
        </div>
      </aside>
    </>
  );
}
