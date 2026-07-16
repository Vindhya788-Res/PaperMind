"use client";

import { ArrowUpRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Citation } from "@/types";

interface CitationCardProps {
  citation: Citation;
  onJumpToSource?: (page: number) => void;
}

export function CitationCard({ citation, onJumpToSource }: CitationCardProps) {
  return (
    <Card className="p-3">
      <div className="flex items-start gap-2">
        <span className="mt-0.5 shrink-0 font-mono text-xs font-semibold text-primary">
          {citation.label}
        </span>
        <p className="text-sm leading-snug text-foreground">{citation.text}</p>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">Page {citation.page}</span>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
          onClick={() => onJumpToSource?.(citation.page)}
        >
          Jump to source <ArrowUpRight className="size-3.5" />
        </Button>
      </div>
    </Card>
  );
}
