import type { Dashboard, Experiment, Paper, Project } from "@/types";
import { mockDashboard, mockExperiments, mockPapers, mockProjects } from "./mock-data";

/**
 * Data-access layer for the workspace.
 *
 * Currently backed by in-memory mock data with a small simulated latency so
 * loading and error states are exercised. When the FastAPI backend exists,
 * only this module changes to issue real `fetch` calls; consuming hooks and
 * components remain untouched.
 */

const SIMULATED_LATENCY_MS = 400;

function delay<T>(value: T, ms = SIMULATED_LATENCY_MS): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export const api = {
  getDashboard: (): Promise<Dashboard> => delay(mockDashboard),
  getPapers: (): Promise<Paper[]> => delay(mockPapers),
  getProjects: (): Promise<Project[]> => delay(mockProjects),
  getExperiments: (): Promise<Experiment[]> => delay(mockExperiments),
};

export const queryKeys = {
  dashboard: ["dashboard"] as const,
  papers: ["papers"] as const,
  projects: ["projects"] as const,
  experiments: ["experiments"] as const,
};
