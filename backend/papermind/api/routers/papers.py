"""Paper, project, and experiment collection endpoints.

Currently backed by in-memory sample fixtures. Replaced by database-backed
queries in later milestones without changing the response contract.
"""

from __future__ import annotations

from fastapi import APIRouter

from papermind.api.samples import SAMPLE_EXPERIMENTS, SAMPLE_PAPERS, SAMPLE_PROJECTS
from papermind.api.schemas import Experiment, Paper, Project

router = APIRouter(tags=["collections"])


@router.get("/papers", response_model=list[Paper])
def list_papers() -> list[Paper]:
    """Return all papers in the library."""
    return SAMPLE_PAPERS


@router.get("/projects", response_model=list[Project])
def list_projects() -> list[Project]:
    """Return all research projects."""
    return SAMPLE_PROJECTS


@router.get("/experiments", response_model=list[Experiment])
def list_experiments() -> list[Experiment]:
    """Return all experiments."""
    return SAMPLE_EXPERIMENTS
