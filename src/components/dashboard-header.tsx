"use client";

import * as React from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { ThemeToggle } from "@/components/theme-toggle";
import {
  Sparkles,
  LogOut,
  User,
  ShieldAlert,
  LayoutDashboard,
  FolderKanban,
  Receipt,
  Users,
} from "lucide-react";

interface DashboardHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string | null;
    isDemo?: boolean;
    image?: string | null;
  };
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const isDemo = user.role === "DEMO" || user.isDemo;

  return (
    <>
      {/* Demo Mode Notification Banner if applicable */}
      {isDemo && (
        <div className="bg-gradient-to-r from-amber-500/15 via-orange-500/15 to-amber-500/15 border-b border-amber-500/30 px-4 py-2 text-xs">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-medium">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>
                <strong>Demo Mode Active:</strong> You are exploring Lumina Portal with simulated data. System settings are protected.
              </span>
            </div>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-semibold border border-amber-500/30">
              Portfolio Preview
            </span>
          </div>
        </div>
      )}

      {/* Main Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary to-purple-600 flex items-center justify-center shadow-md shadow-primary/20 text-white font-bold">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text">
                  Lumina Portal
                </span>
                {isDemo && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
                    Demo Mode
                  </span>
                )}
              </div>
            </Link>

            {/* Navigation tabs */}
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-foreground bg-accent/60 text-xs font-semibold"
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-primary" />
                Overview
              </Link>
              <Link
                href="/dashboard/projects"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 text-xs transition-colors"
              >
                <FolderKanban className="w-3.5 h-3.5" />
                Projects
              </Link>
              <Link
                href="/dashboard/clients"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 text-xs transition-colors"
              >
                <Users className="w-3.5 h-3.5" />
                Clients
              </Link>
              <Link
                href="/dashboard/invoices"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 text-xs transition-colors"
              >
                <Receipt className="w-3.5 h-3.5" />
                Invoices
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            {/* User Profile and Sign Out */}
            <div className="flex items-center gap-3 pl-3 border-l border-border/60">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-foreground leading-tight">
                  {user.name || "Freelancer"}
                </span>
                <span className="text-[11px] text-muted-foreground leading-tight">
                  {user.email}
                </span>
              </div>

              <div className="h-8 w-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                {user.name ? user.name[0].toUpperCase() : <User className="w-4 h-4" />}
              </div>

              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
