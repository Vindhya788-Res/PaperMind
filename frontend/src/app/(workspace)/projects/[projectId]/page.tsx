import { notFound } from "next/navigation";

import { ProjectDashboard } from "@/components/projects/project-dashboard";
import { mockProjects } from "@/lib/api/mock-data";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;

  if (!mockProjects.some((item) => item.id === projectId)) notFound();

  return <ProjectDashboard projectId={projectId} />;
}
