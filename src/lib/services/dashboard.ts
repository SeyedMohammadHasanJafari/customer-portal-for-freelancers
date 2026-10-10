import { prisma } from "@/lib/prisma";
import {
  MOCK_DEMO_PROJECTS,
  MOCK_DEMO_CLIENTS,
  MOCK_DEMO_INVOICES,
} from "@/lib/demo-data";
import {
  getLocalProjectsByFreelancer,
  getLocalInvoicesByFreelancer,
} from "@/lib/project-store";

export interface MonthlyRevenueData {
  month: string;
  revenue: number;
  invoices: number;
}

export interface ActivityItem {
  id: string;
  type: "PAYMENT" | "PROJECT_CREATED" | "TASK_COMPLETED" | "INVOICE_SENT";
  title: string;
  description: string;
  timestamp: Date;
  amount?: number;
}

export interface DashboardInvoiceItem {
  id: string;
  invoiceNumber?: string;
  amount: number;
  currency?: string;
  status: string;
  dueDate?: Date | string | null;
  paidAt?: Date | string | null;
  createdAt?: Date | string;
  client?: { companyName: string } | null;
  project?: { title: string } | null;
}

export interface DashboardProjectItem {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  budget?: number | null;
  currency?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  client?: { companyName: string } | null;
  tasks?: Array<{ id?: string; title: string; status: string; createdAt?: Date | string; updatedAt?: Date | string }>;
}

export interface DashboardClientItem {
  id: string;
  companyName: string;
  notes?: string | null;
  user?: { name?: string | null; email?: string | null } | null;
}

export interface DashboardOverviewData {
  totalRevenue: number;
  pendingRevenue: number;
  activeProjectsCount: number;
  totalClientsCount: number;
  projects: DashboardProjectItem[];
  invoices: DashboardInvoiceItem[];
  clients: DashboardClientItem[];
  monthlyRevenue: MonthlyRevenueData[];
  recentActivities: ActivityItem[];
}

