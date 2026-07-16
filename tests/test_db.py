"""Tests for the ORM models and seeding."""

from __future__ import annotations

from sqlalchemy import func, select
from sqlalchemy.orm import Session, sessionmaker

from papermind.db.models import Experiment, Paper, Project
from papermind.db.seed import seed_session


def test_seed_populates_tables(session_factory: sessionmaker[Session]) -> None:
    with session_factory() as session:
        added = seed_session(session)

    assert added > 0
    with session_factory() as session:
        assert session.scalar(select(func.count()).select_from(Paper)) > 0
        assert session.scalar(select(func.count()).select_from(Project)) > 0
        assert session.scalar(select(func.count()).select_from(Experiment)) > 0


def test_seed_is_idempotent(session_factory: sessionmaker[Session]) -> None:
    with session_factory() as session:
        seed_session(session)
    with session_factory() as session:
        added_again = seed_session(session)

    assert added_again == 0


def test_paper_round_trip_preserves_json_columns(session_factory: sessionmaker[Session]) -> None:
    with session_factory() as session:
        seed_session(session)
        paper = session.scalars(select(Paper)).first()
        assert paper is not None
        assert isinstance(paper.authors, list)
        assert isinstance(paper.tags, list)
