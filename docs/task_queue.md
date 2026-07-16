# Task Queue

Prioritized backlog of milestones. Each milestone is scoped to roughly 1–3 hours.

## In progress

- _(none)_

## Next up

1. **B-1 Persistence** — SQLAlchemy models + PostgreSQL (db `papermind`) + Alembic migrations
   and PDF file storage.
2. **B-2 Ingestion** — PyMuPDF extraction, document-structure detection, text cleaning, with
   tests. Research framing: extraction quality across parsers/strategies.

## Backlog (Phase 1)

- Intelligent chunking (multiple strategies, comparable).
- Embedding generation (swappable models).
- Vector database integration (ChromaDB).
- Semantic search / retrieval pipeline.
- Citation-aware question answering.
- Retrieval evaluation harness (RAGAS / DeepEval).

## Done

- **Milestone 0** — repository scaffolding & tooling.
- **Frontend UI-0…UI-6** — workspace shell, dashboard, library + upload, PDF viewer, search,
  projects, experiments + compare (mock-data backed).
- **B-0** — FastAPI app, typed API contract (camelCase), health + collection endpoints.
