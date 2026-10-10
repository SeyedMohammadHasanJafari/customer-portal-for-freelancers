import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendClientPortalInvite } from "@/lib/services/email";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { companyName, email, contactName, projectName } = body;

    if (!companyName || !email) {
      return NextResponse.json(
        { error: "Company name and client email are required." },
        { status: 400 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const portalUrl = `${appUrl}/portal/demo?client=${encodeURIComponent(companyName)}`;

    // 1. Immediately create and persist client in local store
    const { saveClientToLocalStore } = await import("@/lib/project-store");
    const clientId = `client_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const cleanName = (contactName || companyName).trim();

    const newClient = {
      id: clientId,
      companyName: companyName.trim(),
      contactName: cleanName,
      email: email.trim(),
      phone: null,
      notes: "Added via Clients manager",
      freelancerId: session.user.id,
      status: "ACTIVE" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
      user: {
        name: cleanName,
        email: email.trim(),
        image: null,
      },
      projects: [],
      invoices: [],
    };

    saveClientToLocalStore(newClient);

    // Optional email notification (non-blocking, won't fail client creation if not configured)
    try {
      await sendClientPortalInvite({
        toEmail: email,
        clientName: cleanName,
        agencyName: session.user.name || "Your Freelancer",
        portalUrl,
        projectName: projectName || "active project milestones",
      });
    } catch (e) {
      console.warn("Optional client invite email notice skipped:", (e as Error).message);
    }

    // If real database is active and user is not demo, persist client record
    if (session.user.role !== "DEMO" && !session.user.isDemo) {
      try {
        let clientUser = await prisma.user.findUnique({
          where: { email },
        });

        if (!clientUser) {
          clientUser = await prisma.user.create({
            data: {
              name: cleanName,
              email: email.trim(),
              role: "CLIENT",
            },
          });
        }

        await prisma.clientProfile.upsert({
          where: { userId: clientUser.id },
          create: {
            userId: clientUser.id,
            companyName: companyName.trim(),
            freelancerId: session.user.id,
            notes: "Directly added client",
          },
          update: {
            companyName: companyName.trim(),
            freelancerId: session.user.id,
          },
        });
      } catch (dbError) {
        console.warn("DB save during client creation skipped:", (dbError as Error).message);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Client ${cleanName} added successfully!`,
      client: newClient,
    });
  } catch (error) {
    console.error("Invite error:", error);
    return NextResponse.json(
      { error: "Failed to dispatch invitation." },
      { status: 500 }
    );
  }
}
