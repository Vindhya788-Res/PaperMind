"use client";

import { useQuery } from "@tanstack/react-query";

import { api, queryKeys } from "@/lib/api";

/** Fetches placeholder detail (TOC, citations, summary) for a paper. */
export function usePaperDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.paperDetail(id),
    queryFn: () => api.getPaperDetail(id),
  });
}
