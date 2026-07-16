import type { Project, ProjectDetail } from "@/types";
import { mockPapers } from "./mock-data";

const CHUNKS_PER_PAPER = 148;

/**
 * Builds placeholder detail for a project: derived statistics, a sample of
 * associated papers, and empty notes. Replaced by real project data once the
 * backend exists.
 */
export function buildProjectDetail(project: Project): ProjectDetail {
  const sampleSize = Math.min(mockPapers.length, Math.max(3, Math.min(project.paperCount, 5)));
  return {
    project,
    stats: {
      papers: project.paperCount,
      notes: Math.max(1, Math.round(project.paperCount / 4)),
      experiments: Math.max(0, Math.round(project.paperCount / 12)),
      chunks: project.paperCount * CHUNKS_PER_PAPER,
    },
    recentPapers: mockPapers.slice(0, sampleSize),
    notes: "",
  };
}
