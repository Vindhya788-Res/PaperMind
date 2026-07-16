"use client";

import { useQuery } from "@tanstack/react-query";

import { api, queryKeys } from "@/lib/api";

/** Fetches the project collection. */
export function useProjects() {
  return useQuery({
    queryKey: queryKeys.projects,
    queryFn: api.getProjects,
  });
}

/** Fetches placeholder detail (stats, recent files) for a project. */
export function useProjectDetail(id: string) {
  return useQuery({
    queryKey: queryKeys.projectDetail(id),
    queryFn: () => api.getProjectDetail(id),
  });
}
