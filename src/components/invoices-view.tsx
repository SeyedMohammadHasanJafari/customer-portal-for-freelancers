"use client";

import * as React from "react";
import Link from "next/link";
import {
  Receipt,
  Search,
  Plus,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { DashboardInvoiceItem } from "@/lib/services/dashboard";

export type InvoiceListItem = DashboardInvoiceItem;

interface InvoicesViewProps {
  initialInvoices: DashboardInvoiceItem[];
}

export function InvoicesView({ initialInvoices }: InvoicesViewProps) {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");

  const filteredInvoices = initialInvoices.filter((inv) => {
    const invNumber = inv.invoiceNumber || "";
    const matchesSearch =
      invNumber.toLowerCase().includes(search.toLowerCase()) ||
      (inv.client?.companyName || "").toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || inv.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalBilled = initialInvoices.reduce(
    (sum, inv) => sum + (inv.amount || 0),
    0
  );
  const paidTotal = initialInvoices
    .filter((inv) => inv.status === "PAID")
    .reduce((sum, inv) => sum + (inv.amount || 0), 0);
  const pendingTotal = initialInvoices
    .filter((inv) => inv.status === "PENDING" || inv.status === "OVERDUE")
    .reduce((sum, inv) => sum + (inv.amount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Receipt className="w-5 h-5 text-emerald-500" />
            Invoices & Payments
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Track client billing, outstanding receivables, and Stripe settlement statuses.
          </p>
        </div>

        <Link
          href="/dashboard/invoices/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 w-fit cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Issue New Invoice
        </Link>
      </div>

      {/* Mini Stat Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="glass-panel p-4 rounded-xl border border-border/60">
          <span className="text-muted-foreground text-[11px]">Total Invoiced</span>
          <p className="text-lg font-bold text-foreground mt-0.5">
            ${totalBilled.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-border/60">
          <span className="text-muted-foreground text-[11px]">Collected via Stripe</span>
          <p className="text-lg font-bold text-emerald-500 mt-0.5">
            ${paidTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-border/60">
          <span className="text-muted-foreground text-[11px]">Pending / Overdue</span>
          <p className="text-lg font-bold text-amber-500 mt-0.5">
            ${pendingTotal.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>

      {/* Search & Status Filter */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by invoice number or client name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-border/70 bg-card/60 text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all placeholder:text-muted-foreground/60"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          {["ALL", "PAID", "PENDING", "OVERDUE"].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={cn(
                "px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer text-xs",
                statusFilter === st
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "border border-border/70 bg-card/50 text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices Table / Card List */}
      <div className="glass-panel rounded-2xl border border-border/60 overflow-hidden">
        {filteredInvoices.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-muted/60 border border-border/70 flex items-center justify-center mx-auto text-muted-foreground">
              <Receipt className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">No invoices found</h3>
              <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                {search || statusFilter !== "ALL"
                  ? "No invoices match your current filter or search criteria."
                  : "You haven't issued any invoices yet. Create an invoice to bill your clients via Stripe."}
              </p>
            </div>
            <Link
              href="/dashboard/invoices/new"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20"
            >
              <Plus className="w-4 h-4" />
              Issue New Invoice
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border/50">
            {filteredInvoices.map((inv) => {
              const isPaid = inv.status === "PAID";
              const isOverdue = inv.status === "OVERDUE";

            return (
              <div
                key={inv.id}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/30 transition-colors text-xs"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isPaid
                        ? "bg-emerald-500/10 text-emerald-500"
                        : isOverdue
                        ? "bg-destructive/10 text-destructive"
                        : "bg-amber-500/10 text-amber-500"
                    }`}
                  >
                    <Receipt className="w-4 h-4" />
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
                      Client: <strong>{inv.client?.companyName || "Client"}</strong> • Project:{" "}
                      {inv.project?.title || "Contract milestone"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-5">
                  <div className="text-left sm:text-right">
                    <span className="font-bold text-sm text-foreground block">
                      ${inv.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}{" "}
                      {inv.currency || "USD"}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {isPaid && inv.paidAt
                        ? `Paid on ${new Date(inv.paidAt).toLocaleDateString()}`
                        : inv.dueDate
                        ? `Due: ${new Date(inv.dueDate).toLocaleDateString()}`
                        : "Due upon receipt"}
                    </span>
                  </div>

                  <Link
                    href="/portal/demo"
                    className="p-2 rounded-lg border border-border/70 hover:bg-muted text-primary"
                    title="Client Checkout Preview"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
        )}
      </div>
    </div>
  );
}
