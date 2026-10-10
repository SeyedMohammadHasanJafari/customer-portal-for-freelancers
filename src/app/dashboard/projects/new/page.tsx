import { auth } from "@/auth";
import { getClients } from "@/lib/services/clients";
import { NewProjectForm } from "@/components/new-project-form";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function NewProjectPage() {
  const session = await auth();
  const userId = session?.user?.id || "demo-user";
  const isDemo = Boolean(
    session?.user?.email === "demo@luminaportal.com" ||
    (session?.user?.role === "DEMO" && session?.user?.email?.toLowerCase().includes("demo"))
  );

  const clients = await getClients(userId, isDemo);

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <NewProjectForm clients={clients} />
    </div>
  );
}
