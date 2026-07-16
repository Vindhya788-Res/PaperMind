"use client";

import { BookOpen, GitCompare } from "lucide-react";
import { useRouter } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { SearchResult } from "@/types";

interface SearchResultsProps {
  results: SearchResult[];
}

export function SearchResults({ results }: SearchResultsProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-3">
      {results.map((result) => (
        <Card key={result.id} className="p-5 transition-colors hover:border-primary/40">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <button
                type="button"
                onClick={() => router.push(`/library/${result.paperId}`)}
                className="text-left"
              >
                <h3 className="text-sm font-semibold leading-snug text-foreground hover:text-primary">
                  {result.title}
                </h3>
              </button>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {result.authors.join(", ")} · {result.year} · {result.venue}
              </p>
            </div>
            <ScoreBadge score={result.score} />
          </div>

          <p className="mt-3 text-sm text-muted-foreground">{result.summary}</p>

          <blockquote className="mt-3 border-l-2 border-primary/40 bg-accent/40 px-3 py-2 text-sm italic text-foreground">
            {result.snippet}
          </blockquote>

          <div className="mt-3 flex items-center justify-between">
            <div className="flex flex-wrap gap-1.5">
              {result.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex shrink-0 items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(`/library/${result.paperId}`)}
              >
                <BookOpen /> Open
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.push(`/compare?papers=${result.paperId}`)}
              >
                <GitCompare /> Compare
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const percent = Math.round(score * 100);
  const tone =
    score >= 0.8 ? "text-success" : score >= 0.6 ? "text-primary" : "text-muted-foreground";
  return (
    <div className="flex shrink-0 flex-col items-end">
      <span className={cn("text-sm font-semibold tabular-nums", tone)}>{percent}%</span>
      <span className="text-[10px] uppercase tracking-wide text-muted-foreground">match</span>
    </div>
  );
}

export function SearchResultsSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} className="p-5">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="mt-2 h-3 w-1/3" />
          <Skeleton className="mt-3 h-3 w-full" />
          <Skeleton className="mt-3 h-12 w-full" />
        </Card>
      ))}
    </div>
  );
}
