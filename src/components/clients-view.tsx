"use client";

import * as React from "react";
import Link from "next/link";
import {
  Users,
  Search,
  Plus,
  Mail,
  Briefcase,
  ExternalLink,
  Loader2,
  CheckCircle2,
  X,
} from "lucide-react";
import { ClientWithRelations } from "@/lib/services/clients";

interface ClientsViewProps {
  initialClients: ClientWithRelations[];
}

export function ClientsView({ initialClients }: ClientsViewProps) {
  const [clients, setClients] = React.useState(initialClients);
  const [search, setSearch] = React.useState("");
  const [modalOpen, setModalOpen] = React.useState(false);
  const [newCompanyName, setNewCompanyName] = React.useState("");
  const [newEmail, setNewEmail] = React.useState("");
  const [newContactName, setNewContactName] = React.useState("");
  const [newPhone, setNewPhone] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);

  const filteredClients = clients.filter(
    (c) =>
      c.companyName?.toLowerCase().includes(search.toLowerCase()) ||
      (c.user?.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (c.user?.email || "").toLowerCase().includes(search.toLowerCase())
  );

  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch("/api/clients/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: newCompanyName,
          email: newEmail,
          contactName: newContactName,
          phone: newPhone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to add client.");
      }

      const newEntry = data.client || {
        id: `c-client-${Date.now()}`,
        companyName: newCompanyName,
        notes: "Direct active client",
        user: {
          name: newContactName || newCompanyName,
          email: newEmail,
        },
        projects: [],
        invoices: [],
      };

      setClients([newEntry, ...clients]);
      setSuccessMsg(`Client "${newCompanyName}" added successfully! Client is active.`);
      setTimeout(() => {
        setModalOpen(false);
        setSuccessMsg(null);
        setNewCompanyName("");
        setNewEmail("");
        setNewContactName("");
        setNewPhone("");
      }, 1200);
    } catch (err: unknown) {
      alert((err as Error).message || "An error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Clients
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Add and manage your client accounts, contact details, and dedicated portal access.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 w-fit cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add New Client
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search by company or contact name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-border/70 bg-card/60 text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all placeholder:text-muted-foreground/60"
        />
      </div>

      {/* Clients Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map((client) => {
          const projectCount = client.projects?.length || 0;
          const totalSpent = (client.invoices || []).reduce(
            (sum: number, inv: { amount?: number | null }) => sum + (inv.amount || 0),
            0
          );

          return (
            <div
              key={client.id}
              className="glass-panel p-5 rounded-2xl border border-border/60 hover:border-border hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                    {client.companyName ? client.companyName[0].toUpperCase() : "C"}
                  </div>
                  <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
                    Active Client
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-foreground">{client.companyName}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-1">
                    <Mail className="w-3.5 h-3.5" />
                    {client.user?.email || "No email linked"}
                  </p>
                  {client.user?.name && (
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Contact: {client.user.name}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-border/50 text-xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Briefcase className="w-3.5 h-3.5" /> {projectCount} Projects
                  </span>
                  <span className="font-semibold text-foreground">
                    ${totalSpent.toLocaleString()} Spent
                  </span>
                </div>

                <div className="pt-1 flex items-center justify-between">
                  <Link
                    href={`/portal/demo?client=${encodeURIComponent(client.companyName)}`}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-primary hover:underline"
                  >
                    View Client Portal <ExternalLink className="w-3 h-3" />
                  </Link>

                  <Link
                    href="/dashboard/projects/new"
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground"
                  >
                    + Assign Project
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Client Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
          <div className="glass-panel glow-border p-6 rounded-2xl w-full max-w-md shadow-2xl space-y-5 animate-in fade-in-50 zoom-in-95">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" />
                  Add New Client
                </h2>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="p-1 rounded-lg hover:bg-muted text-muted-foreground"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Directly add a client to your directory. No client invitation or acceptance required.
              </p>
            </div>

            {successMsg ? (
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{successMsg}</span>
              </div>
            ) : (
              <form onSubmit={handleAddClient} className="space-y-4 text-xs">
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Company / Organization Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Meridian Digital Labs"
                    value={newCompanyName}
                    onChange={(e) => setNewCompanyName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border/70 bg-background/50 text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Primary Contact Person Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Jordan Reed"
                    value={newContactName}
                    onChange={(e) => setNewContactName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border/70 bg-background/50 text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Client Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="client@company.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border/70 bg-background/50 text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground">Phone / WhatsApp (Optional)</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 019-2834"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border/70 bg-background/50 text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary"
                  />
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-3.5 py-2 rounded-xl border border-border/70 font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 shadow-md shadow-primary/20 disabled:opacity-70 cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving Client...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Save & Add Client</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
