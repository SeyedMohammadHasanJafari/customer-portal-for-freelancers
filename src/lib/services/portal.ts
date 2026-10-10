import { prisma } from "@/lib/prisma";
import { MOCK_DEMO_PROJECTS, MOCK_DEMO_INVOICES, MOCK_DEMO_CLIENTS } from "@/lib/demo-data";
import { getAllLocalProjects, getAllLocalInvoices } from "@/lib/project-store";

export interface PortalTask {
  id?: string;
  title: string;
  status: string;
  description?: string | null;
  dueDate?: Date | string | null;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface PortalDeliverable {
  id: string;
  name: string;
  fileUrl: string;
  fileSize?: number | string | null;
  projectId?: string;
  createdAt?: Date | string;
}

export interface PortalInvoice {
  id: string;
  invoiceNumber?: string;
  amount: number;
  currency?: string;
  status: string;
  dueDate?: Date | string | null;
  paidAt?: Date | string | null;
  projectId?: string;
  clientId?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  stripePaymentIntentId?: string | null;
  stripeCheckoutSessionId?: string | null;
  client?: { companyName: string } | null;
}

export interface PortalProject {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  budget?: number | null;
  currency?: string;
  timeline?: string | null;
  clientId?: string;
  freelancerId?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
  client?: {
    id?: string;
    companyName: string;
    user?: { name: string | null; email: string | null; image?: string | null } | null;
  } | null;
  tasks?: PortalTask[];
  deliverables?: PortalDeliverable[];
  invoices?: PortalInvoice[];
}

export interface ClientPortalData {
  clientName: string;
  companyName: string;
  freelancerName: string;
  freelancerAgency: string;
  projects: PortalProject[];
  deliverables: PortalDeliverable[];
  invoices: PortalInvoice[];
  totalOutstanding: number;
  overallProgress: number;
}

export async function getClientPortalData(
  identifier: string
): Promise<ClientPortalData> {
  const normId = (identifier || "demo").trim();

  // 1. Dedicated Demo Mode Suite
  if (normId === "demo") {
    const mockClient = MOCK_DEMO_CLIENTS[0];
    const mockProjects = [
      MOCK_DEMO_PROJECTS[0],
      MOCK_DEMO_PROJECTS[3],
    ];
    const mockInvoices = [
      MOCK_DEMO_INVOICES[0],
      MOCK_DEMO_INVOICES[1],
      MOCK_DEMO_INVOICES[5],
    ];
    const mockDeliverables = [
      {
        id: "del-demo-1",
        name: "Enterprise_Design_Tokens_v2.pdf",
        fileUrl: `/api/deliverables/download?name=Enterprise_Design_Tokens_v2.pdf&client=Apex%20Tech%20Labs&project=Enterprise%20Design%20System&freelancer=Alex%20Vance&agency=Vance%20Design`,
        fileSize: 1850000,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      },
      {
        id: "del-demo-2",
        name: "Figma_Component_Library_Master.pdf",
        fileUrl: `/api/deliverables/download?name=Figma_Component_Library_Master.pdf&client=Apex%20Tech%20Labs&project=Enterprise%20Design%20System&freelancer=Alex%20Vance&agency=Vance%20Design`,
        fileSize: 2450000,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5),
      },
      {
        id: "del-demo-3",
        name: "WCAG_Accessibility_Compliance_Report.pdf",
        fileUrl: `/api/deliverables/download?name=WCAG_Accessibility_Compliance_Report.pdf&client=Apex%20Tech%20Labs&project=Enterprise%20Design%20System&freelancer=Alex%20Vance&agency=Vance%20Design`,
        fileSize: 3100000,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 8),
      },
      {
        id: "del-demo-4",
        name: "Mobile_App_Native_UI_Specification.pdf",
        fileUrl: `/api/deliverables/download?name=Mobile_App_Native_UI_Specification.pdf&client=Apex%20Tech%20Labs&project=Mobile%20App%20Native%20UI&freelancer=Alex%20Vance&agency=Vance%20Design`,
        fileSize: 2150000,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10),
      },
    ];

    const totalOutstanding = mockInvoices
      .filter((i) => i.status !== "PAID")
      .reduce((sum, i) => sum + i.amount, 0);

    const allTasks = mockProjects.flatMap((p) => p.tasks);
    const doneTasks = allTasks.filter((t) => t.status === "DONE").length;
    const overallProgress = allTasks.length > 0 ? Math.round((doneTasks / allTasks.length) * 100) : 0;

    return {
      clientName: "Sarah Jenkins",
      companyName: mockClient.companyName,
      freelancerName: "Alex Vance",
      freelancerAgency: "Vance Engineering & Design",
      projects: mockProjects,
      deliverables: mockDeliverables,
      invoices: mockInvoices,
      totalOutstanding,
      overallProgress,
    };
  }

  // 2. Real Client Workspace: Check persistent local store first
  const localProjects = getAllLocalProjects();
  const localInvoices = getAllLocalInvoices();

  // Find ALL projects belonging to this client (by clientId, companyName, or projectId)
  const matchingProjects = localProjects.filter(
    (p) =>
      p.clientId === normId ||
      p.client?.id === normId ||
      (p.client?.companyName && p.client.companyName.toLowerCase() === normId.toLowerCase()) ||
      p.id === normId
  );

  if (matchingProjects.length > 0) {
    const primaryClient = matchingProjects[0].client;
    const companyName = primaryClient?.companyName || normId;
    const clientName = primaryClient?.user?.name || "Client Partner";
    const freelancerName = "Mohamad Jafari";
    const freelancerAgency = "Lumina Studio";

    const projectIds = new Set(matchingProjects.map((p) => p.id));
    const projectInvoices = localInvoices.filter(
      (inv) => projectIds.has(inv.projectId) || (inv.clientId && inv.clientId === matchingProjects[0].clientId)
    );

    // Build deliverables for ALL projects of this client
    const deliverables: PortalDeliverable[] = [];
    for (const p of matchingProjects) {
      if (p.deliverables && p.deliverables.length > 0) {
        for (const d of p.deliverables) {
          const safeName = d.name.toLowerCase().endsWith(".pdf")
            ? d.name
            : `${d.name.replace(/\.[^/.]+$/, "")}.pdf`;
          deliverables.push({
            id: d.id || `del-${p.id}`,
            name: safeName,
            fileUrl: `/api/deliverables/download?name=${encodeURIComponent(safeName)}&project=${encodeURIComponent(p.title)}&client=${encodeURIComponent(companyName)}&freelancer=${encodeURIComponent(freelancerName)}&agency=${encodeURIComponent(freelancerAgency)}&id=${p.id}`,
            fileSize: d.fileSize || 1850000,
            createdAt: d.createdAt || p.createdAt || new Date(),
          });
        }
      } else {
        const safeName = `${p.title.replace(/\s+/g, "_")}_Scope_Deliverable.pdf`;
        deliverables.push({
          id: `del-${p.id}`,
          name: safeName,
          fileUrl: `/api/deliverables/download?name=${encodeURIComponent(safeName)}&project=${encodeURIComponent(p.title)}&client=${encodeURIComponent(companyName)}&freelancer=${encodeURIComponent(freelancerName)}&agency=${encodeURIComponent(freelancerAgency)}&id=${p.id}`,
          fileSize: 1850000 + (p.budget ? p.budget * 80 : 0),
          createdAt: p.createdAt || new Date(),
        });
      }
    }

    const allTasks = matchingProjects.flatMap((p) => p.tasks || []);
    const doneTasks = allTasks.filter((t) => t.status === "DONE").length;
    const overallProgress = allTasks.length > 0 ? Math.round((doneTasks / allTasks.length) * 100) : 0;

    const totalOutstanding = projectInvoices
      .filter((i) => i.status !== "PAID")
      .reduce((sum, i) => sum + (i.amount || 0), 0);

    return {
      clientName,
      companyName,
      freelancerName,
      freelancerAgency,
      projects: matchingProjects,
      deliverables,
      invoices: projectInvoices,
      totalOutstanding,
      overallProgress,
    };
  }

  // 3. Fallback: Check Prisma Database
  try {
    const dbClient = await prisma.clientProfile.findFirst({
      where: {
        OR: [{ id: normId }, { companyName: normId }],
      },
      include: {
        user: true,
        freelancer: true,
        projects: {
          include: {
            tasks: { orderBy: { createdAt: "asc" } },
            deliverables: { orderBy: { createdAt: "desc" } },
          },
        },
        invoices: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (dbClient) {
      const dbProjects = dbClient.projects || [];
      const dbInvoices = dbClient.invoices || [];

      const deliverables: PortalDeliverable[] = [];
      for (const p of dbProjects) {
        if (p.deliverables && p.deliverables.length > 0) {
          for (const d of p.deliverables) {
            const safeName = d.name.toLowerCase().endsWith(".pdf")
              ? d.name
              : `${d.name.replace(/\.[^/.]+$/, "")}.pdf`;
            deliverables.push({
              id: d.id,
              name: safeName,
              fileUrl: `/api/deliverables/download?name=${encodeURIComponent(safeName)}&project=${encodeURIComponent(p.title)}&client=${encodeURIComponent(dbClient.companyName)}&id=${p.id}`,
              fileSize: d.fileSize || 1850000,
              createdAt: d.createdAt,
            });
          }
        } else {
          const safeName = `${p.title.replace(/\s+/g, "_")}_Scope_Deliverable.pdf`;
          deliverables.push({
            id: `del-${p.id}`,
            name: safeName,
            fileUrl: `/api/deliverables/download?name=${encodeURIComponent(safeName)}&project=${encodeURIComponent(p.title)}&client=${encodeURIComponent(dbClient.companyName)}&id=${p.id}`,
            fileSize: 1850000,
            createdAt: p.createdAt,
          });
        }
      }

      const allTasks = dbProjects.flatMap((p) => p.tasks || []);
      const completedTasks = allTasks.filter((t) => t.status === "DONE").length;
      const overallProgress = allTasks.length > 0 ? Math.round((completedTasks / allTasks.length) * 100) : 0;

      const totalOutstanding = dbInvoices
        .filter((i) => i.status !== "PAID")
        .reduce((sum, i) => sum + (i.amount || 0), 0);

      return {
        clientName: dbClient.user?.name || "Valued Client",
        companyName: dbClient.companyName,
        freelancerName: dbClient.freelancer?.name || "Mohamad Jafari",
        freelancerAgency: "Lumina Studio",
        projects: dbProjects,
        deliverables,
        invoices: dbInvoices,
        totalOutstanding,
        overallProgress,
      };
    }
  } catch (err) {
    console.warn("DB lookup in getClientPortalData failed:", (err as Error).message);
  }

  // 4. Default fallback: Demo client
  return getClientPortalData("demo");
}
