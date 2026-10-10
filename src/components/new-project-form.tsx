"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createProjectAction } from "@/lib/actions/projects";
import {
  FolderPlus,
  ArrowLeft,
  Loader2,
  DollarSign,
  Calendar,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface NewProjectFormProps {
  clients: Array<{ id: string; companyName: string; user?: { name?: string | null } | null }>;
}

export function NewProjectForm({ clients }: NewProjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);

    try {
      await createProjectAction(formData);
      setSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/projects");
        router.refresh();
      }, 800);
    } catch (err: unknown) {
      setError((err as Error).message || "Failed to create project.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/projects"
          className="p-2 rounded-xl border border-border/70 hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-primary" />
            Create New Project
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Set up deliverables, budget, and assign a client to track progress.
          </p>
        </div>
      </div>

      <div className="glass-panel glow-border p-6 sm:p-8 rounded-2xl shadow-xl space-y-6">
        {error && (
          <div className="p-3.5 rounded-xl bg-destructive/10 border border-destructive/30 flex items-center gap-2 text-xs text-destructive">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-xs text-emerald-500">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Project created successfully! Redirecting...</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Project Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Project Title *</label>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g. Next.js SaaS Platform Redesign"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border/70 bg-background/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all placeholder:text-muted-foreground/60"
            />
          </div>

          {/* Client Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground flex items-center justify-between">
              <span>Assign Client *</span>
              <Link
                href="/dashboard/clients"
                className="text-[11px] font-semibold text-primary hover:underline"
              >
                + Manage Clients
              </Link>
            </label>
            <div className="relative">
              <select
                name="clientId"
                required
                defaultValue={clients[0]?.id || ""}
                className="w-full px-3.5 py-2.5 rounded-xl border border-border/70 bg-background/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all cursor-pointer"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id} className="bg-background text-foreground">
                    {c.companyName} {c.user?.name ? `(${c.user.name})` : ""}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Budget & Timeline (2 cols) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Total Budget (USD)</label>
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="number"
                  name="budget"
                  min="0"
                  step="50"
                  placeholder="5000"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-border/70 bg-background/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all placeholder:text-muted-foreground/60"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Estimated Timeline</label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  name="timeline"
                  placeholder="e.g. 4 Weeks"
                  className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-border/70 bg-background/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all placeholder:text-muted-foreground/60"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Scope & Description</label>
            <textarea
              name="description"
              rows={3}
              placeholder="Outline high-level goals and client requirements..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-border/70 bg-background/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all placeholder:text-muted-foreground/60 resize-none"
            />
          </div>

          {/* Initial Milestones / Tasks */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">
              Initial Milestones / Tasks (One per line)
            </label>
            <textarea
              name="tasks"
              rows={3}
              placeholder={"1. Discovery & Design System\n2. Next.js Architecture\n3. Stripe Payment Gateway Setup"}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border/70 bg-background/50 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all placeholder:text-muted-foreground/60 resize-none font-mono text-xs"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-border/60">
            <Link
              href="/dashboard/projects"
              className="px-4 py-2.5 rounded-xl border border-border/70 text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-all"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Creating Project...</span>
                </>
              ) : (
                <span>Publish Project</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
