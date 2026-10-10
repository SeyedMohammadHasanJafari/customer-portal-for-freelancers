import { auth } from "@/auth";
import { Settings, CreditCard, Building, Check } from "lucide-react";

export default async function SettingsPage() {
  const session = await auth();
  const isDemo =
    session?.user?.email === "demo@luminaportal.com" ||
    (session?.user?.role === "DEMO" && session?.user?.email?.toLowerCase().includes("demo"));

  return (
    <div className="max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" />
          Workspace Settings
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Configure your agency branding, Stripe payout account, and client portal preferences.
        </p>
      </div>

      {isDemo && (
        <div className="p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/10 text-xs text-amber-600 dark:text-amber-400">
          <strong>Notice:</strong> Settings are simulated in Demo Mode to protect core portfolio configuration.
        </div>
      )}

      {/* Agency Profile */}
      <div className="glass-panel p-6 rounded-2xl border border-border/60 space-y-4">
        <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
          <Building className="w-4 h-4 text-primary" /> Agency & Freelancer Profile
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">Agency / Display Name</label>
            <input
              type="text"
              defaultValue={session?.user?.name || "Vance Creative & Engineering"}
              disabled={isDemo}
              className="w-full px-3 py-2 rounded-xl border border-border/70 bg-background/50 text-foreground"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">Contact Email</label>
            <input
              type="email"
              defaultValue={session?.user?.email || "alex@vancecreative.com"}
              disabled={isDemo}
              className="w-full px-3 py-2 rounded-xl border border-border/70 bg-background/50 text-foreground"
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">Default Currency</label>
            <select
              defaultValue="USD"
              disabled={isDemo}
              className="w-full px-3 py-2 rounded-xl border border-border/70 bg-background/50 text-foreground"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="font-semibold text-foreground">Client Portal Domain</label>
            <input
              type="text"
              defaultValue="portal.luminaportal.com"
              disabled
              className="w-full px-3 py-2 rounded-xl border border-border/70 bg-muted text-muted-foreground"
            />
          </div>
        </div>
      </div>

      {/* Stripe Connect Card */}
      <div className="glass-panel p-6 rounded-2xl border border-border/60 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-500" /> Stripe Payout Integration
          </h2>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
            Connected (Test Mode)
          </span>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          Your Stripe account is connected in Test Mode. Invoices paid by clients in their dedicated portal will automatically trigger webhooks and update invoice status to Paid.
        </p>

        <div className="p-3 rounded-xl bg-accent/40 border border-border/60 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground">
            <Check className="w-4 h-4 text-emerald-500" />
            acct_1N9xTestSandboxStripeAccount
          </div>
          <span className="text-[11px] font-semibold text-primary">Managed in Phase 5</span>
        </div>
      </div>
    </div>
  );
}
