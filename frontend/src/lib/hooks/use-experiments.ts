"use client";

import { useQuery } from "@tanstack/react-query";

import { api, queryKeys } from "@/lib/api";

/** Fetches the experiment collection. */
export function useExperiments() {
  return useQuery({
    queryKey: queryKeys.experiments,
    queryFn: api.getExperiments,
  });
}
