import { prisma } from "@/lib/prisma";
import { MOCK_DEMO_INVOICES } from "@/lib/demo-data";

export async function getInvoiceById(invoiceId: string) {
  try {
    const inv = await prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: {
        project: true,
        client: true,
      },
    });

    if (inv) return inv;
  } catch (error) {
    console.warn("DB lookup in getInvoiceById failed, checking mock:", (error as Error).message);
  }

  // Fallback to mock invoices
  const mockInv = MOCK_DEMO_INVOICES.find((i) => i.id === invoiceId || i.invoiceNumber === invoiceId);
  if (mockInv) {
    return {
      ...mockInv,
      projectId: "p1",
      clientId: "c1",
      project: { title: "Enterprise Design System" },
      client: { companyName: mockInv.client.companyName },
    };
  }

  return null;
}

export async function markInvoiceAsPaid(
  invoiceId: string,
  stripeSessionId?: string,
  stripePaymentIntentId?: string
) {
  // Always update in local store as well
  const { markLocalInvoicePaid } = await import("@/lib/project-store");
  markLocalInvoicePaid(invoiceId);

  try {
    await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: "PAID",
        paidAt: new Date(),
        stripeSessionId: stripeSessionId || null,
        stripePaymentIntentId: stripePaymentIntentId || null,
      },
    });
    return { success: true };
  } catch (error) {
    console.warn("DB update in markInvoiceAsPaid fallback to local store:", (error as Error).message);
    return { success: true, simulated: true };
  }
}