export async function getFreelancerDashboardData(
  userId: string,
  isDemo: boolean
): Promise<DashboardOverviewData> {
  let dbProjects: DashboardProjectItem[] = [];
  let dbClients: DashboardClientItem[] = [];
  let dbInvoices: DashboardInvoiceItem[] = [];

  try {
    const [p, c, i] = await Promise.all([
      prisma.project.findMany({
        where: { freelancerId: userId },
        include: {
          client: true,
          tasks: true,
          invoices: true,
        },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.clientProfile.findMany({
        where: { freelancerId: userId },
        orderBy: { createdAt: "desc" },
      }),
      prisma.invoice.findMany({
        where: {
          project: {
            freelancerId: userId,
          },
        },
        include: {
          project: true,
          client: true,
        },
        orderBy: { createdAt: "desc" },
      }),
    ]);

    dbProjects = p;
    dbClients = c;
    dbInvoices = i;
  } catch (error) {
    console.warn("Prisma query failed, falling back gracefully:", (error as Error).message);
  }

  // Merge locally stored projects, invoices and clients
  const { getLocalClientsByFreelancer } = await import("@/lib/project-store");
  const localProjects = getLocalProjectsByFreelancer(userId);
  const localInvoices = getLocalInvoicesByFreelancer(userId);
  const localClients = getLocalClientsByFreelancer(userId);

  const combinedProjects = [...localProjects, ...dbProjects];
  const combinedInvoices = [...localInvoices, ...dbInvoices];

  // Preserved Demo Suite vs Real User Isolation
  const projects = isDemo ? [...combinedProjects, ...MOCK_DEMO_PROJECTS] : combinedProjects;
  const clients: DashboardClientItem[] = isDemo
    ? [...dbClients, ...localClients, ...MOCK_DEMO_CLIENTS]
    : dbClients.length > 0
    ? dbClients
    : localClients.length > 0
    ? localClients
    : localProjects
        .map((p) => p.client)
        .filter((c): c is NonNullable<typeof c> => Boolean(c))
        .map((c) => ({
          id: c.id,
          companyName: c.companyName,
          notes: null,
          user: c.user || null,
        }));
  const invoices = isDemo ? [...combinedInvoices, ...MOCK_DEMO_INVOICES] : combinedInvoices;

  // Calculate Metrics
  const totalRevenue = invoices
    .filter((inv) => inv.status === "PAID")
    .reduce((sum, inv) => sum + (inv.amount || 0), 0);

  const pendingRevenue = invoices
    .filter((inv) => inv.status === "PENDING" || inv.status === "OVERDUE")
    .reduce((sum, inv) => sum + (inv.amount || 0), 0);

  const activeProjectsCount = projects.filter(
    (p) => p.status === "IN_PROGRESS" || p.status === "PLANNING"
  ).length;

  const totalClientsCount = clients.length;

  // Real Monthly Revenue calculation (Last 6 months)
  const monthlyRevenue = calculateMonthlyRevenue(invoices, isDemo);

  // Generate Activities (Demo vs Real)
  let recentActivities: ActivityItem[] = [];
  if (isDemo) {
    recentActivities = [
      {
        id: "act-1",
        type: "PAYMENT",
        title: "Invoice INV-2026-003 Paid",
        description: "Vanguard Studios completed Stripe payment",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
        amount: 12000,
      },
      {
        id: "act-2",
        type: "TASK_COMPLETED",
        title: "Milestone Completed",
        description: "Build Core Button, Input & Dialog components marked as done",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 18),
      },
      {
        id: "act-3",
        type: "PROJECT_CREATED",
        title: "New Project Initiated",
        description: "Solaria DTC E-Commerce Redesign & Checkout created",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 36),
      },
      {
        id: "act-4",
        type: "INVOICE_SENT",
        title: "Invoice INV-2026-002 Issued",
        description: "Sent to Apex Tech Labs for Design Tokens",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72),
        amount: 4250,
      },
    ];
  } else {
    for (const inv of combinedInvoices) {
      if (inv.status === "PAID" && inv.paidAt) {
        recentActivities.push({
          id: `act-inv-paid-${inv.id}`,
          type: "PAYMENT",
          title: `Invoice ${inv.invoiceNumber} Paid`,
          description: `${inv.client?.companyName || "Client"} settled via Stripe`,
          timestamp: new Date(inv.paidAt),
          amount: inv.amount,
        });
      } else {
        recentActivities.push({
          id: `act-inv-sent-${inv.id}`,
          type: "INVOICE_SENT",
          title: `Invoice ${inv.invoiceNumber} Issued`,
          description: `Issued for ${inv.project?.title || "Project"}`,
          timestamp: inv.createdAt ? new Date(inv.createdAt) : new Date(),
          amount: inv.amount,
        });
      }
    }
    for (const proj of combinedProjects) {
      const projTime = proj.createdAt || proj.updatedAt;
      recentActivities.push({
        id: `act-proj-${proj.id}`,
        type: "PROJECT_CREATED",
        title: `Project "${proj.title}" Created`,
        description: `Project with budget $${(proj.budget || 0).toLocaleString()} USD`,
        timestamp: projTime ? new Date(projTime) : new Date(),
      });
      for (const t of proj.tasks || []) {
        if (t.status === "DONE") {
          const taskTime = t.updatedAt || t.createdAt;
          recentActivities.push({
            id: `act-task-${t.id}`,
            type: "TASK_COMPLETED",
            title: `Task Done: ${t.title}`,
            description: `Milestone completed for "${proj.title}"`,
            timestamp: taskTime ? new Date(taskTime) : new Date(),
          });
        }
      }
    }

    recentActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    recentActivities = recentActivities.slice(0, 10);
  }

  return {
    totalRevenue,
    pendingRevenue,
    activeProjectsCount,
    totalClientsCount,
    projects,
    invoices,
    clients,
    monthlyRevenue,
    recentActivities,
  };
}

function calculateMonthlyRevenue(invoices: DashboardInvoiceItem[], isDemo: boolean): MonthlyRevenueData[] {
  if (isDemo) {
    return [
      { month: "May", revenue: 4200, invoices: 2 },
      { month: "Jun", revenue: 6500, invoices: 3 },
      { month: "Jul", revenue: 8900, invoices: 4 },
      { month: "Aug", revenue: 5400, invoices: 2 },
      { month: "Sep", revenue: 12000, invoices: 5 },
      { month: "Oct", revenue: 9500, invoices: 3 },
    ];
  }

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const now = new Date();
  const result: MonthlyRevenueData[] = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = monthNames[d.getMonth()];
    const targetYear = d.getFullYear();
    const targetMonth = d.getMonth();

    const paidInMonth = invoices.filter((inv) => {
      if (inv.status !== "PAID") return false;
      const date = inv.paidAt ? new Date(inv.paidAt) : (inv.createdAt ? new Date(inv.createdAt) : null);
      if (!date) return false;
      return date.getFullYear() === targetYear && date.getMonth() === targetMonth;
    });

    const monthRev = paidInMonth.reduce((sum, inv) => sum + (inv.amount || 0), 0);
    result.push({
      month: monthName,
      revenue: monthRev,
      invoices: paidInMonth.length,
    });
  }

  return result;
}
