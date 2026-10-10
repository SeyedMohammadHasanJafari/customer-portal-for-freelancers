import { getClientPortalData } from "@/lib/services/portal";
import { ClientPortalView } from "@/components/client-portal-view";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface ClientDemoPortalPageProps {
  searchParams: Promise<{ client?: string }>;
}

export default async function ClientDemoPortalPage({ searchParams }: ClientDemoPortalPageProps) {
  const { client } = await searchParams;
  const identifier = client ? client.trim() : "demo";
  const data = await getClientPortalData(identifier);

  return <ClientPortalView data={data} />;
}
