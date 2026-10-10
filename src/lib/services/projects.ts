import { prisma } from "@/lib/prisma";
import { MOCK_DEMO_PROJECTS } from "@/lib/demo-data";
import {
  getLocalProjectsByFreelancer,
  getLocalProjectById,
} from "@/lib/project-store";

export interface ProjectDeliverable {
  id: string;
  name: string;
  fileUrl: string;
  fileSize?: string | number | null;
  createdAt?: Date;
}

export interface ProjectTask {
  id: string;
  title: string;
  description?: string | null;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  dueDate?: Date | null;
  createdAt?: Date;
}

export interface ProjectInvoice {
  id: string;
  invoiceNumber?: string;
  amount: number;
  status: string;
  dueDate?: Date | null;
  paidAt?: Date | null;
}

export interface ProjectWithDetails {
  id: string;
  title: string;
  description?: string | null;
  status: string;
  budget?: number | null;
  currency?: string;
  timeline?: string | null;
  freelancerId?: string;
  clientId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  client?: {
    id?: string;
    companyName: string;
    notes?: string | null;
    user?: { name: string | null; email: string | null; image?: string | null } | null;
  } | null;
  tasks?: ProjectTask[];
  invoices?: ProjectInvoice[];
  deliverables?: ProjectDeliverable[];
}

export async function getProjects(userId: string, isDemo: boolean): Promise<ProjectWithDetails[]> {
  let dbProjects: ProjectWithDetails[] = [];

  try {
    const projects = await prisma.project.findMany({
      where: { freelancerId: userId },
      include: {
        client: true,
        tasks: true,
        invoices: true,
        deliverables: true,
      },
      orderBy: { updatedAt: "desc" },
    });
    dbProjects = projects;
  } catch (error) {
    console.warn("DB query error in getProjects, falling back:", (error as Error).message);
  }

  // Get locally created projects for this freelancer
  const localProjects = getLocalProjectsByFreelancer(userId);

  // Combine DB and locally stored projects
  const allProjects = [...localProjects, ...dbProjects];

  if (isDemo) {
    return [...allProjects, ...MOCK_DEMO_PROJECTS];
  }

  return allProjects;
}

export async function getProjectById(
  projectId: string,
  userId: string,
  isDemo: boolean
): Promise<ProjectWithDetails | null> {
  // Check local store first (for newly created projects)
  const localProject = getLocalProjectById(projectId);
  if (localProject) {
    return localProject;
  }

  try {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        freelancerId: userId,
      },
      include: {
        client: true,
        tasks: {
          orderBy: { createdAt: "asc" },
        },
        invoices: {
          orderBy: { createdAt: "desc" },
        },
        deliverables: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (project) {
      return project;
    }
  } catch (error) {
    console.warn("DB query error in getProjectById, falling back:", (error as Error).message);
  }

  // Fallback to match in mock demo data
  if (isDemo || projectId.startsWith("p")) {
    const mock = MOCK_DEMO_PROJECTS.find((p) => p.id === projectId) || MOCK_DEMO_PROJECTS[0];
    const mockDetails: ProjectWithDetails = {
      ...mock,
      freelancerId: userId,
      clientId: "mock-client-id",
      tasks: mock.tasks.map((t) => ({
        id: t.id,
        title: t.title,
        description: t.description || null,
        status: t.status,
        createdAt: new Date(),
      })),
      invoices: [
        {
          id: "inv-mock-1",
          invoiceNumber: "INV-2026-001",
          amount: mock.budget ? mock.budget * 0.5 : 3000,
          status: "PAID",
          dueDate: new Date(),
          paidAt: new Date(),
        },
      ],
      deliverables: [
        {
          id: "del-1",
          name: "Project_Requirements_Specification.pdf",
          fileUrl: "#",
          fileSize: 1840000,
          createdAt: new Date(),
        },
        {
          id: "del-2",
          name: "Design_Assets_Deliverable.zip",
          fileUrl: "#",
          fileSize: 14200000,
          createdAt: new Date(),
        },
      ],
    };
    return mockDetails;
  }

  return null;
}
