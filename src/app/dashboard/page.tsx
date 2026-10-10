import Link from "next/link";
import { auth } from "@/auth";
import { getFreelancerDashboardData } from "@/lib/services/dashboard";
import { DashboardRevenueChart } from "@/components/dashboard-revenue-chart";
import { DashboardActivityFeed } from "@/components/dashboard-activity-feed";
import {
  DollarSign,
  FolderKanban,
  Clock,
  Users,
  ArrowUpRight,
  Plus,
  Briefcase,
  FileText,
  CheckCircle2,
  AlertCircle,
  Receipt,
} from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  const session = await auth();

  // Layout already guards unauthenticated users, but satisfy TypeScript
  const userId = session?.user?.id || "demo-user";
  const isDemo = Boolean(
    session?.user?.email === "demo@luminaportal.com" ||
    (session?.user?.role === "DEMO" && session?.user?.email?.toLowerCase().includes("demo"))
  );

  console.log("===> DASHBOARD PAGE DEBUG:", {
    userId,
    userName: session?.user?.name,
    userEmail: session?.user?.email,
    userRole: session?.user?.role,
    isDemo,
  });

  const data = await getFreelancerDashboardData(userId, isDemo);

  console.log("===> DASHBOARD DATA MONTHLY REVENUE:", data.monthlyRevenue);

  return (
    <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
            Welcome back, {session?.user?.name || "Freelancer"}
            <span className="text-2xl">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Here is your live performance overview, active milestones, and cash flow.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/dashboard/invoices/new"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-border/80 bg-card/70 hover:bg-muted/70 text-xs font-semibold text-foreground transition-all"
          >
            <Receipt className="w-3.5 h-3.5 text-emerald-500" />
            Issue Invoice
          </Link>
          <Link
            href="/dashboard/projects/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all shadow-md shadow-primary/20 hover:scale-[1.01]"
          >
            <Plus className="w-4 h-4" />
            New Project
          </Link>
        </div>
      </div>

      {/* 4 Stat Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="glass-panel glow-border p-5 rounded-2xl relative overflow-hidden transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Total Revenue</span>
            <div className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-foreground">
              ${data.totalRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[11px] text-emerald-500 flex items-center gap-1 font-medium mt-1">
              <ArrowUpRight className="w-3 h-3" /> Stripe Verified
            </span>
          </div>
        </div>

        {/* Outstanding Invoices */}
        <div className="glass-panel glow-border p-5 rounded-2xl relative overflow-hidden transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Outstanding Invoices</span>
            <div className="h-8 w-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-foreground">
              ${data.pendingRevenue.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <span className="text-[11px] text-muted-foreground font-medium mt-1">
              Awaiting client clearance
            </span>
          </div>
        </div>

        {/* Active Projects */}
        <div className="glass-panel glow-border p-5 rounded-2xl relative overflow-hidden transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Active Projects</span>
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-foreground">{data.activeProjectsCount}</div>
            <span className="text-[11px] text-blue-500 font-medium mt-1">
              {data.projects.length} total in workspace
            </span>
          </div>
        </div>

        {/* Managed Clients */}
        <div className="glass-panel glow-border p-5 rounded-2xl relative overflow-hidden transition-all hover:shadow-md">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Managed Clients</span>
            <div className="h-8 w-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-foreground">{data.totalClientsCount}</div>
            <span className="text-[11px] text-purple-500 font-medium mt-1">
              White-labeled portals
            </span>
          </div>
        </div>
      </div>

      {/* Analytics Chart & Activity Feed Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardRevenueChart data={data.monthlyRevenue} />
        </div>
        <div>
          <DashboardActivityFeed activities={data.recentActivities} />
        </div>
      </div>

      {/* Projects & Invoices Overview Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Projects (2 columns) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-primary" /> Active Projects & Milestones
            </h2>
            <Link
              href="/dashboard/projects"
              className="text-xs font-semibold text-primary hover:underline"
            >
              View all projects →
            </Link>
          </div>

          <div className="space-y-3">
            {data.projects.slice(0, 4).map((p) => {
              const tasks = p.tasks || [];
              const completedTasks = tasks.filter((t) => t.status === "DONE").length;
              const totalTasks = tasks.length;
              const progressPct =
                totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

              return (
                <Link
                  key={p.id}
                  href={`/dashboard/projects/${p.id}`}
                  className="block glass-panel p-5 rounded-2xl border border-border/60 hover:border-border hover:shadow-md transition-all space-y-3 group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors">
                          {p.title}
                        </h3>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            p.status === "COMPLETED"
                              ? "bg-emerald-500/10 text-emerald-500"
                              : p.status === "IN_PROGRESS"
                              ? "bg-blue-500/10 text-blue-500"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {p.status.replace("_", " ")}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Client: {p.client?.companyName || "Private Client"} {p.budget ? `• Budget: $${p.budget.toLocaleString()}` : ""}
                      </p>
                    </div>

                    <div className="text-left sm:text-right shrink-0">
                      <span className="text-xs font-bold text-foreground">
                        {progressPct}% Done
                      </span>
                      <p className="text-[11px] text-muted-foreground">
                        {completedTasks} of {totalTasks} milestones
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-muted/60 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-primary to-purple-500 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${progressPct}%` }}
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Recent Invoices (1 column) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-500" /> Recent Invoices
            </h2>
            <Link
              href="/dashboard/invoices"
              className="text-xs font-semibold text-primary hover:underline"
            >
              View all →
            </Link>
          </div>

          <div className="space-y-3">
            {data.invoices.slice(0, 5).map((inv) => (
              <div
                key={inv.id}
                className="glass-panel p-4 rounded-xl border border-border/60 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="font-semibold text-foreground">{inv.invoiceNumber}</div>
                  <div className="text-[11px] text-muted-foreground">
                    {inv.client?.companyName || "Client"}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-foreground">
                    ${inv.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </div>
                  <span
                    className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full mt-0.5 ${
                      inv.status === "PAID"
                        ? "bg-emerald-500/10 text-emerald-500"
                        : inv.status === "OVERDUE"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-amber-500/10 text-amber-500"
                    }`}
                  >
                    {inv.status === "PAID" ? (
                      <CheckCircle2 className="w-2.5 h-2.5" />
                    ) : (
                      <AlertCircle className="w-2.5 h-2.5" />
                    )}
                    {inv.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
