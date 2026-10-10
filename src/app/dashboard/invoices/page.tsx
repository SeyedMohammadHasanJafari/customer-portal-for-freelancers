import { auth } from "@/auth";
import { getFreelancerDashboardData } from "@/lib/services/dashboard";
import { InvoicesView } from "@/components/invoices-view";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function InvoicesPage() {
  const session = await auth();
  const userId = session?.user?.id || "demo-user";
  const isDemo = Boolean(
    session?.user?.email === "demo@luminaportal.com" ||
    (session?.user?.role === "DEMO" && session?.user?.email?.toLowerCase().includes("demo"))
  );

  const data = await getFreelancerDashboardData(userId, isDemo);

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <InvoicesView initialInvoices={data.invoices} />
    </div>
  );
}
