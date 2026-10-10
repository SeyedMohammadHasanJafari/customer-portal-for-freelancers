"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createInvoiceAction } from "@/lib/actions/invoices";
import {
  Receipt,
  ArrowLeft,
  DollarSign,
  Calendar,
  Briefcase,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export interface ProjectOption {
  id: string;
  title: string;
  budget?: number | null;
  currency?: string;
  client?: { companyName: string } | null;
  invoices?: Array<{ amount?: number | null }>;
}

interface NewInvoiceFormProps {
  projects: ProjectOption[];
}

export function NewInvoiceForm({ projects }: NewInvoiceFormProps) {
  const router = useRouter();
  const [selectedProjectId, setSelectedProjectId] = React.useState(projects[0]?.id || "");
  const [amount, setAmount] = React.useState("");
  const [dueDate, setDueDate] = React.useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().split("T")[0];
  });
  const [currency, setCurrency] = React.useState("USD");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const totalBudget = selectedProject?.budget || 0;
  const alreadyInvoiced = (selectedProject?.invoices || []).reduce(
    (sum: number, inv: { amount?: number | null }) => sum + (inv.amount || 0),
    0
  );
  const remainingBudget = totalBudget > 0 ? Math.max(0, totalBudget - alreadyInvoiced) : null;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const parsedAmount = parseFloat(amount || "0");
    if (parsedAmount <= 0) {
      setError("Please enter a valid amount greater than $0.");
      setLoading(false);
      return;
    }

    if (remainingBudget !== null && parsedAmount > remainingBudget) {
      setError(
        `Invoice amount ($${parsedAmount.toLocaleString()} USD) exceeds the remaining budget of this project ($${remainingBudget.toLocaleString()} USD). Total project budget is $${totalBudget.toLocaleString()} USD.`
      );
      setLoading(false);
      return;
    }

    const formData = new FormData(e.currentTarget);

    try {
      await createInvoiceAction(formData);
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/invoices");
        router.refresh();
      }, 1000);
    } catch (err: unknown) {
      setError((err as Error).message || "Failed to create invoice.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/invoices"
          className="p-2 rounded-xl border border-border/70 hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-500" />
            Issue New Invoice
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Bill your client for delivered project milestones via Stripe Checkout.
          </p>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="glass-panel p-10 rounded-2xl text-center space-y-4 border border-border/70">
          <Briefcase className="w-10 h-10 text-muted-foreground mx-auto" />
          <h2 className="text-base font-bold text-foreground">No projects available</h2>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Invoices must be associated with a client project. Please create a project first before generating an invoice.
          </p>
          <Link
            href="/dashboard/projects/new"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
          >
            Create New Project
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Column (2 cols) */}
          <div className="lg:col-span-2 glass-panel glow-border p-6 rounded-2xl shadow-xl space-y-5">
            {error && (
              <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/30 flex items-center gap-2 text-xs text-destructive">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

          {success && (
            <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-500">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Invoice issued successfully! Redirecting...</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Project Select */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Select Project *</label>
              <select
                name="projectId"
                required
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border/70 bg-background/50 text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary cursor-pointer"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id} className="bg-background text-foreground">
                    {p.title} ({p.client?.companyName || "Client"})
                  </option>
                ))}
              </select>
            </div>

            {/* Amount & Currency */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label className="font-semibold text-foreground">Invoice Amount *</label>
                  {totalBudget > 0 && (
                    <span className="text-[11px] text-muted-foreground">
                      Remaining Budget:{" "}
                      <strong
                        className={
                          remainingBudget && remainingBudget > 0
                            ? "text-emerald-500 font-bold"
                            : "text-destructive font-bold"
                        }
                      >
                        ${remainingBudget?.toLocaleString("en-US", { minimumFractionDigits: 2 })}{" "}
                        {currency}
                      </strong>
                    </span>
                  )}
                </div>
                <div className="relative">
                  <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="number"
                    name="amount"
                    required
                    min="1"
                    max={remainingBudget !== null ? remainingBudget : undefined}
                    step="0.01"
                    placeholder={remainingBudget ? String(remainingBudget) : "3500"}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-border/70 bg-background/50 text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Currency</label>
                <select
                  name="currency"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-border/70 bg-background/50 text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>

            {/* Due Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Payment Due Date</label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="date"
                  name="dueDate"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-border/70 bg-background/50 text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/60">
              <Link
                href="/dashboard/invoices"
                className="px-4 py-2 rounded-xl border border-border/70 text-xs font-semibold text-muted-foreground hover:text-foreground"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 shadow-md shadow-primary/20 disabled:opacity-70 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Issuing Invoice...</span>
                  </>
                ) : (
                  <span>Publish Invoice & Generate Stripe Link</span>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Live Invoice Preview Column (1 col) */}
        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Client View Preview
          </span>

          <div className="glass-panel p-5 rounded-2xl border border-border/60 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Invoice</span>
                <p className="font-bold text-sm text-foreground">INV-2026-PREVIEW</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500">
                PENDING
              </span>
            </div>

            <div className="space-y-1 text-xs border-t border-b border-border/50 py-3">
              <p className="text-muted-foreground">
                Billed To: <strong className="text-foreground">{selectedProject?.client?.companyName || "Client"}</strong>
              </p>
              <p className="text-muted-foreground">
                Project: <strong className="text-foreground">{selectedProject?.title || "Contract"}</strong>
              </p>
              <p className="text-muted-foreground">
                Due Date: <strong className="text-foreground">{dueDate || "Upon Receipt"}</strong>
              </p>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-muted-foreground">Total Due:</span>
              <span className="text-lg font-black text-foreground">
                ${amount ? parseFloat(amount).toLocaleString("en-US", { minimumFractionDigits: 2 }) : "0.00"}{" "}
                {currency}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-muted/40 text-[11px] text-muted-foreground text-center">
              A Stripe Checkout button will be embedded into the client portal.
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}
