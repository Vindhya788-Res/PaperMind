"""FastAPI application factory and ASGI entrypoint.

Run the development server with::

    uvicorn papermind.api.app:app --reload
"""

from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from papermind import __version__
from papermind.api.routers import health, papers
from papermind.config.settings import Settings, get_settings
from papermind.core.logging import configure_logging


def create_app(settings: Settings | None = None) -> FastAPI:
    """Build and configure the FastAPI application.

    Args:
        settings: Optional settings override, primarily for testing. Defaults
            to the cached application settings.
    """
    settings = settings or get_settings()
    configure_logging(settings.log_level.value)

    app = FastAPI(
        title="PaperMind API",
        version=__version__,
        description="Scientific literature understanding platform.",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(health.router, prefix=settings.api_prefix)
    app.include_router(papers.router, prefix=settings.api_prefix)

    return app


app = create_app()
