"use client";

import * as React from "react";
import Link from "next/link";
import {
  FolderKanban,
  Search,
  Plus,
  Briefcase,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ProjectWithDetails } from "@/lib/services/projects";

interface ProjectsViewProps {
  initialProjects: ProjectWithDetails[];
}

export function ProjectsView({ initialProjects }: ProjectsViewProps) {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");

  const filteredProjects = initialProjects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.client?.companyName || "").toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "ALL" || p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalValue = initialProjects.reduce(
    (sum, p) => sum + (p.budget || 0),
    0
  );
  const inProgressCount = initialProjects.filter(
    (p) => p.status === "IN_PROGRESS"
  ).length;
  const completedCount = initialProjects.filter(
    (p) => p.status === "COMPLETED"
  ).length;

  return (
    <div className="space-y-6">
      {/* Top Header & New Project CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <FolderKanban className="w-5 h-5 text-primary" />
            Projects
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your client deliverables, progress milestones, and scope.
          </p>
        </div>

        <Link
          href="/dashboard/projects/new"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 w-fit"
        >
          <Plus className="w-4 h-4" />
          Create New Project
        </Link>
      </div>

      {/* Mini Stat Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="glass-panel p-3.5 rounded-xl border border-border/60">
          <span className="text-muted-foreground text-[11px]">Total Projects</span>
          <p className="text-lg font-bold text-foreground mt-0.5">{initialProjects.length}</p>
        </div>
        <div className="glass-panel p-3.5 rounded-xl border border-border/60">
          <span className="text-muted-foreground text-[11px]">In Progress</span>
          <p className="text-lg font-bold text-blue-500 mt-0.5">{inProgressCount}</p>
        </div>
        <div className="glass-panel p-3.5 rounded-xl border border-border/60">
          <span className="text-muted-foreground text-[11px]">Completed</span>
          <p className="text-lg font-bold text-emerald-500 mt-0.5">{completedCount}</p>
        </div>
        <div className="glass-panel p-3.5 rounded-xl border border-border/60">
          <span className="text-muted-foreground text-[11px]">Pipeline Value</span>
          <p className="text-lg font-bold text-foreground mt-0.5">
            ${totalValue.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search projects or clients..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-border/70 bg-card/60 text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all placeholder:text-muted-foreground/60"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          {["ALL", "IN_PROGRESS", "PLANNING", "COMPLETED", "ON_HOLD"].map(
            (status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={cn(
                  "px-3 py-1.5 rounded-lg font-semibold transition-all whitespace-nowrap cursor-pointer text-xs",
                  statusFilter === status
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "border border-border/70 bg-card/50 text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}
              >
                {status.replace("_", " ")}
              </button>
            )
          )}
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl text-center space-y-3">
          <FolderKanban className="w-10 h-10 text-muted-foreground mx-auto" />
          <h3 className="text-sm font-semibold text-foreground">No projects found</h3>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            {search
              ? "Try adjusting your search criteria."
              : "Start by creating your first client project to track tasks and deliver files."}
          </p>
          <Link
            href="/dashboard/projects/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold"
          >
            <Plus className="w-3.5 h-3.5" /> Create Project
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredProjects.map((p) => {
            const tasks = p.tasks || [];
            const completed = tasks.filter((t) => t.status === "DONE").length;
            const total = tasks.length;
            const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

            return (
              <div
                key={p.id}
                className="glass-panel p-5 rounded-2xl border border-border/60 hover:border-border hover:shadow-lg transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        p.status === "COMPLETED"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : p.status === "IN_PROGRESS"
                          ? "bg-blue-500/10 text-blue-500"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {p.status.replace("_", " ")}
                    </span>
                    {p.budget && (
                      <span className="font-bold text-sm text-foreground">
                        ${p.budget.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <div>
                    <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                      {p.description || "No project description provided."}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-border/50">
                  {/* Progress & Milestone */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between text-muted-foreground">
                      <span className="text-[11px]">Milestones</span>
                      <span className="font-semibold text-foreground">
                        {completed}/{total} ({progress}%)
                      </span>
                    </div>
                    <div className="w-full bg-muted/60 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-primary to-purple-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Footer Client & Link */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1 font-medium">
                      <Briefcase className="w-3 h-3 text-primary" />
                      {p.client?.companyName || "Client"}
                    </span>

                    <Link
                      href={`/dashboard/projects/${p.id}`}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                    >
                      Manage <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
