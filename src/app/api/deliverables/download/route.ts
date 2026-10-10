import { NextRequest, NextResponse } from "next/server";
import { generateDeliverablePdf } from "@/lib/services/deliverable-pdf";
import { getAllLocalProjects } from "@/lib/project-store";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const rawName = searchParams.get("name") || "Deliverable_Handover_Asset.pdf";
    const deliverableId = searchParams.get("id") || "del-1";
    let companyName = searchParams.get("client") || "";
    let projectName = searchParams.get("project") || "";
    const freelancerName = searchParams.get("freelancer") || "Mohamad Jafari";
    const freelancerAgency = searchParams.get("agency") || "Lumina Studio";

    // Attempt to pull latest tasks and client from local project store if available
    let tasks: Array<{ title: string; status: string }> = [];
    const localProjects = getAllLocalProjects();
    const matchedProject = localProjects.find(
      (p) =>
        (projectName && p.title.toLowerCase().includes(projectName.toLowerCase())) ||
        p.deliverables?.some((d) => d.id === deliverableId || d.name === rawName) ||
        localProjects.length === 1
    );

    if (matchedProject) {
      if (!projectName) projectName = matchedProject.title;
      if (!companyName && matchedProject.client?.companyName) {
        companyName = matchedProject.client.companyName;
      }
      if (matchedProject.tasks && matchedProject.tasks.length > 0) {
        tasks = matchedProject.tasks.map((t) => ({
          title: t.title,
          status: t.status,
        }));
      }
    }

    if (!companyName) companyName = "Apex Tech Labs";
    if (!projectName) projectName = "Client Production Deliverable";

    const pdfBytes = await generateDeliverablePdf({
      deliverableName: rawName,
      projectName,
      companyName,
      freelancerName,
      freelancerAgency,
      tasks,
      deliverableId,
    });

    const safeFilename = rawName.toLowerCase().endsWith(".pdf")
      ? rawName
      : `${rawName.replace(/\.[^/.]+$/, "")}.pdf`;

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${safeFilename}"`,
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("Error generating deliverable PDF:", error);
    return new NextResponse("Failed to generate deliverable PDF", { status: 500 });
  }
}
