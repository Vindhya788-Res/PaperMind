"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export type ProjectDialogMode = "create" | "rename";

interface ProjectDialogProps {
  open: boolean;
  mode: ProjectDialogMode;
  initialName?: string;
  initialDescription?: string;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: { name: string; description: string }) => void;
}

export function ProjectDialog({
  open,
  mode,
  initialName = "",
  initialDescription = "",
  onOpenChange,
  onSubmit,
}: ProjectDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <ProjectForm
          key={`${mode}:${initialName}`}
          mode={mode}
          initialName={initialName}
          initialDescription={initialDescription}
          onSubmit={(values) => {
            onSubmit(values);
            onOpenChange(false);
          }}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

function ProjectForm({
  mode,
  initialName,
  initialDescription,
  onSubmit,
  onCancel,
}: {
  mode: ProjectDialogMode;
  initialName: string;
  initialDescription: string;
  onSubmit: (values: { name: string; description: string }) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const trimmed = name.trim();
        if (!trimmed) return;
        onSubmit({ name: trimmed, description: description.trim() });
      }}
    >
      <DialogHeader>
        <DialogTitle>{mode === "create" ? "New project" : "Rename project"}</DialogTitle>
        <DialogDescription>
          {mode === "create"
            ? "Group papers, notes, and experiments into a research project."
            : "Update the project name and description."}
        </DialogDescription>
      </DialogHeader>

      <div className="mt-4 flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="project-name" className="text-sm font-medium text-foreground">
            Name
          </label>
          <Input
            id="project-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="e.g. RAG Retrieval Survey"
            autoFocus
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="project-description" className="text-sm font-medium text-foreground">
            Description
          </label>
          <Textarea
            id="project-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="What is this project about?"
            className="min-h-24 resize-none"
          />
        </div>
      </div>

      <DialogFooter className="mt-6">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={!name.trim()}>
          {mode === "create" ? "Create project" : "Save changes"}
        </Button>
      </DialogFooter>
    </form>
  );
}
