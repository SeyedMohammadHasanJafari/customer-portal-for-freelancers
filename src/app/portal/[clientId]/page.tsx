import { notFound } from "next/navigation";
import { getClientPortalData } from "@/lib/services/portal";
import { ClientPortalView } from "@/components/client-portal-view";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface ClientPortalPageProps {
  params: Promise<{ clientId: string }>;
}

export default async function ClientPortalPage({ params }: ClientPortalPageProps) {
  const { clientId } = await params;

  const data = await getClientPortalData(clientId);

  if (!data || data.projects.length === 0) {
    notFound();
  }

  return <ClientPortalView data={data} />;
}
