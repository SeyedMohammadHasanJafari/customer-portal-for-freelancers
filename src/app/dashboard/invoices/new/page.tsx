import { auth } from "@/auth";
import { getProjects } from "@/lib/services/projects";
import { NewInvoiceForm } from "@/components/new-invoice-form";

export default async function NewInvoicePage() {
  const session = await auth();
  const userId = session?.user?.id || "demo-user";
  const isDemo = Boolean(
    session?.user?.email === "demo@luminaportal.com" ||
    (session?.user?.role === "DEMO" && session?.user?.email?.toLowerCase().includes("demo"))
  );

  const projects = await getProjects(userId, isDemo);

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <NewInvoiceForm projects={projects} />
    </div>
  );
}
