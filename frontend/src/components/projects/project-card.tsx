"use client";

import { FileText, MoreVertical, Pencil, Pin, PinOff, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatRelativeTime } from "@/lib/utils";
import type { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
  onOpen?: (project: Project) => void;
  onRename?: (project: Project) => void;
  onTogglePin?: (project: Project) => void;
  onDelete?: (project: Project) => void;
}

export function ProjectCard({
  project,
  onOpen,
  onRename,
  onTogglePin,
  onDelete,
}: ProjectCardProps) {
  return (
    <Card className="flex flex-col p-5 transition-colors hover:border-primary/40">
      <div className="flex items-start justify-between gap-2">
        <button
          type="button"
          onClick={() => onOpen?.(project)}
          className="min-w-0 flex-1 text-left"
        >
          <div className="flex items-center gap-2">
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: project.color }}
            />
            <h3 className="truncate text-sm font-semibold text-foreground">{project.name}</h3>
            {project.pinned ? <Pin className="size-3.5 shrink-0 text-muted-foreground" /> : null}
          </div>
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" aria-label="Project actions">
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onRename?.(project)}>
              <Pencil /> Rename
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onTogglePin?.(project)}>
              {project.pinned ? <PinOff /> : <Pin />}
              {project.pinned ? "Unpin" : "Pin"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete?.(project)}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <p className="mt-2 line-clamp-2 text-xs text-muted-foreground">{project.description}</p>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <FileText className="size-3.5" /> {project.paperCount} papers
        </span>
        <span className="text-xs text-muted-foreground">
          {formatRelativeTime(project.updatedAt)}
        </span>
      </div>
    </Card>
  );
}
