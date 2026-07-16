"use client";

import { Check, GitCompare } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";

import { ComparisonTable } from "@/components/compare/comparison-table";
import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { PageHeader } from "@/components/common/page-header";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { usePapers } from "@/lib/hooks/use-papers";
import { cn } from "@/lib/utils";
import type { Paper } from "@/types";

const MAX_SELECTION = 4;

export default function ComparePage() {
  return (
    <Suspense fallback={<Skeleton className="m-8 h-64" />}>
      <CompareView />
    </Suspense>
  );
}

function CompareView() {
  const searchParams = useSearchParams();
  const { data: papers, isLoading, isError, refetch } = usePapers();

  const [selected, setSelected] = useState<string[]>(() => {
    const param = searchParams.get("papers");
    return param ? param.split(",").filter(Boolean).slice(0, MAX_SELECTION) : [];
  });

  const selectedPapers = useMemo(
    () =>
      selected
        .map((id) => papers?.find((paper) => paper.id === id))
        .filter((paper): paper is Paper => Boolean(paper)),
    [selected, papers],
  );

  function toggle(id: string) {
    setSelected((current) => {
      if (current.includes(id)) return current.filter((item) => item !== id);
      if (current.length >= MAX_SELECTION) return current;
      return [...current, id];
    });
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Compare papers"
        description={`Select up to ${MAX_SELECTION} papers to compare side by side.`}
      />

      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : isLoading || !papers ? (
        <Skeleton className="h-24 w-full" />
      ) : (
        <>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Select papers
              </span>
              <span className="text-xs text-muted-foreground">
                {selected.length}/{MAX_SELECTION} selected
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {papers.map((paper) => {
                const active = selected.includes(paper.id);
                const disabled = !active && selected.length >= MAX_SELECTION;
                return (
                  <button
                    key={paper.id}
                    type="button"
                    onClick={() => toggle(paper.id)}
                    disabled={disabled}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs transition-colors disabled:opacity-40",
                      active
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/50",
                    )}
                  >
                    {active ? <Check className="size-3.5" /> : null}
                    <span className="max-w-52 truncate">{paper.title}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedPapers.length < 2 ? (
            <EmptyState
              icon={GitCompare}
              title="Select at least two papers"
              description="Pick papers above to generate a side-by-side comparison across method, dataset, results, and more."
            />
          ) : (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <Badge variant="accent">AI comparison</Badge>
                <span className="text-xs text-muted-foreground">
                  Placeholder — backend not connected
                </span>
              </div>
              <ComparisonTable papers={selectedPapers} onRemove={(paper) => toggle(paper.id)} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
