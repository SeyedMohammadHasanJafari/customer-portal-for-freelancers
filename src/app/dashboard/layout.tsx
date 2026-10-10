import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import { DashboardTopNav } from "@/components/dashboard-top-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/dashboard");
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar Navigation */}
      <DashboardSidebar user={session.user} />

      {/* Main Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        <DashboardTopNav user={session.user} />
        <div className="flex-1">
          {children}
        </div>
      </div>
    </div>
  );
}
