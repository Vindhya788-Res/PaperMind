"use client";

import { useQuery } from "@tanstack/react-query";

import { api, queryKeys } from "@/lib/api";
import type { SearchFilters, SearchMode } from "@/types";

/** Runs a search when a non-empty query is provided. */
export function useSearch(query: string, mode: SearchMode, filters: SearchFilters) {
  const trimmed = query.trim();
  return useQuery({
    queryKey: queryKeys.search(trimmed, mode, filters),
    queryFn: () => api.search(trimmed, mode, filters),
    enabled: trimmed.length > 0,
  });
}
