"""Database engine and session management.

Endpoints depend on :func:`get_session` (a FastAPI dependency). Sync sessions
are used deliberately: FastAPI runs sync ``def`` endpoints in a threadpool, so
the event loop is never blocked, and the code stays simple.
"""

from __future__ import annotations

from collections.abc import Iterator

from sqlalchemy import Engine, create_engine
from sqlalchemy.orm import Session, sessionmaker

from papermind.config.settings import get_settings


def create_db_engine(url: str | None = None) -> Engine:
    """Create a SQLAlchemy engine from the given URL or application settings."""
    resolved = url or get_settings().database_url
    return create_engine(resolved, pool_pre_ping=True, future=True)


engine = create_db_engine()
SessionLocal = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)


def get_session() -> Iterator[Session]:
    """Yield a database session, ensuring it is closed after the request."""
    with SessionLocal() as session:
        yield session
