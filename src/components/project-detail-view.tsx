"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  DollarSign,
  CheckCircle2,
  Clock,
  FileText,
  Download,
  Trash2,
  CheckSquare,
  Square,
  Loader2,
  ExternalLink,
} from "lucide-react";
import {
  updateProjectStatusAction,
  toggleTaskStatusAction,
  deleteProjectAction,
} from "@/lib/actions/projects";
import { ProjectWithDetails } from "@/lib/services/projects";

interface ProjectDetailViewProps {
  project: ProjectWithDetails;
}

export function ProjectDetailView({ project: initialProject }: ProjectDetailViewProps) {
  const router = useRouter();
  const [project, setProject] = React.useState<ProjectWithDetails>(initialProject);
  const [statusLoading, setStatusLoading] = React.useState(false);
  const [taskTogglingId, setTaskTogglingId] = React.useState<string | null>(null);

  const tasks = project.tasks || [];
  const completedTasks = tasks.filter((t) => t.status === "DONE").length;
  const totalTasks = tasks.length;
  const progressPct =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleStatusChange = async (newStatus: "PLANNING" | "IN_PROGRESS" | "COMPLETED" | "ON_HOLD") => {
    try {
      setStatusLoading(true);
      await updateProjectStatusAction(project.id, newStatus);
      setProject({ ...project, status: newStatus });
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setStatusLoading(false);
    }
  };

  const handleToggleTask = async (taskId: string, currentStatus: string) => {
    try {
      setTaskTogglingId(taskId);
      const res = await toggleTaskStatusAction(taskId, currentStatus, project.id);
      const nextStatus = res.status;

      setProject({
        ...project,
        tasks: (project.tasks || []).map((t) =>
          t.id === taskId ? { ...t, status: nextStatus } : t
        ),
      });
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setTaskTogglingId(null);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await deleteProjectAction(project.id);
      router.push("/dashboard/projects");
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/projects"
            className="p-2 rounded-xl border border-border/70 hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {project.title}
              </h1>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Client: <strong>{project.client?.companyName || "Client"}</strong> • Timeline:{" "}
              {project.timeline || "In progress"}
            </p>
          </div>
        </div>

        {/* Status Dropdown & Delete */}
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium">Status:</span>
            <select
              value={project.status}
              disabled={statusLoading}
              onChange={(e) =>
                handleStatusChange(
                  e.target.value as "PLANNING" | "IN_PROGRESS" | "COMPLETED" | "ON_HOLD"
                )
              }
              className="px-3 py-1.5 rounded-lg border border-border/70 bg-card/70 text-foreground text-xs font-semibold focus:outline-none cursor-pointer"
            >
              <option value="PLANNING">Planning</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="ON_HOLD">On Hold</option>
            </select>
          </div>

          <button
            type="button"
            onClick={handleDelete}
            className="p-2 rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors"
            title="Delete Project"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-border/60">
          <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
            <DollarSign className="w-3.5 h-3.5 text-emerald-500" /> Total Budget
          </span>
          <p className="text-xl font-bold text-foreground mt-1">
            ${(project.budget || 0).toLocaleString()} {project.currency || "USD"}
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-border/60">
          <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-primary" /> Overall Progress
          </span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xl font-bold text-foreground">{progressPct}%</span>
            <span className="text-xs text-muted-foreground">
              {completedTasks} / {totalTasks} Milestones
            </span>
          </div>
          <div className="w-full bg-muted/60 rounded-full h-1.5 mt-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-primary to-purple-500 h-1.5 rounded-full transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-border/60">
          <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-amber-500" /> Timeline Scope
          </span>
          <p className="text-xl font-bold text-foreground mt-1">
            {project.timeline || "Active Milestone"}
          </p>
        </div>
      </div>

      {/* Main Grid: Milestones Checklist & Sidebar Deliverables/Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Milestones & Tasks Checklist (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-border/60 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-primary" />
                  Milestones & Deliverable Tasks
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Click any milestone to toggle status between Todo, In Progress, and Completed.
                </p>
              </div>
            </div>

            {tasks.length === 0 ? (
              <p className="text-xs text-muted-foreground py-4 text-center">
                No milestone tasks defined for this project yet.
              </p>
            ) : (
              <div className="space-y-2.5">
                {tasks.map((task) => {
                  const isDone = task.status === "DONE";
                  const isInProgress = task.status === "IN_PROGRESS";
                  const isToggling = taskTogglingId === task.id;

                  return (
                    <div
                      key={task.id}
                      onClick={() => handleToggleTask(task.id, task.status)}
                      className={`p-3.5 rounded-xl border flex items-center justify-between gap-3 text-xs cursor-pointer transition-all ${
                        isDone
                          ? "bg-emerald-500/5 border-emerald-500/30"
                          : isInProgress
                          ? "bg-blue-500/5 border-blue-500/30"
                          : "bg-background/50 border-border/60 hover:border-border"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {isToggling ? (
                          <Loader2 className="w-4 h-4 animate-spin text-primary" />
                        ) : isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : isInProgress ? (
                          <Clock className="w-4 h-4 text-blue-500 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-muted-foreground shrink-0" />
                        )}

                        <span
                          className={`font-medium ${
                            isDone
                              ? "line-through text-muted-foreground"
                              : "text-foreground"
                          }`}
                        >
                          {task.title}
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
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
            )}
          </div>

          {/* Scope & Description Box */}
          {project.description && (
            <div className="glass-panel p-6 rounded-2xl border border-border/60 space-y-2">
              <h3 className="text-sm font-bold text-foreground">Project Scope & Notes</h3>
              <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {project.description}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Invoices & Deliverables */}
        <div className="space-y-6">
          {/* Client Profile Card */}
          <div className="glass-panel p-5 rounded-2xl border border-border/60 space-y-3">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Client Details
            </span>
            <div className="space-y-1">
              <h3 className="font-bold text-sm text-foreground">
                {project.client?.companyName || "Apex Tech Labs"}
              </h3>
              <p className="text-xs text-muted-foreground">
                {project.client?.notes || "Active enterprise client"}
              </p>
            </div>
            <Link
              href="/portal/demo"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline pt-1"
            >
              Open Client Portal Preview <ExternalLink className="w-3 h-3" />
            </Link>
          </div>

          {/* Linked Invoices */}
          <div className="glass-panel p-5 rounded-2xl border border-border/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-emerald-500" /> Linked Invoices
              </span>
              <span className="text-[11px] text-muted-foreground">
                {project.invoices?.length || 0} Total
              </span>
            </div>

            <div className="space-y-2">
              {(project.invoices || []).map((inv) => (
                <div
                  key={inv.id}
                  className="p-3 rounded-xl border border-border/50 bg-background/40 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-semibold text-foreground">{inv.invoiceNumber}</span>
                    <p className="text-[10px] text-muted-foreground">
                      ${inv.amount.toLocaleString()}
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      inv.status === "PAID"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : "bg-amber-500/10 text-amber-500"
                    }`}
                  >
                    {inv.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Deliverables Files */}
          <div className="glass-panel p-5 rounded-2xl border border-border/60 space-y-3">
            <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <Download className="w-3.5 h-3.5 text-purple-500" /> Files & Deliverables
            </span>

            <div className="space-y-2">
              {(project.deliverables || []).map((del) => (
                <div
                  key={del.id}
                  className="p-3 rounded-xl border border-border/50 bg-background/40 flex items-center justify-between text-xs"
                >
                  <div className="truncate pr-2">
                    <span className="font-medium text-foreground block truncate">{del.name}</span>
                    <span className="text-[10px] text-muted-foreground">
                      {del.fileSize ? `${Math.round(Number(del.fileSize) / 1024)} KB` : "Asset"}
                    </span>
                  </div>
                  <a
                    href={del.fileUrl || "#"}
                    className="p-1.5 rounded-lg border border-border/70 hover:bg-muted text-primary"
                    title="Download File"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
