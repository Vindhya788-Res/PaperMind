"use client";

import { Boxes, FileText, FlaskConical, Notebook, Upload } from "lucide-react";
import { useRouter } from "next/navigation";

import { ErrorState } from "@/components/common/error-state";
import { PageHeader } from "@/components/common/page-header";
import { StatisticsCard, StatisticsCardSkeleton } from "@/components/dashboard/statistics-card";
import { NoteEditor } from "@/components/notes/note-editor";
import { PaperList } from "@/components/papers/paper-list";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCompactNumber } from "@/lib/utils";
import { useProjectDetail } from "@/lib/hooks/use-projects";
import { useUiStore } from "@/stores/ui-store";

export function ProjectDashboard({ projectId }: { projectId: string }) {
  const router = useRouter();
  const openUpload = useUiStore((state) => state.openUpload);
  const { data, isLoading, isError, refetch } = useProjectDetail(projectId);

  if (isError) {
    return (
      <div className="p-6">
        <ErrorState onRetry={() => refetch()} />
      </div>
    );
  }

  const project = data?.project;

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <PageHeader
        title={project?.name ?? "Project"}
        description={project?.description}
        actions={
          <Button onClick={openUpload}>
            <Upload /> Add papers
          </Button>
        }
      />

      {project ? (
        <div className="flex items-center gap-2">
          <span className="size-2.5 rounded-full" style={{ backgroundColor: project.color }} />
          {project.pinned ? <Badge variant="secondary">Pinned</Badge> : null}
        </div>
      ) : null}

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {isLoading || !data
          ? Array.from({ length: 4 }).map((_, index) => <StatisticsCardSkeleton key={index} />)
          : [
              { label: "Papers", value: formatCompactNumber(data.stats.papers), icon: FileText },
              { label: "Notes", value: formatCompactNumber(data.stats.notes), icon: Notebook },
              {
                label: "Experiments",
                value: formatCompactNumber(data.stats.experiments),
                icon: FlaskConical,
              },
              { label: "Chunks", value: formatCompactNumber(data.stats.chunks), icon: Boxes },
            ].map((stat) => <StatisticsCard key={stat.label} {...stat} />)}
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent files</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading || !data ? (
              <div className="flex flex-col gap-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <StatisticsCardSkeleton key={index} />
                ))}
              </div>
            ) : (
              <PaperList
                papers={data.recentPapers}
                view="list"
                onOpen={(paper) => router.push(`/library/${paper.id}`)}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Project notes</CardTitle>
          </CardHeader>
          <CardContent>
            <NoteEditor />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
