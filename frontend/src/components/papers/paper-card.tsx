"use client";

import { BookOpen, Bookmark, GitCompare, MoreVertical, Trash2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn, formatDate } from "@/lib/utils";
import type { Paper } from "@/types";

export type PaperView = "grid" | "list";

interface PaperCardProps {
  paper: Paper;
  view?: PaperView;
  onOpen?: (paper: Paper) => void;
  onCompare?: (paper: Paper) => void;
  onToggleFavorite?: (paper: Paper) => void;
  onDelete?: (paper: Paper) => void;
}

export function PaperCard({
  paper,
  view = "grid",
  onOpen,
  onCompare,
  onToggleFavorite,
  onDelete,
}: PaperCardProps) {
  const meta = `${paper.authors.join(", ")} · ${paper.year} · ${paper.venue}`;

  const bookmark = (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label={paper.favorite ? "Remove bookmark" : "Bookmark"}
          aria-pressed={paper.favorite}
          onClick={() => onToggleFavorite?.(paper)}
        >
          <Bookmark className={cn("size-4", paper.favorite && "fill-primary text-primary")} />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{paper.favorite ? "Bookmarked" : "Bookmark"}</TooltipContent>
    </Tooltip>
  );

  const overflowMenu = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label="More actions">
          <MoreVertical className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => onOpen?.(paper)}>
          <BookOpen /> Open
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onCompare?.(paper)}>
          <GitCompare /> Compare
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => onDelete?.(paper)}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  if (view === "list") {
    return (
      <Card className="flex items-center gap-4 p-4 transition-colors hover:border-primary/40">
        <button type="button" onClick={() => onOpen?.(paper)} className="min-w-0 flex-1 text-left">
          <h3 className="truncate text-sm font-semibold text-foreground">{paper.title}</h3>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">{meta}</p>
        </button>
        <div className="hidden shrink-0 items-center gap-1.5 md:flex">
          {paper.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <span className="hidden shrink-0 text-xs text-muted-foreground lg:block">
          {formatDate(paper.uploadedAt)}
        </span>
        <div className="flex shrink-0 items-center gap-0.5">
          {bookmark}
          {overflowMenu}
        </div>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col p-5 transition-colors hover:border-primary/40">
      <div className="flex items-start justify-between gap-2">
        <button type="button" onClick={() => onOpen?.(paper)} className="min-w-0 flex-1 text-left">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">
            {paper.title}
          </h3>
        </button>
        {bookmark}
      </div>

      <p className="mt-2 line-clamp-1 text-xs text-muted-foreground">{meta}</p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {paper.tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        <span className="text-xs text-muted-foreground">{formatDate(paper.uploadedAt)}</span>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={() => onOpen?.(paper)}>
            <BookOpen /> Open
          </Button>
          {overflowMenu}
        </div>
      </div>
    </Card>
  );
}
