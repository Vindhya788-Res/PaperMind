# PaperMind

> An AI-powered Scientific Literature Understanding Platform for Research, Knowledge Discovery, and Evidence Synthesis.

---

# Vision

PaperMind is a research-oriented platform designed to assist researchers, academics, postgraduate students, and industry professionals in understanding scientific literature efficiently.

Unlike a traditional Retrieval-Augmented Generation (RAG) chatbot, PaperMind aims to become a research platform capable of evaluating, comparing, synthesizing, and analyzing scientific publications.

The long-term objective is to use this platform as the basis for multiple research publications and eventually a PhD research portfolio.

---

# Project Objectives

## Software Objectives

- Upload scientific papers (PDF)
- Extract text accurately
- Identify document structure
- Perform intelligent chunking
- Generate embeddings
- Store embeddings in a vector database
- Retrieve relevant information
- Generate citation-aware responses
- Provide references to original papers

---

## Research Objectives

PaperMind is not simply another chatbot.

Its purpose is to investigate research questions such as:

- Which chunking strategy provides the highest retrieval quality?
- Which embedding model performs best for scientific literature?
- How should retrieved passages be reranked?
- Can RAG systems synthesize evidence from multiple papers?
- Can LLMs automatically identify research gaps?
- How reliable are generated literature reviews?

Every major feature should support a research hypothesis.

---

# Target Users

- Undergraduate researchers
- MSc students
- PhD students
- University academics
- Research laboratories
- Industrial researchers

---

# Core Features

## Phase 1 (Minimum Viable Product)

- PDF Upload
- PDF Parsing
- Metadata Extraction
- Text Cleaning
- Intelligent Chunking
- Embedding Generation
- Vector Database
- Semantic Search
- Question Answering
- Source Citation

---

## Phase 2

- Multiple document retrieval
- Literature review generation
- Automatic summaries
- Cross-document comparison
- Table generation
- Research trend analysis

---

## Phase 3

- Research gap identification
- Novelty detection
- Evidence synthesis
- Contradiction detection
- Automatic related work generation

---

# High-Level Architecture

```
                PDF Papers
                     │
                     ▼
             Document Extraction
                     │
                     ▼
               Text Cleaning
                     │
                     ▼
                 Chunking
                     │
                     ▼
                Embeddings
                     │
                     ▼
               Vector Database
                     │
                     ▼
              Retrieval Pipeline
                     │
                     ▼
               Large Language Model
                     │
                     ▼
         Answers + Citations + Evidence
```

---

# Technology Stack

| Layer | Technology |
|---------|------------|
| Backend | Python |
| API | FastAPI |
| Frontend | React / Next.js |
| Database | PostgreSQL |
| Vector Database | ChromaDB (initially) |
| Embeddings | BGE / E5 / OpenAI |
| LLM | OpenAI / Claude |
| PDF Parsing | PyMuPDF |
| Evaluation | RAGAS, DeepEval |

---

# Repository Structure

```
PaperMind/

backend/
frontend/
docs/
tests/
scripts/
data/
experiments/
notebooks/

README.md
```

---

# Development Philosophy

The project follows four principles.

1. Build a working software platform.
2. Design every feature as a research experiment.
3. Maintain high software engineering standards.
4. Produce publishable research outcomes.

---

# Success Criteria

The project will be considered successful when it achieves the following:

- A fully functional RAG system
- Professional GitHub repository
- Well-documented software architecture
- At least one first-author publication
- Strong portfolio for PhD applications
- Foundation for future NLP research

---

# Current Status

Phase: Planning

Progress:

- [x] Project idea finalized
- [x] Repository initialization
- [ ] Architecture design
- [ ] Backend implementation
- [ ] Frontend implementation
- [ ] Research experiments
- [ ] First publication
- [ ] PhD applications

---

# Getting Started (Development)

## Backend

Requires Python 3.11+. Commands below use Windows PowerShell; adapt activation for
other shells.

```powershell
# 1. Create and activate a virtual environment
python -m venv .venv
.\.venv\Scripts\Activate.ps1

# 2. Install the package (editable) plus development tooling
pip install -e . -r requirements-dev.txt

# 3. Configure environment
Copy-Item .env.example .env   # then edit values as needed

# 4. Run quality gates
ruff check .
ruff format --check .
mypy backend
pytest

# 5. (Optional) enable git hooks
pre-commit install
```

## Frontend

Requires Node.js 18+.

```powershell
cd frontend
npm install
npm run dev        # http://localhost:3000
npm run lint
npm run build
```

---

# License

This project is currently under active research and development.

License will be determined before public release.