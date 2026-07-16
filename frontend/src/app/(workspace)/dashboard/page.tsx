"use client";

import {
  Boxes,
  Database,
  FileText,
  FlaskConical,
  HardDrive,
  MessageSquareText,
  Upload,
} from "lucide-react";

import { PageHeader } from "@/components/common/page-header";
import { ErrorState } from "@/components/common/error-state";
import { StatisticsCard, StatisticsCardSkeleton } from "@/components/dashboard/statistics-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDashboard } from "@/lib/hooks/use-dashboard";
import { formatBytes, formatCompactNumber, formatRelativeTime } from "@/lib/utils";

export default function DashboardPage() {
  const { data, isLoading, isError, refetch } = useDashboard();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Dashboard"
        description="Your research workspace at a glance."
        actions={
          <Button>
            <Upload /> Upload papers
          </Button>
        }
      />

      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : (
        <>
          <section className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
            {isLoading || !data
              ? Array.from({ length: 6 }).map((_, index) => <StatisticsCardSkeleton key={index} />)
              : [
                  {
                    label: "Papers",
                    value: formatCompactNumber(data.stats.papers),
                    icon: FileText,
                  },
                  { label: "Chunks", value: formatCompactNumber(data.stats.chunks), icon: Boxes },
                  {
                    label: "Embeddings",
                    value: formatCompactNumber(data.stats.embeddings),
                    icon: Database,
                  },
                  {
                    label: "Queries",
                    value: formatCompactNumber(data.stats.queries),
                    icon: MessageSquareText,
                  },
                  {
                    label: "Experiments",
                    value: formatCompactNumber(data.stats.experiments),
                    icon: FlaskConical,
                  },
                  {
                    label: "Storage",
                    value: formatBytes(data.stats.storageBytes),
                    icon: HardDrive,
                  },
                ].map((stat) => <StatisticsCard key={stat.label} {...stat} />)}
          </section>

          <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Recent activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {isLoading || !data
                  ? Array.from({ length: 4 }).map((_, index) => (
                      <StatisticsCardSkeleton key={index} />
                    ))
                  : data.activity.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center justify-between rounded-lg border border-border px-4 py-3"
                      >
                        <span className="truncate text-sm text-foreground">{item.title}</span>
                        <span className="ml-3 shrink-0 text-xs text-muted-foreground">
                          {formatRelativeTime(item.timestamp)}
                        </span>
                      </div>
                    ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pinned projects</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {isLoading || !data
                  ? Array.from({ length: 2 }).map((_, index) => (
                      <StatisticsCardSkeleton key={index} />
                    ))
                  : data.pinnedProjects.map((project) => (
                      <div
                        key={project.id}
                        className="flex items-center gap-3 rounded-lg border border-border px-4 py-3"
                      >
                        <span
                          className="size-2.5 shrink-0 rounded-full"
                          style={{ backgroundColor: project.color }}
                        />
                        <span className="min-w-0 flex-1 truncate text-sm text-foreground">
                          {project.name}
                        </span>
                        <span className="shrink-0 text-xs text-muted-foreground">
                          {project.paperCount}
                        </span>
                      </div>
                    ))}
              </CardContent>
            </Card>
          </section>

          <p className="text-center text-xs text-muted-foreground">
            UI-0 foundation — dashboard content is placeholder data. Full pages arrive in the next
            steps.
          </p>
        </>
      )}
    </div>
  );
}
