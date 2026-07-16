"""Paper, project, and experiment collection endpoints, backed by the database."""

from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from papermind.api.schemas import Experiment, Paper, Project
from papermind.db import models
from papermind.db.session import get_session

router = APIRouter(tags=["collections"])

SessionDep = Annotated[Session, Depends(get_session)]


@router.get("/papers", response_model=list[Paper])
def list_papers(session: SessionDep) -> list[models.Paper]:
    """Return all papers in the library."""
    return list(session.scalars(select(models.Paper).order_by(models.Paper.uploaded_at.desc())))


@router.get("/projects", response_model=list[Project])
def list_projects(session: SessionDep) -> list[models.Project]:
    """Return all research projects."""
    return list(session.scalars(select(models.Project).order_by(models.Project.updated_at.desc())))


@router.get("/experiments", response_model=list[Experiment])
def list_experiments(session: SessionDep) -> list[models.Experiment]:
    """Return all experiments."""
    return list(
        session.scalars(select(models.Experiment).order_by(models.Experiment.created_at.desc()))
    )
