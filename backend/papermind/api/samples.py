"""Temporary in-memory sample data for the API contract.

These fixtures let the frontend point at the real API before persistence and
ingestion exist. They are replaced by database-backed data in later milestones
(B-1 onward) and are intentionally small and clearly synthetic.
"""

from __future__ import annotations

from datetime import UTC, datetime

from papermind.api.schemas import Experiment, ExperimentStatus, Paper, Project


def _dt(value: str) -> datetime:
    return datetime.fromisoformat(value).replace(tzinfo=UTC)


SAMPLE_PAPERS: list[Paper] = [
    Paper(
        id="pap-attention",
        title="Attention Is All You Need",
        authors=["Vaswani", "Shazeer", "Parmar"],
        year=2017,
        venue="NeurIPS",
        tags=["transformers", "attention"],
        uploaded_at=_dt("2026-07-15T08:00:00"),
        favorite=True,
        page_count=15,
    ),
    Paper(
        id="pap-rag",
        title="Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks",
        authors=["Lewis", "Perez", "Piktus"],
        year=2020,
        venue="NeurIPS",
        tags=["rag", "retrieval"],
        uploaded_at=_dt("2026-07-14T13:30:00"),
        favorite=True,
        page_count=19,
    ),
]


SAMPLE_PROJECTS: list[Project] = [
    Project(
        id="prj-rag-survey",
        name="RAG Retrieval Survey",
        description="Comparing chunking and retrieval strategies for scientific QA.",
        paper_count=42,
        updated_at=_dt("2026-07-14T09:20:00"),
        pinned=True,
        color="#4f46e5",
    ),
]


SAMPLE_EXPERIMENTS: list[Experiment] = [
    Experiment(
        id="exp-001",
        name="Fixed vs. semantic chunking",
        embedding_model="BGE-large-en-v1.5",
        chunk_size=512,
        overlap=64,
        retriever="Dense (cosine)",
        llm="claude-opus-4-8",
        metrics={"recall": 0.81, "precision": 0.74, "faithfulness": 0.88},
        status=ExperimentStatus.COMPLETED,
        created_at=_dt("2026-07-13T12:00:00"),
    ),
]
