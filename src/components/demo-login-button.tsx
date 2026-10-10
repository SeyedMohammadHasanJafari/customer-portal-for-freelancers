"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Zap, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface DemoLoginButtonProps {
  className?: string;
  variant?: "primary" | "outline";
  text?: string;
}

export function DemoLoginButton({
  className,
  variant = "primary",
  text = "Try Demo Account (Instant)",
}: DemoLoginButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleDemoLogin = async () => {
    try {
      setLoading(true);
      setError(null);

      // Seed/ensure demo data in database
      const res = await fetch("/api/auth/demo", { method: "POST" });
      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to initialize demo account.");
      }

      // Log in with the pre-seeded credentials
      const signInResult = await signIn("credentials", {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (signInResult?.error) {
        setError("Sign-in failed. Please try again.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: unknown) {
      console.error("Demo login error:", err);
      setError((err as Error).message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-1.5 w-full">
      <button
        type="button"
        onClick={handleDemoLogin}
        disabled={loading}
        className={cn(
          "w-full relative flex items-center justify-center gap-2.5 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer shadow-xs disabled:opacity-70 disabled:cursor-not-allowed",
          variant === "primary"
            ? "bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white shadow-md shadow-orange-500/20 active:scale-[0.99]"
            : "border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/15 text-foreground hover:border-amber-500/60",
          className
        )}
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin text-white" />
            <span>Setting up Demo Workspace...</span>
          </>
        ) : (
          <>
            <Zap className="w-4 h-4 fill-white text-white drop-shadow-sm" />
            <span>{text}</span>
          </>
        )}
      </button>
      {error && <span className="text-[11px] text-destructive text-center">{error}</span>}
    </div>
  );
}
