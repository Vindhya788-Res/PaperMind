import type { Paper, SearchFilters, SearchMode, SearchResult } from "@/types";
import { mockPapers } from "./mock-data";

const BASE_SCORE: Record<SearchMode, number> = {
  semantic: 0.55,
  hybrid: 0.6,
  keyword: 0.32,
  metadata: 0.4,
};

function tokenize(query: string): string[] {
  return query.toLowerCase().split(/\s+/).filter(Boolean);
}

function haystack(paper: Paper): string {
  return `${paper.title} ${paper.authors.join(" ")} ${paper.venue} ${paper.tags.join(" ")}`.toLowerCase();
}

function scoreFor(paper: Paper, tokens: string[], mode: SearchMode): number {
  const text = haystack(paper);
  const hits = tokens.filter((token) => text.includes(token)).length;
  const ratio = tokens.length > 0 ? hits / tokens.length : 0;
  const score = BASE_SCORE[mode] + ratio * 0.4 + (paper.favorite ? 0.02 : 0);
  return Math.min(0.99, Number(score.toFixed(2)));
}

function matchesFilters(paper: Paper, filters: SearchFilters): boolean {
  if (filters.author && !paper.authors.includes(filters.author)) return false;
  if (filters.year && paper.year !== filters.year) return false;
  if (filters.venue && paper.venue !== filters.venue) return false;
  return true;
}

/**
 * Mock search over the paper collection. Keyword and metadata modes require an
 * explicit term match; semantic and hybrid modes rank the whole collection to
 * emulate embedding-based recall. Replaced by the retrieval backend later.
 */
export function runSearch(query: string, mode: SearchMode, filters: SearchFilters): SearchResult[] {
  const tokens = tokenize(query);
  if (tokens.length === 0) return [];

  const requiresMatch = mode === "keyword" || mode === "metadata";

  return mockPapers
    .filter((paper) => matchesFilters(paper, filters))
    .map((paper) => ({ paper, hits: tokens.filter((t) => haystack(paper).includes(t)).length }))
    .filter(({ hits }) => (requiresMatch ? hits > 0 : true))
    .map(({ paper }) => ({
      id: `${paper.id}-result`,
      paperId: paper.id,
      title: paper.title,
      authors: paper.authors,
      year: paper.year,
      venue: paper.venue,
      tags: paper.tags,
      score: scoreFor(paper, tokens, mode),
      summary: `${paper.tags.join(", ")} · ${paper.venue} ${paper.year}. Placeholder summary generated for the query.`,
      snippet: `…a relevant passage discussing “${query}” appears in this work, connecting ${paper.tags[0] ?? "the topic"} to the reported results…`,
      page: (paper.title.length % 8) + 1,
    }))
    .sort((a, b) => b.score - a.score);
}
