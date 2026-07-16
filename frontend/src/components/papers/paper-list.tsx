"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Paper } from "@/types";
import { PaperCard, type PaperView } from "./paper-card";

interface PaperListProps {
  papers: Paper[];
  view?: PaperView;
  onOpen?: (paper: Paper) => void;
  onCompare?: (paper: Paper) => void;
  onToggleFavorite?: (paper: Paper) => void;
  onDelete?: (paper: Paper) => void;
}

export function PaperList({ papers, view = "grid", ...handlers }: PaperListProps) {
  return (
    <div
      className={cn(
        view === "grid"
          ? "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
          : "flex flex-col gap-3",
      )}
    >
      {papers.map((paper) => (
        <PaperCard key={paper.id} paper={paper} view={view} {...handlers} />
      ))}
    </div>
  );
}

export function PaperListSkeleton({ view = "grid" }: { view?: PaperView }) {
  const count = view === "grid" ? 6 : 5;
  return (
    <div
      className={cn(
        view === "grid"
          ? "grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
          : "flex flex-col gap-3",
      )}
    >
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} className={cn("p-5", view === "list" && "p-4")}>
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="mt-2 h-3 w-1/2" />
          {view === "grid" ? (
            <>
              <div className="mt-3 flex gap-1.5">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-16 rounded-full" />
              </div>
              <Skeleton className="mt-4 h-8 w-full" />
            </>
          ) : null}
        </Card>
      ))}
    </div>
  );
}
