import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StatisticsCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  hint?: string;
}

export function StatisticsCard({ label, value, icon: Icon, hint }: StatisticsCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-4.5" />
        </div>
      </div>
      <div className="mt-3 text-2xl font-semibold tracking-tight text-foreground">{value}</div>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </Card>
  );
}

export function StatisticsCardSkeleton() {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="size-9 rounded-lg" />
      </div>
      <Skeleton className="mt-3 h-7 w-24" />
      <Skeleton className="mt-2 h-3 w-16" />
    </Card>
  );
}
