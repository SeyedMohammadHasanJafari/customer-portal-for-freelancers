"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { saveClientToLocalStore, StoredClient } from "@/lib/project-store";

export async function createClientAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const companyName = formData.get("companyName") as string;
  const contactName = formData.get("contactName") as string;
  const email = formData.get("email") as string;
  const phone = (formData.get("phone") as string) || null;
  const notes = (formData.get("notes") as string) || null;

  if (!companyName || !companyName.trim()) {
    throw new Error("Company name is required.");
  }
  if (!email || !email.trim()) {
    throw new Error("Contact email is required.");
  }

  const clientId = `client_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const cleanName = (contactName || companyName).trim();

  const newClient: StoredClient = {
    id: clientId,
    companyName: companyName.trim(),
    contactName: cleanName,
    email: email.trim(),
    phone: phone ? phone.trim() : null,
    notes: notes ? notes.trim() : null,
    freelancerId: session.user.id,
    status: "ACTIVE",
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

  // 1. Save directly to local persistent store
  saveClientToLocalStore(newClient);

  // 2. Resilient DB persistence if database is active
  try {
    let clientUser = await prisma.user.findUnique({
      where: { email: email.trim() },
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

    await prisma.clientProfile.create({
      data: {
        userId: clientUser.id,
        companyName: companyName.trim(),
        freelancerId: session.user.id,
        notes: notes ? notes.trim() : null,
      },
    });
  } catch (err) {
    console.warn("Prisma client creation failed, saved to local store:", (err as Error).message);
  }

  revalidatePath("/dashboard/clients");
  revalidatePath("/dashboard/projects/new");
  revalidatePath("/dashboard/invoices/new");
  revalidatePath("/dashboard");

  return { success: true, client: newClient };
}
