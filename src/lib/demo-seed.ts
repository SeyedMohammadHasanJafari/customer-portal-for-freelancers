import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const DEMO_USER_EMAIL = "demo@luminaportal.com";
export const DEMO_USER_PASSWORD = "demoPassword2026!";

export async function ensureDemoData() {
  try {
    // Check if demo user already exists
    let demoUser = await prisma.user.findUnique({
      where: { email: DEMO_USER_EMAIL },
      include: {
        freelancerProjects: true,
      },
    });

    if (demoUser && demoUser.freelancerProjects.length > 0) {
      return demoUser;
    }

    const hashedPassword = await bcrypt.hash(DEMO_USER_PASSWORD, 10);

    if (!demoUser) {
      demoUser = await prisma.user.create({
        data: {
          email: DEMO_USER_EMAIL,
          name: "Alex Vance (Demo)",
          password: hashedPassword,
          role: "DEMO",
          image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        },
        include: {
          freelancerProjects: true,
        },
      });
    }

    // Create 3 Client Users & Profiles
    const clientsData = [
      {
        name: "Sarah Jenkins",
        email: "sarah@apextech.io",
        companyName: "Apex Tech Labs",
        notes: "Enterprise AI and Cloud Analytics platform.",
      },
      {
        name: "Marcus Sterling",
        email: "marcus@vanguardstudios.co",
        companyName: "Vanguard Creative Studios",
        notes: "Global boutique creative and production studio.",
      },
      {
        name: "Elena Rostova",
        email: "elena@solaria.shop",
        companyName: "Solaria Wellness Co.",
        notes: "Direct-to-consumer organic wellness brand.",
      },
    ];

    const createdClientProfiles = [];

    for (const clientInfo of clientsData) {
      let clientUser = await prisma.user.findUnique({
        where: { email: clientInfo.email },
      });

      if (!clientUser) {
        clientUser = await prisma.user.create({
          data: {
            name: clientInfo.name,
            email: clientInfo.email,
            role: "CLIENT",
            password: hashedPassword,
          },
        });
      }

      let clientProfile = await prisma.clientProfile.findUnique({
        where: { userId: clientUser.id },
      });

      if (!clientProfile) {
        clientProfile = await prisma.clientProfile.create({
          data: {
            userId: clientUser.id,
            companyName: clientInfo.companyName,
            freelancerId: demoUser.id,
            notes: clientInfo.notes,
          },
        });
      }

      createdClientProfiles.push(clientProfile);
    }

    // Create Projects with Tasks, Deliverables, and Invoices
    const projectsData = [
      {
        title: "Enterprise Design System & Component Library",
        description: "Comprehensive token-based design system and Figma UI library built with Tailwind CSS.",
        status: "IN_PROGRESS" as const,
        budget: 8500,
        timeline: "4 Weeks remaining",
        clientProfileIndex: 0,
        tasks: [
          { title: "Define Color Tokens & Typography scales", status: "DONE" as const },
          { title: "Build Core Button, Input & Dialog components", status: "DONE" as const },
          { title: "Implement Data Table with sorting and filters", status: "IN_PROGRESS" as const },
          { title: "Accessibility (WCAG 2.1 AAA) audit & documentation", status: "TODO" as const },
        ],
        deliverables: [
          { name: "Apex_Design_Tokens_v1.0.json", fileUrl: "#", fileSize: 42000 },
          { name: "Figma_Component_Library_Master.fig", fileUrl: "#", fileSize: 18500000 },
        ],
        invoices: [
          {
            invoiceNumber: "INV-2026-001",
            amount: 4250,
            status: "PAID" as const,
            dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14),
            paidAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12),
          },
          {
            invoiceNumber: "INV-2026-002",
            amount: 4250,
            status: "PENDING" as const,
            dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
          },
        ],
      },
      {
        title: "Vanguard Studios Portfolio & Video Showcase",
        description: "Award-winning portfolio site featuring fluid WebGL transitions and Vimeo Pro integrations.",
        status: "COMPLETED" as const,
        budget: 12000,
        timeline: "Completed",
        clientProfileIndex: 1,
        tasks: [
          { title: "Interactive wireframes and moodboard presentation", status: "DONE" as const },
          { title: "WebGL Shader background and audio-reactive cursor", status: "DONE" as const },
          { title: "Performance optimization for mobile devices", status: "DONE" as const },
        ],
        deliverables: [
          { name: "Production_Build_Assets.zip", fileUrl: "#", fileSize: 34500000 },
          { name: "CMS_Content_Guidelines.pdf", fileUrl: "#", fileSize: 2800000 },
        ],
        invoices: [
          {
            invoiceNumber: "INV-2026-003",
            amount: 12000,
            status: "PAID" as const,
            dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30),
            paidAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 28),
          },
        ],
      },
      {
        title: "Solaria DTC E-Commerce Redesign & Checkout",
        description: "Shopify headless storefront architecture with customized subscriptions and bundle builder.",
        status: "IN_PROGRESS" as const,
        budget: 9600,
        timeline: "2 Weeks remaining",
        clientProfileIndex: 2,
        tasks: [
          { title: "Cart drawer and instant upsell modals", status: "DONE" as const },
          { title: "Stripe subscription billing integration", status: "IN_PROGRESS" as const },
          { title: "End-to-end checkout flow testing", status: "TODO" as const },
        ],
        deliverables: [
          { name: "UX_Flow_Diagram_Checkout.pdf", fileUrl: "#", fileSize: 1500000 },
        ],
        invoices: [
          {
            invoiceNumber: "INV-2026-004",
            amount: 4800,
            status: "PAID" as const,
            dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 20),
            paidAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 18),
          },
          {
            invoiceNumber: "INV-2026-005",
            amount: 4800,
            status: "OVERDUE" as const,
            dueDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3),
          },
        ],
      },
      {
        title: "Mobile App Native UI (iOS / Android)",
        description: "React Native prototype with biometrics authentication and offline synchronization.",
        status: "PLANNING" as const,
        budget: 6500,
        timeline: "Starting next month",
        clientProfileIndex: 0,
        tasks: [
          { title: "Specification document & API contract review", status: "IN_PROGRESS" as const },
          { title: "UI Mockups for Onboarding & Security settings", status: "TODO" as const },
        ],
        deliverables: [],
        invoices: [
          {
            invoiceNumber: "INV-2026-006",
            amount: 3250,
            status: "PENDING" as const,
            dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15),
          },
        ],
      },
    ];

    for (const p of projectsData) {
      const clientProfile = createdClientProfiles[p.clientProfileIndex];

      const project = await prisma.project.create({
        data: {
          title: p.title,
          description: p.description,
          status: p.status,
          budget: p.budget,
          currency: "USD",
          timeline: p.timeline,
          freelancerId: demoUser.id,
          clientId: clientProfile.id,
        },
      });

      // Add Tasks
      for (const t of p.tasks) {
        await prisma.task.create({
          data: {
            title: t.title,
            status: t.status,
            projectId: project.id,
          },
        });
      }

      // Add Deliverables
      for (const d of p.deliverables) {
        await prisma.deliverable.create({
          data: {
            name: d.name,
            fileUrl: d.fileUrl,
            fileSize: d.fileSize,
            projectId: project.id,
          },
        });
      }

      // Add Invoices
      for (const inv of p.invoices) {
        const invoiceItem = inv as {
          invoiceNumber: string;
          amount: number;
          status: "PENDING" | "PAID" | "OVERDUE";
          dueDate?: Date;
          paidAt?: Date;
        };

        await prisma.invoice.create({
          data: {
            invoiceNumber: invoiceItem.invoiceNumber,
            amount: invoiceItem.amount,
            currency: "USD",
            status: invoiceItem.status,
            dueDate: invoiceItem.dueDate,
            paidAt: invoiceItem.paidAt || null,
            projectId: project.id,
            clientId: clientProfile.id,
          },
        });
      }
    }

    return demoUser;
  } catch (error) {
    console.warn("Database unavailable during demo seeding, using resilient mock fallback:", (error as Error).message);
    // Return virtual demo user object so the app flow is never interrupted
    return {
      id: "demo-user-id-001",
      name: "Alex Vance (Demo)",
      email: DEMO_USER_EMAIL,
      role: "DEMO",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      freelancerProjects: [],
    };
  }
}
