"use client";

import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { useMemo } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockProjects } from "@/lib/api/mock-data";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/stores/ui-store";

export function ProjectSelector() {
  const activeProjectId = useUiStore((state) => state.activeProjectId);
  const setActiveProject = useUiStore((state) => state.setActiveProject);

  const activeProject = useMemo(
    () => mockProjects.find((project) => project.id === activeProjectId) ?? mockProjects[0],
    [activeProjectId],
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex h-9 min-w-0 items-center gap-2 rounded-md border border-border bg-card px-3 text-sm font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <span
          className="size-2.5 shrink-0 rounded-full"
          style={{ backgroundColor: activeProject.color }}
        />
        <span className="max-w-[10rem] truncate">{activeProject.name}</span>
        <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>Projects</DropdownMenuLabel>
        {mockProjects.map((project) => (
          <DropdownMenuItem key={project.id} onClick={() => setActiveProject(project.id)}>
            <span
              className="size-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: project.color }}
            />
            <span className="truncate">{project.name}</span>
            <Check
              className={cn(
                "ml-auto size-4",
                project.id === activeProject.id ? "opacity-100" : "opacity-0",
              )}
            />
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          <Plus /> New project
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
