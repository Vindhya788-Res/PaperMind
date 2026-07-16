# PaperMind — Architecture

> Status: living document. Updated as each milestone lands.

## 1. Overview

PaperMind is a modular Retrieval-Augmented Generation (RAG) platform for scientific
literature understanding. Each stage of the pipeline is an independently replaceable
component so that alternative methods (chunkers, embedding models, retrievers, rerankers,
LLMs) can be swapped and compared as experiments.

## 2. Pipeline

```
PDF -> Ingestion -> Chunking -> Embeddings -> Vector Store -> Retrieval -> LLM -> Answer + Citations
```

## 3. Package layout (`backend/papermind`)

| Module        | Responsibility                                              | Status   |
|---------------|-------------------------------------------------------------|----------|
| `config`      | Environment-driven settings (pydantic-settings).            | Present  |
| `core`        | Logging, path resolution, shared primitives.                | Present  |
| `ingestion`   | PDF parsing, structure detection, text cleaning.            | Planned  |
| `chunking`    | Passage segmentation strategies.                            | Planned  |
| `embeddings`  | Embedding model interfaces and implementations.             | Planned  |
| `retrieval`   | Vector store, search, reranking.                            | Planned  |
| `llm`         | Citation-aware answer generation.                           | Planned  |
| `api`         | FastAPI application exposing the pipeline.                   | Present  |

## 4. Design principles

- **Configuration separated from code** — all runtime config via environment / `.env`.
- **No hardcoded paths** — paths derived from the project root at runtime (`core/paths.py`).
- **Interface-first, swappable components** — every stage is defined by an abstraction so
  competing implementations can be benchmarked.
- **Reproducibility** — pinned dependencies; experiments logged in `docs/experiment_log.md`.

## 5. Modularity boundaries (planned interfaces)

Each stage will expose a small protocol/ABC so implementations are interchangeable:
`Parser`, `Chunker`, `Embedder`, `VectorStore`, `Retriever`, `Reranker`, `LLMClient`.
These are introduced in their respective feature milestones.
