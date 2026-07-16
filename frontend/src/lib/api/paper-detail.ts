import type { Citation, Paper, PaperDetail, TocEntry } from "@/types";

const SECTION_TITLES = [
  "Abstract",
  "Introduction",
  "Related Work",
  "Method",
  "Experiments",
  "Results",
  "Discussion",
  "Conclusion",
  "References",
];

function buildToc(pageCount: number): TocEntry[] {
  const count = Math.min(SECTION_TITLES.length, Math.max(3, Math.floor(pageCount / 2)));
  return SECTION_TITLES.slice(0, count).map((title, index) => ({
    title,
    page: Math.min(pageCount, Math.max(1, Math.round((index / count) * pageCount) + 1)),
  }));
}

function buildCitations(paper: Paper): Citation[] {
  return [
    {
      id: `${paper.id}-c1`,
      label: "[1]",
      text: "Foundational work introducing the core architecture referenced throughout the paper.",
      page: 2,
    },
    {
      id: `${paper.id}-c2`,
      label: "[2]",
      text: "Prior benchmark used to evaluate the proposed method against established baselines.",
      page: 5,
    },
    {
      id: `${paper.id}-c3`,
      label: "[3]",
      text: "Related approach the authors extend and compare their contributions with.",
      page: 7,
    },
  ];
}

/**
 * Builds placeholder detail content for a paper. This stands in for
 * backend-generated summaries, citations, and structure until the RAG
 * pipeline exists; content is clearly generic rather than fabricated findings.
 */
export function buildPaperDetail(paper: Paper): PaperDetail {
  return {
    paper,
    toc: buildToc(paper.pageCount),
    citations: buildCitations(paper),
    summary: {
      executive: `${paper.title} (${paper.authors.join(", ")}, ${paper.year}) is presented here with placeholder analysis. Connect the backend to generate a real, citation-grounded summary.`,
      bullets: [
        "Placeholder key point one about the paper's motivation.",
        "Placeholder key point two about the proposed approach.",
        "Placeholder key point three about the reported outcomes.",
      ],
      contributions: [
        "A novel method addressing the stated research problem.",
        "An empirical evaluation across standard benchmarks.",
        "Analysis of trade-offs and design choices.",
      ],
      methodology:
        "Placeholder description of the methodology. The generated summary will describe datasets, model configuration, and the experimental protocol.",
      limitations:
        "Placeholder limitations. The generated summary will surface constraints acknowledged by the authors and gaps identified during synthesis.",
      futureWork:
        "Placeholder future directions. The generated summary will extract suggested next steps and open questions.",
    },
    suggestedQuestions: [
      "What problem does this paper address?",
      "What is the main contribution?",
      "How does it compare to prior work?",
      "What datasets were used?",
    ],
  };
}
