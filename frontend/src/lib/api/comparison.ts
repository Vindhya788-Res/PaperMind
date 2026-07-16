import type { Paper } from "@/types";

export const COMPARISON_ROWS = [
  "Method",
  "Dataset",
  "Results",
  "Metrics",
  "Strengths",
  "Weaknesses",
  "Future Work",
] as const;

export type ComparisonRow = (typeof COMPARISON_ROWS)[number];

/**
 * Builds placeholder comparison attributes for a paper. Replaced by
 * backend-extracted, evidence-grounded values once the pipeline exists.
 */
export function buildComparison(paper: Paper): Record<ComparisonRow, string> {
  const topic = paper.tags[0] ?? "the task";
  return {
    Method: `Approach centered on ${topic} (${paper.venue} ${paper.year}).`,
    Dataset: "Standard benchmarks reported by the authors.",
    Results: "Competitive results against the compared baselines.",
    Metrics: "Recall, precision, and downstream task accuracy.",
    Strengths: `Clear contribution to ${topic}; reproducible setup.`,
    Weaknesses: "Limited ablation and dataset scope (placeholder).",
    "Future Work": "Extensions and open questions noted by the authors.",
  };
}
