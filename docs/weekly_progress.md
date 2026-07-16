# Weekly Progress

Short weekly log of what was completed, decisions made, and blockers.

## Week of 2026-07-13

- **Completed:** Milestone 0 — repository scaffolding & tooling (package layout, config,
  logging, ruff/mypy/pytest, pre-commit, CI, git).
- **Decisions:** pip + venv + requirements for dependency management; `backend/papermind`
  as an editable-installed package.
- **Blockers:** none.
- **Next:** Milestone 1 — PDF parsing module.

## Week of 2026-07-13 (frontend + backend kickoff)

- **Completed:** Full frontend redesign UI-0…UI-6 (Next.js 16 workspace: shell, dashboard,
  library + upload, PDF viewer, search, projects, experiments + compare — mock-data backed).
  Backend **B-0**: FastAPI app + typed camelCase API contract with health and collection
  endpoints.
- **Decisions:** Backend stack — local embeddings (BGE/E5), Anthropic Claude for answers,
  PostgreSQL (db `papermind`), ChromaDB, PyMuPDF, RAGAS. Frontend talks only to
  `frontend/src/lib/api` (the swap point for the real API).
- **Blockers:** none (Postgres being set up locally for B-1).
- **Next:** B-1 persistence (SQLAlchemy + Postgres + Alembic).
