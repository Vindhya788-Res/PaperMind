"""Shared test fixtures.

Database-backed tests run against an in-memory SQLite engine with the same ORM
models, so the suite needs no PostgreSQL instance. The API's ``get_session``
dependency is overridden to use this engine.
"""

from __future__ import annotations

from collections.abc import Iterator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

from papermind.api.app import create_app
from papermind.db.base import Base
from papermind.db.seed import seed_session
from papermind.db.session import get_session


@pytest.fixture
def session_factory() -> sessionmaker[Session]:
    engine = create_engine(
        "sqlite://",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    Base.metadata.create_all(engine)
    return sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


@pytest.fixture
def client(session_factory: sessionmaker[Session]) -> TestClient:
    app = create_app()

    def override_get_session() -> Iterator[Session]:
        with session_factory() as session:
            yield session

    app.dependency_overrides[get_session] = override_get_session

    with session_factory() as session:
        seed_session(session)

    return TestClient(app)
