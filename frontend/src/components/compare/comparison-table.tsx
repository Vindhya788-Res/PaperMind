"use client";

import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { buildComparison, COMPARISON_ROWS } from "@/lib/api/comparison";
import type { Paper } from "@/types";

interface ComparisonTableProps {
  papers: Paper[];
  onRemove?: (paper: Paper) => void;
}

export function ComparisonTable({ papers, onRemove }: ComparisonTableProps) {
  const comparisons = papers.map((paper) => ({ paper, values: buildComparison(paper) }));

  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="sticky left-0 z-10 w-36 bg-muted/50 p-3 text-left align-bottom text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Attribute
            </th>
            {comparisons.map(({ paper }) => (
              <th key={paper.id} className="min-w-56 p-3 text-left align-bottom">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold leading-snug text-foreground">{paper.title}</p>
                    <p className="mt-0.5 text-xs font-normal text-muted-foreground">
                      {paper.authors[0]} et al. · {paper.year}
                    </p>
                  </div>
                  {onRemove ? (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label={`Remove ${paper.title}`}
                      onClick={() => onRemove(paper)}
                    >
                      <X className="size-4" />
                    </Button>
                  ) : null}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {COMPARISON_ROWS.map((row) => (
            <tr key={row} className="border-b border-border last:border-0">
              <th className="sticky left-0 z-10 bg-card p-3 text-left align-top text-xs font-medium text-muted-foreground">
                {row}
              </th>
              {comparisons.map(({ paper, values }) => (
                <td key={paper.id} className="p-3 align-top text-foreground">
                  {values[row]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
