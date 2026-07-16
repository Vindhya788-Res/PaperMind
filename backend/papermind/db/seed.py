"""Seed the database with sample rows.

Run after the schema exists (``alembic upgrade head``)::

    python -m papermind.db.seed

Idempotent: it inserts sample papers, projects, and experiments only when the
respective tables are empty.
"""

from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.orm import Session

from papermind.api.samples import SAMPLE_EXPERIMENTS, SAMPLE_PAPERS, SAMPLE_PROJECTS
from papermind.core.logging import configure_logging, get_logger
from papermind.db.models import Experiment, Paper, Project
from papermind.db.session import SessionLocal

logger = get_logger(__name__)


def seed_session(session: Session) -> int:
    """Insert sample rows into empty tables. Returns the number of rows added."""
    added = 0

    if session.scalar(select(Paper).limit(1)) is None:
        session.add_all(Paper(**paper.model_dump()) for paper in SAMPLE_PAPERS)
        added += len(SAMPLE_PAPERS)

    if session.scalar(select(Project).limit(1)) is None:
        session.add_all(Project(**project.model_dump()) for project in SAMPLE_PROJECTS)
        added += len(SAMPLE_PROJECTS)

    if session.scalar(select(Experiment).limit(1)) is None:
        session.add_all(
            Experiment(**{**exp.model_dump(), "status": exp.status.value})
            for exp in SAMPLE_EXPERIMENTS
        )
        added += len(SAMPLE_EXPERIMENTS)

    session.commit()
    return added


def main() -> None:
    configure_logging()
    with SessionLocal() as session:
        added = seed_session(session)
    logger.info("Seed complete: %d rows added.", added)


if __name__ == "__main__":
    main()
