import type {
  Dashboard,
  Experiment,
  Paper,
  PaperDetail,
  Project,
  ProjectDetail,
  SearchFilters,
  SearchMode,
  SearchResult,
} from "@/types";
import { mockDashboard, mockExperiments, mockPapers, mockProjects } from "./mock-data";
import { buildPaperDetail } from "./paper-detail";
import { buildProjectDetail } from "./project-detail";
import { runSearch } from "./search";

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
  getPaperDetail: (id: string): Promise<PaperDetail> => {
    const paper = mockPapers.find((item) => item.id === id);
    if (!paper) return Promise.reject(new Error(`Paper not found: ${id}`));
    return delay(buildPaperDetail(paper));
  },
  search: (query: string, mode: SearchMode, filters: SearchFilters): Promise<SearchResult[]> =>
    delay(runSearch(query, mode, filters)),
  getProjectDetail: (id: string): Promise<ProjectDetail> => {
    const project = mockProjects.find((item) => item.id === id);
    if (!project) return Promise.reject(new Error(`Project not found: ${id}`));
    return delay(buildProjectDetail(project));
  },
};

export const queryKeys = {
  dashboard: ["dashboard"] as const,
  papers: ["papers"] as const,
  projects: ["projects"] as const,
  experiments: ["experiments"] as const,
  paperDetail: (id: string) => ["paper-detail", id] as const,
  projectDetail: (id: string) => ["project-detail", id] as const,
  search: (query: string, mode: SearchMode, filters: SearchFilters) =>
    ["search", query, mode, filters] as const,
};
