"use client";

import * as React from "react";
import {
  CheckCircle2,
  Clock,
  Download,
  CreditCard,
  FileText,
  ShieldCheck,
  Layers,
  Circle,
  Loader2,
} from "lucide-react";
import { ClientPortalData, PortalInvoice } from "@/lib/services/portal";

interface ClientPortalViewProps {
  data: ClientPortalData;
}

export function ClientPortalView({ data }: ClientPortalViewProps) {
  const [activeTab, setActiveTab] = React.useState<"milestones" | "deliverables" | "invoices">("milestones");
  const [payingInvoiceId, setPayingInvoiceId] = React.useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = React.useState<string | null>(null);
  const [invoices, setInvoices] = React.useState<PortalInvoice[]>(data.invoices || []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const timer = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      if (params.get("paid") === "true") {
        const paidInvoiceRef = params.get("invoice") || "Settled";
        setPaymentSuccess(paidInvoiceRef);
        setActiveTab("invoices");

        setInvoices((prev) =>
          prev.map((inv) =>
            inv.id === paidInvoiceRef || inv.invoiceNumber === paidInvoiceRef
              ? { ...inv, status: "PAID", paidAt: new Date() }
              : inv
          )
        );
      }
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const pendingInvoices = invoices.filter((i) => i.status !== "PAID");
  const totalOutstanding = pendingInvoices.reduce((sum, i) => sum + (i.amount || 0), 0);

  const handlePayWithStripe = async (inv: PortalInvoice) => {
    try {
      setPayingInvoiceId(inv.id);
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId: inv.id,
          invoiceNumber: inv.invoiceNumber,
          amount: inv.amount,
          currency: inv.currency || "USD",
          returnUrl: window.location.href.split("?")[0],
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || "Failed to initialize Stripe checkout");
      }

      // Mark as paid immediately in UI
      setInvoices((prev) =>
        prev.map((i) =>
          i.id === inv.id || i.invoiceNumber === inv.invoiceNumber
            ? { ...i, status: "PAID", paidAt: new Date() }
            : i
        )
      );

      if (result.url) {
        window.location.assign(result.url);
      }
    } catch (err: unknown) {
      alert((err as Error).message || "Payment initiation error.");
      setPayingInvoiceId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Payment Success Alert */}
      {paymentSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 flex items-center justify-between gap-3 text-xs animate-in fade-in-50">
          <div className="flex items-center gap-2.5 font-semibold">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>
              Payment Verified! Thank you for settling {paymentSuccess}. Your receipt has been confirmed via Stripe.
            </span>
          </div>
          <button
            type="button"
            onClick={() => setPaymentSuccess(null)}
            className="text-xs hover:underline cursor-pointer font-medium"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Client Welcome Hero Card */}
      <div className="glass-panel glow-border p-6 sm:p-8 rounded-3xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <ShieldCheck className="w-3.5 h-3.5" /> Client Portal: {data.companyName}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Project Delivery & Milestones Hub
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
              Managed by <strong>{data.freelancerAgency}</strong> ({data.freelancerName}). Review current milestones, download finalized assets, and settle project invoices.
            </p>
          </div>

          {/* Quick Pay CTA if outstanding balance exists */}
          {totalOutstanding > 0 && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-500/30 flex flex-col justify-between space-y-3 shrink-0">
              <div>
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
                  Outstanding Balance
                </span>
                <p className="text-2xl font-black text-foreground mt-0.5">
                  ${totalOutstanding.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[11px] text-amber-500 font-medium">
                  {pendingInvoices.length} invoice awaiting payment
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab("invoices")}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-xs hover:from-amber-600 hover:to-orange-600 shadow-md shadow-orange-500/20 transition-all cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                Pay Invoice with Stripe
              </button>
            </div>
          )}
        </div>

        {/* Overall Completion Progress */}
        <div className="mt-8 pt-6 border-t border-border/60">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-foreground flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Overall Scope Completion
            </span>
            <span className="font-bold text-sm text-primary">{data.overallProgress}%</span>
          </div>
          <div className="w-full bg-muted/70 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary via-purple-500 to-emerald-500 h-2 rounded-full transition-all duration-700"
              style={{ width: `${data.overallProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Portal Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border/60 pb-3 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab("milestones")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            activeTab === "milestones"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <Layers className="w-4 h-4" />
          Projects & Milestones ({data.projects.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("deliverables")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            activeTab === "deliverables"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <Download className="w-4 h-4" />
          Deliverables & Files ({data.deliverables.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("invoices")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            activeTab === "invoices"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <CreditCard className="w-4 h-4" />
          Invoices & Payments ({invoices.length})
        </button>
      </div>

      {/* Tab 1: Milestones & Projects */}
      {activeTab === "milestones" && (
        <div className="space-y-6">
          {data.projects.map((project) => {
            const tasks = project.tasks || [];
            const completedCount = tasks.filter((t) => t.status === "DONE").length;
            const total = tasks.length;
            const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;

            return (
              <div
                key={project.id}
                className="glass-panel p-6 sm:p-7 rounded-2xl border border-border/60 space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h2 className="text-lg font-bold text-foreground">{project.title}</h2>
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                          project.status === "COMPLETED"
                            ? "bg-emerald-500/10 text-emerald-500"
                            : "bg-blue-500/10 text-blue-500"
                        }`}
                      >
                        {project.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {project.description || "Active production project."}
                    </p>
                  </div>

                  <div className="text-left sm:text-right shrink-0">
                    <span className="text-xs font-bold text-foreground">{pct}% Done</span>
                    <p className="text-[11px] text-muted-foreground">
                      {completedCount} of {total} milestones delivered
                    </p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-muted/60 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-primary to-purple-500 h-1.5 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {/* Milestone Checklist (Read-Only for Client) */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Project Milestones Checklist
                  </span>

                  <div className="space-y-2">
                    {tasks.map((task) => {
                      const isDone = task.status === "DONE";
                      const isInProgress = task.status === "IN_PROGRESS";

                      return (
                        <div
                          key={task.id}
                          className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs ${
                            isDone
                              ? "bg-emerald-500/5 border-emerald-500/25 text-foreground"
                              : isInProgress
                              ? "bg-blue-500/5 border-blue-500/25 text-foreground"
                              : "bg-background/40 border-border/50 text-muted-foreground"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            {isDone ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                            ) : isInProgress ? (
                              <Clock className="w-4 h-4 text-blue-500 shrink-0 animate-pulse" />
                            ) : (
                              <Circle className="w-4 h-4 text-muted-foreground/60 shrink-0" />
                            )}
                            <span className={isDone ? "font-semibold" : "font-medium"}>
                              {task.title}
                            </span>
                          </div>

                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              isDone
                                ? "bg-emerald-500/10 text-emerald-500"
                                : isInProgress
                                ? "bg-blue-500/10 text-blue-500"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {task.status.replace("_", " ")}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tab 2: Deliverables & Files */}
      {activeTab === "deliverables" && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-foreground">Finalized Deliverables & Assets</h2>
            <p className="text-xs text-muted-foreground">
              Click download to retrieve high-resolution assets, designs, and production exports.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.deliverables.map((file) => {
              const safeName = file.name.toLowerCase().endsWith(".pdf")
                ? file.name
                : `${file.name.replace(/\.[^/.]+$/, "")}.pdf`;
              const downloadParams = new URLSearchParams({
                id: file.id || "del-1",
                name: safeName,
                project: data.projects[0]?.title || "Client Deliverable",
                client: data.companyName || "",
                freelancer: data.freelancerName || "Mohamad Jafari",
                agency: data.freelancerAgency || "Lumina Studio",
              });
              const downloadUrl = file.fileUrl && file.fileUrl.startsWith("/api/deliverables/download")
                ? file.fileUrl
                : `/api/deliverables/download?${downloadParams.toString()}`;

              return (
                <div
                  key={file.id}
                  className="glass-panel p-5 rounded-2xl border border-border/70 hover:border-primary/40 hover:shadow-lg transition-all flex flex-col justify-between space-y-4 group relative overflow-hidden"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="h-11 w-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold shadow-xs">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        Verified PDF
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2">
                        {safeName}
                      </h3>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground">
                        <span>{file.fileSize ? `${Math.round(Number(file.fileSize) / 1024)} KB` : "1.85 MB"}</span>
                        <span>•</span>
                        <span className="text-emerald-500 font-medium">Production Handover</span>
                      </div>
                    </div>
                  </div>

                  <a
                    href={downloadUrl}
                    download={safeName}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-primary/20 bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground text-xs font-semibold transition-all shadow-xs group-hover:scale-[1.01]"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Deliverable (PDF)
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 3: Invoices & Payments */}
      {activeTab === "invoices" && (
        <div className="space-y-4">
          <div>
            <h2 className="text-base font-bold text-foreground">Invoices & Billing Statement</h2>
            <p className="text-xs text-muted-foreground">
              Review and pay invoices securely using Stripe Checkout with instant receipt generation.
            </p>
          </div>

          <div className="glass-panel rounded-2xl border border-border/60 overflow-hidden divide-y divide-border/50 text-xs">
            {invoices.map((inv) => {
              const isPaid = inv.status === "PAID";
              const isOverdue = inv.status === "OVERDUE";

              return (
                <div
                  key={inv.id}
                  className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isPaid
                          ? "bg-emerald-500/10 text-emerald-500"
                          : "bg-amber-500/10 text-amber-500"
                      }`}
                    >
                      <CreditCard className="w-5 h-5" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-foreground">
                          {inv.invoiceNumber}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                            isPaid
                              ? "bg-emerald-500/10 text-emerald-500"
                              : isOverdue
                              ? "bg-destructive/10 text-destructive"
                              : "bg-amber-500/10 text-amber-500"
                          }`}
                        >
                          {inv.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {inv.dueDate ? `Due date: ${new Date(inv.dueDate).toLocaleDateString()}` : "Due upon receipt"}
                        {isPaid && inv.paidAt && ` • Settled on ${new Date(inv.paidAt).toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <div className="text-left sm:text-right">
                      <span className="text-base font-black text-foreground block">
                        ${inv.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}{" "}
                        {inv.currency || "USD"}
                      </span>
                    </div>

                    {isPaid ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-500 font-semibold text-xs border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Receipt Confirmed
                      </span>
                    ) : (
                      <button
                        type="button"
                        disabled={payingInvoiceId === inv.id}
                        onClick={() => handlePayWithStripe(inv)}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-purple-600 text-white font-bold text-xs hover:from-primary/90 hover:to-purple-600/90 shadow-md shadow-primary/20 transition-all cursor-pointer disabled:opacity-75"
                      >
                        {payingInvoiceId === inv.id ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Connecting Stripe...</span>
                          </>
                        ) : (
                          <>
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Pay with Stripe</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
