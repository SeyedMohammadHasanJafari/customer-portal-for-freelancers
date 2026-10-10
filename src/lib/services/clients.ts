import { prisma } from "@/lib/prisma";
import { MOCK_DEMO_CLIENTS } from "@/lib/demo-data";
import { getLocalClientsByFreelancer, getLocalProjectsByFreelancer } from "@/lib/project-store";

export interface ClientWithRelations {
  id: string;
  companyName: string;
  notes?: string | null;
  freelancerId: string;
  createdAt: Date;
  user?: {
    name: string | null;
    email: string | null;
    image?: string | null;
  } | null;
  projects?: Array<{
    id: string;
    title: string;
    status: string;
  }>;
  invoices?: Array<{
    id: string;
    amount: number;
    status: string;
  }>;
}

export async function getClients(userId: string, isDemo: boolean): Promise<ClientWithRelations[]> {
  let dbClients: ClientWithRelations[] = [];
  try {
    const clients = await prisma.clientProfile.findMany({
      where: { freelancerId: userId },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
        projects: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
        invoices: {
          select: {
            id: true,
            amount: true,
            status: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
    dbClients = clients;
  } catch (error) {
    console.warn("DB query error in getClients, falling back:", (error as Error).message);
  }

  const localClients = getLocalClientsByFreelancer(userId);
  const combined = [...localClients, ...dbClients];

  if (isDemo) {
    const mockMapped = MOCK_DEMO_CLIENTS.map((c, i) => ({
      id: c.id,
      companyName: c.companyName,
      notes: c.notes,
      freelancerId: userId,
      createdAt: new Date(),
      user: {
        name: i === 0 ? "Sarah Jenkins" : i === 1 ? "Marcus Sterling" : "Elena Rostova",
        email: i === 0 ? "sarah@apextech.io" : i === 1 ? "marcus@vanguardstudios.co" : "elena@solaria.shop",
        image: null,
      },
      projects: [
        { id: `p${i + 1}`, title: `Active Contract ${i + 1}`, status: "IN_PROGRESS" },
      ],
      invoices: [
        { id: `inv-${i}`, amount: 4500, status: "PAID" },
      ],
    }));

    return [...combined, ...mockMapped];
  }

  // Regular user: If no client records found, extract from user projects if any
  if (combined.length === 0) {
    const projs = getLocalProjectsByFreelancer(userId);
    const projClients = projs
      .map((p) => p.client)
      .filter(Boolean)
      .map((c) => ({
        id: c?.id || "c1",
        companyName: c?.companyName || "Client",
        notes: "Project Client",
        freelancerId: userId,
        createdAt: new Date(),
        user: {
          name: c?.user?.name || c?.companyName || "Client Contact",
          email: c?.user?.email || "contact@client.com",
          image: null,
        },
        projects: [],
        invoices: [],
      }));
    if (projClients.length > 0) return projClients;
  }

  return combined;
}
