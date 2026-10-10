import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { getProjectById } from "@/lib/services/projects";
import { ProjectDetailView } from "@/components/project-detail-view";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const session = await auth();
  const userId = session?.user?.id || "demo-user";
  const isDemo = Boolean(
    session?.user?.email === "demo@luminaportal.com" ||
    (session?.user?.role === "DEMO" && session?.user?.email?.toLowerCase().includes("demo"))
  );

  const project = await getProjectById(id, userId, isDemo);

  if (!project) {
    notFound();
  }

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ProjectDetailView project={project} />
    </div>
  );
}
