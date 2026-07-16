"""Health and service-info endpoints."""

from __future__ import annotations

from fastapi import APIRouter

from papermind import __version__
from papermind.api.schemas import ApiInfo, HealthResponse
from papermind.config.settings import get_settings

router = APIRouter(tags=["meta"])


@router.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    """Liveness probe."""
    return HealthResponse(status="ok", version=__version__)


@router.get("/", response_model=ApiInfo)
def info() -> ApiInfo:
    """Basic service information."""
    settings = get_settings()
    return ApiInfo(
        name="PaperMind API",
        version=__version__,
        environment=settings.environment.value,
    )
