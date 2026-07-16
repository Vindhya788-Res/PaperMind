import { notFound } from "next/navigation";

import { PaperWorkspace } from "@/components/papers/paper-workspace";
import { mockPapers } from "@/lib/api/mock-data";

export default async function PaperViewerPage({
  params,
}: {
  params: Promise<{ paperId: string }>;
}) {
  const { paperId } = await params;

  if (!mockPapers.some((item) => item.id === paperId)) notFound();

  return <PaperWorkspace paperId={paperId} />;
}
