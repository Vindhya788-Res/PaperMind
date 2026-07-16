"use client";

import { useQuery } from "@tanstack/react-query";

import { api, queryKeys } from "@/lib/api";

/** Fetches the paper collection via the data-access layer. */
export function usePapers() {
  return useQuery({
    queryKey: queryKeys.papers,
    queryFn: api.getPapers,
  });
}
