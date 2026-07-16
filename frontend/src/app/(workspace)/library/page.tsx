"use client";

import { useQueryClient } from "@tanstack/react-query";
import { ArrowUpDown, LayoutGrid, Library as LibraryIcon, List, Star, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { PageHeader } from "@/components/common/page-header";
import { PaperList, PaperListSkeleton } from "@/components/papers/paper-list";
import { SearchBar } from "@/components/search/search-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { queryKeys } from "@/lib/api";
import { usePapers } from "@/lib/hooks/use-papers";
import { cn } from "@/lib/utils";
import { useUiStore } from "@/stores/ui-store";
import type { Paper } from "@/types";
import type { PaperView } from "@/components/papers/paper-card";

type SortKey = "recent" | "title" | "year";

const SORT_LABELS: Record<SortKey, string> = {
  recent: "Most recent",
  title: "Title (A–Z)",
  year: "Year (newest)",
};

export default function LibraryPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const openUpload = useUiStore((state) => state.openUpload);
  const { data: papers, isLoading, isError, refetch } = usePapers();

  const [query, setQuery] = useState("");
  const [view, setView] = useState<PaperView>("grid");
  const [sort, setSort] = useState<SortKey>("recent");
  const [activeTags, setActiveTags] = useState<Set<string>>(new Set());
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    papers?.forEach((paper) => paper.tags.forEach((tag) => tags.add(tag)));
    return Array.from(tags).sort();
  }, [papers]);

  const visiblePapers = useMemo(() => {
    if (!papers) return [];
    const normalizedQuery = query.trim().toLowerCase();

    const filtered = papers.filter((paper) => {
      if (favoritesOnly && !paper.favorite) return false;
      if (activeTags.size > 0 && !paper.tags.some((tag) => activeTags.has(tag))) return false;
      if (normalizedQuery) {
        const haystack = `${paper.title} ${paper.authors.join(" ")} ${paper.venue}`.toLowerCase();
        if (!haystack.includes(normalizedQuery)) return false;
      }
      return true;
    });

    return [...filtered].sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      if (sort === "year") return b.year - a.year;
      return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
    });
  }, [papers, query, favoritesOnly, activeTags, sort]);

  function toggleTag(tag: string) {
    setActiveTags((current) => {
      const next = new Set(current);
      if (next.has(tag)) next.delete(tag);
      else next.add(tag);
      return next;
    });
  }

  function updatePapers(updater: (papers: Paper[]) => Paper[]) {
    queryClient.setQueryData<Paper[]>(queryKeys.papers, (old) => (old ? updater(old) : old));
  }

  const handleToggleFavorite = (paper: Paper) =>
    updatePapers((list) =>
      list.map((item) => (item.id === paper.id ? { ...item, favorite: !item.favorite } : item)),
    );
  const handleDelete = (paper: Paper) =>
    updatePapers((list) => list.filter((item) => item.id !== paper.id));
  const handleOpen = (paper: Paper) => router.push(`/library/${paper.id}`);
  const handleCompare = (paper: Paper) => router.push(`/compare?papers=${paper.id}`);

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Library"
        description="Browse, filter, and organize your papers."
        actions={
          <Button onClick={openUpload}>
            <Upload /> Upload
          </Button>
        }
      />

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Search title, author, or venue…"
            className="sm:max-w-sm"
          />
          <div className="flex items-center gap-2 sm:ml-auto">
            <Button
              variant={favoritesOnly ? "secondary" : "outline"}
              size="sm"
              onClick={() => setFavoritesOnly((value) => !value)}
              aria-pressed={favoritesOnly}
            >
              <Star className={cn("size-4", favoritesOnly && "fill-primary text-primary")} />
              Favorites
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <ArrowUpDown /> {SORT_LABELS[sort]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuRadioGroup
                  value={sort}
                  onValueChange={(value) => setSort(value as SortKey)}
                >
                  {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
                    <DropdownMenuRadioItem key={key} value={key}>
                      {SORT_LABELS[key]}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex items-center rounded-md border border-border p-0.5">
              <Button
                variant={view === "grid" ? "secondary" : "ghost"}
                size="icon-sm"
                aria-label="Grid view"
                aria-pressed={view === "grid"}
                onClick={() => setView("grid")}
              >
                <LayoutGrid />
              </Button>
              <Button
                variant={view === "list" ? "secondary" : "ghost"}
                size="icon-sm"
                aria-label="List view"
                aria-pressed={view === "list"}
                onClick={() => setView("list")}
              >
                <List />
              </Button>
            </div>
          </div>
        </div>

        {allTags.length > 0 ? (
          <div className="flex flex-wrap items-center gap-1.5">
            {allTags.map((tag) => {
              const active = activeTags.has(tag);
              return (
                <button key={tag} type="button" onClick={() => toggleTag(tag)}>
                  <Badge
                    variant={active ? "default" : "outline"}
                    className="cursor-pointer transition-colors hover:border-primary/50"
                  >
                    {tag}
                  </Badge>
                </button>
              );
            })}
            {activeTags.size > 0 ? (
              <Button variant="ghost" size="sm" onClick={() => setActiveTags(new Set())}>
                Clear
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>

      {isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : isLoading ? (
        <PaperListSkeleton view={view} />
      ) : visiblePapers.length === 0 ? (
        <EmptyState
          icon={LibraryIcon}
          title="No papers found"
          description={
            papers && papers.length > 0
              ? "Try adjusting your search or filters."
              : "Upload your first paper to start building your library."
          }
          action={
            <Button onClick={openUpload}>
              <Upload /> Upload papers
            </Button>
          }
        />
      ) : (
        <PaperList
          papers={visiblePapers}
          view={view}
          onOpen={handleOpen}
          onCompare={handleCompare}
          onToggleFavorite={handleToggleFavorite}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
