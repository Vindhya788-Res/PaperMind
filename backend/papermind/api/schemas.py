"""API response schemas.

Models use snake_case field names internally and serialize to camelCase JSON
(via an alias generator) so payloads match the frontend's data contract in
``frontend/src/lib/api``. This keeps Python idiomatic while the client stays
unchanged when the mock data layer is swapped for real HTTP calls.
"""

from __future__ import annotations

from datetime import datetime
from enum import Enum

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class CamelModel(BaseModel):
    """Base model that serializes to camelCase and accepts either casing."""

    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )


class ExperimentStatus(str, Enum):
    QUEUED = "queued"
    RUNNING = "running"
    COMPLETED = "completed"
    FAILED = "failed"


class Paper(CamelModel):
    id: str
    title: str
    authors: list[str]
    year: int
    venue: str
    tags: list[str]
    uploaded_at: datetime
    favorite: bool = False
    page_count: int
    abstract: str | None = None


class Project(CamelModel):
    id: str
    name: str
    description: str
    paper_count: int
    updated_at: datetime
    pinned: bool = False
    color: str


class Experiment(CamelModel):
    id: str
    name: str
    embedding_model: str
    chunk_size: int
    overlap: int
    retriever: str
    llm: str
    metrics: dict[str, float]
    status: ExperimentStatus
    created_at: datetime


class SearchResult(CamelModel):
    id: str
    paper_id: str
    title: str
    authors: list[str]
    year: int
    venue: str
    tags: list[str]
    score: float
    summary: str
    snippet: str
    page: int


class HealthResponse(CamelModel):
    status: str
    version: str


class ApiInfo(CamelModel):
    name: str
    version: str
    environment: str
