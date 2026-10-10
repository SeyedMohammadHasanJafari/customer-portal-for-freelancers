import { auth } from "@/auth";
import { getProjects } from "@/lib/services/projects";
import { ProjectsView } from "@/components/projects-view";

export default async function ProjectsPage() {
  const session = await auth();
  const userId = session?.user?.id || "demo-user";
  const isDemo = Boolean(
    session?.user?.email === "demo@luminaportal.com" ||
    (session?.user?.role === "DEMO" && session?.user?.email?.toLowerCase().includes("demo"))
  );

  const projects = await getProjects(userId, isDemo);

  return (
    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <ProjectsView initialProjects={projects} />
    </div>
  );
}
