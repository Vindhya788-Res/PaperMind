"use client";

import { useQuery } from "@tanstack/react-query";

import { api, queryKeys } from "@/lib/api";

/** Fetches the dashboard aggregate via the data-access layer. */
export function useDashboard() {
  return useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: api.getDashboard,
  });
}
