"use client";

import { ListFilter, SearchX, Sparkles } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useMemo, useState } from "react";

import { EmptyState } from "@/components/common/empty-state";
import { ErrorState } from "@/components/common/error-state";
import { PageHeader } from "@/components/common/page-header";
import { SearchBar } from "@/components/search/search-bar";
import { SearchResults, SearchResultsSkeleton } from "@/components/search/search-results";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { mockPapers } from "@/lib/api/mock-data";
import { useSearch } from "@/lib/hooks/use-search";
import type { SearchMode } from "@/types";

const MODES: Array<{ value: SearchMode; label: string; hint: string }> = [
  { value: "semantic", label: "Semantic", hint: "Embedding-based meaning match" },
  { value: "keyword", label: "Keyword", hint: "Exact term match" },
  { value: "hybrid", label: "Hybrid", hint: "Semantic + keyword" },
  { value: "metadata", label: "Metadata", hint: "Match title, author, venue" },
];

const ALL = "__all__";

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchResultsSkeleton />}>
      <SearchView />
    </Suspense>
  );
}

function SearchView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") ?? "";

  const [query, setQuery] = useState(initialQuery);
  const [activeQuery, setActiveQuery] = useState(initialQuery);
  const [mode, setMode] = useState<SearchMode>("hybrid");
  const [author, setAuthor] = useState<string>(ALL);
  const [year, setYear] = useState<string>(ALL);
  const [venue, setVenue] = useState<string>(ALL);

  const options = useMemo(() => {
    const authors = new Set<string>();
    const years = new Set<number>();
    const venues = new Set<string>();
    mockPapers.forEach((paper) => {
      paper.authors.forEach((name) => authors.add(name));
      years.add(paper.year);
      venues.add(paper.venue);
    });
    return {
      authors: Array.from(authors).sort(),
      years: Array.from(years).sort((a, b) => b - a),
      venues: Array.from(venues).sort(),
    };
  }, []);

  const filters = {
    author: author === ALL ? undefined : author,
    year: year === ALL ? undefined : Number(year),
    venue: venue === ALL ? undefined : venue,
  };

  const { data, isLoading, isError, refetch, isFetching } = useSearch(activeQuery, mode, filters);

  function submit() {
    const trimmed = query.trim();
    setActiveQuery(trimmed);
    const params = new URLSearchParams();
    if (trimmed) params.set("q", trimmed);
    router.replace(`/search${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Search"
        description="Search across your library with multiple retrieval strategies."
      />

      <form
        className="flex flex-col gap-3"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <div className="flex gap-2">
          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Search papers…"
            className="flex-1"
          />
          <Button type="submit">Search</Button>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <div className="flex items-center rounded-lg border border-border p-0.5">
            {MODES.map((item) => (
              <Button
                key={item.value}
                type="button"
                variant={mode === item.value ? "secondary" : "ghost"}
                size="sm"
                aria-pressed={mode === item.value}
                onClick={() => setMode(item.value)}
                title={item.hint}
              >
                {item.value === "semantic" || item.value === "hybrid" ? (
                  <Sparkles className="size-3.5" />
                ) : null}
                {item.label}
              </Button>
            ))}
          </div>

          <span className="mx-1 hidden text-muted-foreground sm:inline">
            <ListFilter className="size-4" />
          </span>

          <FilterDropdown
            label="Author"
            value={author}
            onChange={setAuthor}
            options={options.authors.map((a) => ({ value: a, label: a }))}
          />
          <FilterDropdown
            label="Year"
            value={year}
            onChange={setYear}
            options={options.years.map((y) => ({ value: String(y), label: String(y) }))}
          />
          <FilterDropdown
            label="Venue"
            value={venue}
            onChange={setVenue}
            options={options.venues.map((v) => ({ value: v, label: v }))}
          />
        </div>
      </form>

      {!activeQuery ? (
        <EmptyState
          icon={Sparkles}
          title="Search your library"
          description="Enter a query and choose a retrieval strategy — semantic, keyword, hybrid, or metadata."
        />
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : isLoading ? (
        <SearchResultsSkeleton />
      ) : !data || data.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No matches found"
          description="Try a different query, switch retrieval mode, or clear your filters."
        />
      ) : (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {data.length} result{data.length > 1 ? "s" : ""} for{" "}
              <span className="font-medium text-foreground">“{activeQuery}”</span>
            </p>
            <Badge variant="outline" className="capitalize">
              {isFetching ? "Searching…" : `${mode} search`}
            </Badge>
          </div>
          <SearchResults results={data} />
        </div>
      )}
    </div>
  );
}

function FilterDropdown({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  const active = value !== ALL;
  const current = options.find((option) => option.value === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={active ? "secondary" : "outline"} size="sm">
          {label}
          {active && current ? `: ${current.label}` : ""}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-h-72 overflow-y-auto">
        <DropdownMenuRadioGroup value={value} onValueChange={onChange}>
          <DropdownMenuRadioItem value={ALL}>Any {label.toLowerCase()}</DropdownMenuRadioItem>
          {options.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
