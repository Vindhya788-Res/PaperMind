import { FileText } from "lucide-react";
import { notFound } from "next/navigation";

import { EmptyState } from "@/components/common/empty-state";
import { PageHeader } from "@/components/common/page-header";
import { mockPapers } from "@/lib/api/mock-data";

export default async function PaperViewerPage({
  params,
}: {
  params: Promise<{ paperId: string }>;
}) {
  const { paperId } = await params;
  const paper = mockPapers.find((item) => item.id === paperId);

  if (!paper) notFound();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <PageHeader
        title={paper.title}
        description={`${paper.authors.join(", ")} · ${paper.year} · ${paper.venue}`}
      />
      <EmptyState
        icon={FileText}
        title="Split-screen PDF viewer is coming in step UI-3"
        description="This page will show the PDF alongside tabs for summary, notes, chat, citations, and highlights."
      />
    </div>
  );
}
