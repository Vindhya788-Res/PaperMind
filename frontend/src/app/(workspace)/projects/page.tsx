"use client";

import { useQueryClient } from "@tanstack/react-query";
import { Plus, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { PageHeader } from "@/components/common/page-header";
import { ProjectCard } from "@/components/projects/project-card";
import { ProjectDialog, type ProjectDialogMode } from "@/components/projects/project-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { queryKeys } from "@/lib/api";
import { useProjects } from "@/lib/hooks/use-projects";
import type { Project } from "@/types";

const PROJECT_COLORS = ["#4f46e5", "#0ea5e9", "#f59e0b", "#10b981", "#ec4899", "#8b5cf6"];

export default function ProjectsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: projects, isLoading, isError, refetch } = useProjects();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<ProjectDialogMode>("create");
  const [editing, setEditing] = useState<Project | null>(null);

  function updateProjects(updater: (projects: Project[]) => Project[]) {
    queryClient.setQueryData<Project[]>(queryKeys.projects, (old) => (old ? updater(old) : old));
  }

  function openCreate() {
    setDialogMode("create");
    setEditing(null);
    setDialogOpen(true);
  }

  function openRename(project: Project) {
    setDialogMode("rename");
    setEditing(project);
    setDialogOpen(true);
  }

  function handleSubmit(values: { name: string; description: string }) {
    if (dialogMode === "create") {
      const project: Project = {
        id: crypto.randomUUID(),
        name: values.name,
        description: values.description,
        paperCount: 0,
        updatedAt: new Date().toISOString(),
        pinned: false,
        color: PROJECT_COLORS[(projects?.length ?? 0) % PROJECT_COLORS.length],
      };
      updateProjects((list) => [project, ...list]);
    } else if (editing) {
      updateProjects((list) =>
        list.map((item) =>
          item.id === editing.id
            ? { ...item, name: values.name, description: values.description }
            : item,
        ),
      );
    }
  }

  const sorted = projects
    ? [...projects].sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      })
    : [];

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Projects"
        description="Group papers, notes, and experiments into research projects."
        actions={
          <Button onClick={openCreate}>
            <Plus /> New project
          </Button>
        }
      />

      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} className="p-5">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="mt-3 h-3 w-full" />
              <Skeleton className="mt-4 h-3 w-1/3" />
            </Card>
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <EmptyState
          icon={Sparkles}
          title="No projects yet"
          description="Create your first project to organize your research."
          action={
            <Button onClick={openCreate}>
              <Plus /> New project
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {sorted.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onOpen={(item) => router.push(`/projects/${item.id}`)}
              onRename={openRename}
              onTogglePin={(item) =>
                updateProjects((list) =>
                  list.map((p) => (p.id === item.id ? { ...p, pinned: !p.pinned } : p)),
                )
              }
              onDelete={(item) => updateProjects((list) => list.filter((p) => p.id !== item.id))}
            />
          ))}
        </div>
      )}

      <ProjectDialog
        open={dialogOpen}
        mode={dialogMode}
        initialName={editing?.name ?? ""}
        initialDescription={editing?.description ?? ""}
        onOpenChange={setDialogOpen}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
