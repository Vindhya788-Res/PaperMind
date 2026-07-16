/** Shared domain types for the PaperMind workspace. */

export interface Paper {
  id: string;
  title: string;
  authors: string[];
  year: number;
  venue: string;
  tags: string[];
  uploadedAt: string;
  favorite: boolean;
  pageCount: number;
  abstract?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  paperCount: number;
  updatedAt: string;
  pinned: boolean;
  color: string;
}

export type ExperimentStatus = "queued" | "running" | "completed" | "failed";

export interface Experiment {
  id: string;
  name: string;
  embeddingModel: string;
  chunkSize: number;
  overlap: number;
  retriever: string;
  llm: string;
  metrics: Record<string, number>;
  status: ExperimentStatus;
  createdAt: string;
}

export type ActivityKind = "upload" | "search" | "chat" | "experiment" | "note" | "project";

export interface ActivityItem {
  id: string;
  kind: ActivityKind;
  title: string;
  timestamp: string;
}

export interface DashboardStats {
  papers: number;
  chunks: number;
  embeddings: number;
  queries: number;
  experiments: number;
  storageBytes: number;
}

export type SearchMode = "semantic" | "keyword" | "hybrid" | "metadata";

export interface SearchFilters {
  author?: string;
  year?: number;
  venue?: string;
}

export interface SearchResult {
  id: string;
  paperId: string;
  title: string;
  authors: string[];
  year: number;
  venue: string;
  tags: string[];
  score: number;
  summary: string;
  snippet: string;
  page: number;
}

export interface TocEntry {
  title: string;
  page: number;
}

export interface Citation {
  id: string;
  label: string;
  text: string;
  page: number;
}

export interface PaperSummary {
  executive: string;
  bullets: string[];
  contributions: string[];
  methodology: string;
  limitations: string;
  futureWork: string;
}

export interface PaperDetail {
  paper: Paper;
  toc: TocEntry[];
  citations: Citation[];
  summary: PaperSummary;
  suggestedQuestions: string[];
}

export interface Dashboard {
  stats: DashboardStats;
  recentPapers: Paper[];
  recentProjects: Project[];
  pinnedProjects: Project[];
  recentSearches: string[];
  activity: ActivityItem[];
}
