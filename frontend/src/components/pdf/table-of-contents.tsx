"use client";

import { cn } from "@/lib/utils";
import type { TocEntry } from "@/types";

interface TableOfContentsProps {
  entries: TocEntry[];
  currentPage: number;
  onSelect: (page: number) => void;
}

export function TableOfContents({ entries, currentPage, onSelect }: TableOfContentsProps) {
  return (
    <nav className="w-52 shrink-0 border-r border-border bg-card/50 p-2">
      <p className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        Contents
      </p>
      <ul className="flex flex-col">
        {entries.map((entry) => {
          const active = currentPage >= entry.page;
          return (
            <li key={`${entry.title}-${entry.page}`}>
              <button
                type="button"
                onClick={() => onSelect(entry.page)}
                className={cn(
                  "flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                  active ? "text-foreground" : "text-muted-foreground",
                )}
              >
                <span className="truncate">{entry.title}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{entry.page}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
