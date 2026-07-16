"use client";

import { Boxes, Brain, Layers, Loader2, Ruler } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn, formatDate } from "@/lib/utils";
import type { Experiment, ExperimentStatus } from "@/types";

const STATUS_VARIANT: Record<
  ExperimentStatus,
  "success" | "warning" | "secondary" | "destructive"
> = {
  completed: "success",
  running: "warning",
  queued: "secondary",
  failed: "destructive",
};

export function ExperimentCard({ experiment }: { experiment: Experiment }) {
  return (
    <Card className="flex flex-col p-5">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-foreground">{experiment.name}</h3>
          <p className="mt-0.5 text-xs text-muted-foreground">{formatDate(experiment.createdAt)}</p>
        </div>
        <Badge variant={STATUS_VARIANT[experiment.status]} className="shrink-0 capitalize">
          {experiment.status === "running" ? (
            <Loader2 className="mr-1 size-3 animate-spin" />
          ) : null}
          {experiment.status}
        </Badge>
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
        <ConfigItem icon={Brain} label="Embedding" value={experiment.embeddingModel} />
        <ConfigItem icon={Brain} label="LLM" value={experiment.llm} />
        <ConfigItem icon={Ruler} label="Chunk size" value={String(experiment.chunkSize)} />
        <ConfigItem icon={Layers} label="Overlap" value={String(experiment.overlap)} />
        <ConfigItem
          icon={Boxes}
          label="Retriever"
          value={experiment.retriever}
          className="col-span-2"
        />
      </dl>

      <div className="mt-4 border-t border-border pt-3">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Evaluation metrics
        </p>
        <div className="flex flex-col gap-2">
          {Object.entries(experiment.metrics).map(([key, value]) => (
            <MetricBar key={key} label={key} value={value} />
          ))}
        </div>
      </div>
    </Card>
  );
}

function ConfigItem({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: typeof Brain;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-0 items-center gap-1.5", className)}>
      <Icon className="size-3.5 shrink-0 text-muted-foreground" />
      <dt className="shrink-0 text-muted-foreground">{label}:</dt>
      <dd className="truncate font-medium text-foreground">{value}</dd>
    </div>
  );
}

function MetricBar({ label, value }: { label: string; value: number }) {
  const percent = Math.round(value * 100);
  return (
    <div className="flex items-center gap-2">
      <span className="w-24 shrink-0 text-xs capitalize text-muted-foreground">{label}</span>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
      </div>
      <span className="w-9 shrink-0 text-right text-xs font-medium tabular-nums text-foreground">
        {percent}%
      </span>
    </div>
  );
}
