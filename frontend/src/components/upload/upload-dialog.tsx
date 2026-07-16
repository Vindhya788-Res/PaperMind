"use client";

import { AlertCircle, CheckCircle2, FileText, Loader2, UploadCloud, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { mockPapers } from "@/lib/api/mock-data";
import { cn, formatBytes } from "@/lib/utils";

type UploadStatus = "duplicate" | "processing" | "done" | "error";

interface UploadItem {
  id: string;
  name: string;
  size: number;
  status: UploadStatus;
  progress: number;
}

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const TICK_MS = 250;

/** Normalizes a title or filename for loose duplicate matching. */
function normalize(value: string): string {
  return value
    .replace(/\.pdf$/i, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const existingTitles = new Set(mockPapers.map((paper) => normalize(paper.title)));

function phaseLabel(item: UploadItem): string {
  if (item.status === "duplicate") return "Possible duplicate";
  if (item.status === "done") return "Ready";
  if (item.status === "error") return "Failed";
  if (item.progress < 50) return "Uploading…";
  if (item.progress < 75) return "Extracting metadata…";
  return "Chunking & embedding…";
}

export function UploadDialog({ open, onOpenChange }: UploadDialogProps) {
  const [items, setItems] = useState<UploadItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const timers = useRef(new Map<string, ReturnType<typeof setInterval>>());

  const clearTimer = useCallback((id: string) => {
    const timer = timers.current.get(id);
    if (timer) {
      clearInterval(timer);
      timers.current.delete(id);
    }
  }, []);

  const startProcessing = useCallback(
    (id: string) => {
      clearTimer(id);
      const timer = setInterval(() => {
        setItems((current) =>
          current.map((item) => {
            if (item.id !== id) return item;
            const next = Math.min(100, item.progress + 8 + Math.random() * 12);
            if (next >= 100) {
              clearTimer(id);
              return { ...item, progress: 100, status: "done" };
            }
            return { ...item, progress: next };
          }),
        );
      }, TICK_MS);
      timers.current.set(id, timer);
    },
    [clearTimer],
  );

  const addFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList) return;
      const pdfs = Array.from(fileList).filter((file) => file.name.toLowerCase().endsWith(".pdf"));

      setItems((current) => {
        const seen = new Set(current.map((item) => normalize(item.name)));
        const additions: UploadItem[] = [];

        for (const file of pdfs) {
          const key = normalize(file.name);
          const isDuplicate = existingTitles.has(key) || seen.has(key);
          seen.add(key);
          const id = `${file.name}-${file.size}-${crypto.randomUUID()}`;
          additions.push({
            id,
            name: file.name,
            size: file.size,
            status: isDuplicate ? "duplicate" : "processing",
            progress: 0,
          });
          if (!isDuplicate) {
            queueMicrotask(() => startProcessing(id));
          }
        }
        return [...current, ...additions];
      });
    },
    [startProcessing],
  );

  const removeItem = useCallback(
    (id: string) => {
      clearTimer(id);
      setItems((current) => current.filter((item) => item.id !== id));
    },
    [clearTimer],
  );

  const uploadAnyway = useCallback(
    (id: string) => {
      setItems((current) =>
        current.map((item) => (item.id === id ? { ...item, status: "processing" } : item)),
      );
      startProcessing(id);
    },
    [startProcessing],
  );

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setIsDragging(false);
      addFiles(event.dataTransfer.files);
    },
    [addFiles],
  );

  useEffect(() => {
    const activeTimers = timers.current;
    return () => {
      activeTimers.forEach((timer) => clearInterval(timer));
      activeTimers.clear();
    };
  }, []);

  function handleOpenChange(next: boolean) {
    if (!next) {
      timers.current.forEach((timer) => clearInterval(timer));
      timers.current.clear();
      setItems([]);
      setIsDragging(false);
    }
    onOpenChange(next);
  }

  const activeCount = items.filter((item) => item.status === "processing").length;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Upload papers</DialogTitle>
          <DialogDescription>
            Drag & drop PDF files or browse. Metadata extraction and processing start automatically.
          </DialogDescription>
        </DialogHeader>

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={cn(
            "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center transition-colors",
            isDragging
              ? "border-primary bg-primary/5"
              : "border-border hover:border-primary/50 hover:bg-accent/50",
          )}
        >
          <div className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <UploadCloud className="size-6" />
          </div>
          <p className="text-sm font-medium text-foreground">
            Drop PDFs here or <span className="text-primary">browse</span>
          </p>
          <p className="text-xs text-muted-foreground">Supports multiple PDF files</p>
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="application/pdf,.pdf"
          multiple
          hidden
          onChange={(event) => {
            addFiles(event.target.files);
            event.target.value = "";
          }}
        />

        {items.length > 0 ? (
          <div className="flex max-h-64 flex-col gap-2 overflow-y-auto pr-1">
            {items.map((item) => (
              <UploadRow
                key={item.id}
                item={item}
                onRemove={() => removeItem(item.id)}
                onUploadAnyway={() => uploadAnyway(item.id)}
              />
            ))}
          </div>
        ) : null}

        <DialogFooter>
          <div className="mr-auto flex items-center text-xs text-muted-foreground">
            {items.length > 0
              ? `${items.length} file${items.length > 1 ? "s" : ""}${
                  activeCount > 0 ? ` · ${activeCount} processing` : ""
                }`
              : "No files added yet"}
          </div>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>
            {items.some((item) => item.status === "done") ? "Done" : "Cancel"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function UploadRow({
  item,
  onRemove,
  onUploadAnyway,
}: {
  item: UploadItem;
  onRemove: () => void;
  onUploadAnyway: () => void;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border p-3">
      <StatusIcon status={item.status} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-medium text-foreground">{item.name}</span>
          <span className="shrink-0 text-xs text-muted-foreground">{formatBytes(item.size)}</span>
        </div>
        {item.status === "processing" ? (
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-200"
              style={{ width: `${item.progress}%` }}
            />
          </div>
        ) : null}
        <p
          className={cn(
            "mt-1 text-xs",
            item.status === "duplicate"
              ? "text-warning"
              : item.status === "done"
                ? "text-success"
                : "text-muted-foreground",
          )}
        >
          {phaseLabel(item)}
        </p>
      </div>

      {item.status === "duplicate" ? (
        <Button variant="ghost" size="sm" onClick={onUploadAnyway}>
          Upload anyway
        </Button>
      ) : null}
      <Button variant="ghost" size="icon-sm" aria-label="Remove file" onClick={onRemove}>
        <X className="size-4" />
      </Button>
    </div>
  );
}

function StatusIcon({ status }: { status: UploadStatus }) {
  const className = "size-5 shrink-0";
  if (status === "done") return <CheckCircle2 className={cn(className, "text-success")} />;
  if (status === "duplicate") return <AlertCircle className={cn(className, "text-warning")} />;
  if (status === "error") return <AlertCircle className={cn(className, "text-destructive")} />;
  if (status === "processing")
    return <Loader2 className={cn(className, "animate-spin text-primary")} />;
  return <FileText className={cn(className, "text-muted-foreground")} />;
}
