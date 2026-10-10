"use client";

import * as React from "react";
import { signOut } from "next-auth/react";
import { ThemeToggle } from "@/components/theme-toggle";
import { LogOut, User, Bell } from "lucide-react";

interface DashboardTopNavProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string | null;
    isDemo?: boolean;
    image?: string | null;
  };
}

export function DashboardTopNav({ user }: DashboardTopNavProps) {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3 pl-12 lg:pl-0">
          <span className="text-xs font-medium px-2.5 py-1 rounded-lg bg-muted text-muted-foreground">
            Workspace: <strong className="text-foreground">{user.name || "Freelancer"}</strong>
          </span>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <button
            type="button"
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
          </button>

          {/* User profile & sign-out */}
          <div className="flex items-center gap-2.5 pl-3 border-l border-border/60">
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
  );
}
