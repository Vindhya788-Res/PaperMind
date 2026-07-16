"""Application settings.

Configuration is loaded from environment variables and an optional ``.env``
file via :mod:`pydantic_settings`, keeping configuration fully separated from
code. Access settings through :func:`get_settings`, which returns a cached
singleton suitable for dependency injection.
"""

from __future__ import annotations

from enum import Enum
from functools import lru_cache
from pathlib import Path

from pydantic import Field, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict

from papermind.core.paths import get_default_data_dir


class Environment(str, Enum):
    """Deployment environment the application is running in."""

    DEVELOPMENT = "development"
    TESTING = "testing"
    PRODUCTION = "production"


class LogLevel(str, Enum):
    """Supported logging levels."""

    DEBUG = "DEBUG"
    INFO = "INFO"
    WARNING = "WARNING"
    ERROR = "ERROR"
    CRITICAL = "CRITICAL"


class Settings(BaseSettings):
    """Runtime configuration sourced from the environment and ``.env``.

    Field names map to ``PAPERMIND_``-prefixed environment variables, e.g.
    ``PAPERMIND_LOG_LEVEL=DEBUG``.
    """

    model_config = SettingsConfigDict(
        env_prefix="PAPERMIND_",
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    environment: Environment = Field(
        default=Environment.DEVELOPMENT,
        description="Deployment environment.",
    )
    log_level: LogLevel = Field(
        default=LogLevel.INFO,
        description="Application-wide logging level.",
    )
    data_dir: Path = Field(
        default_factory=get_default_data_dir,
        description="Directory for local data artifacts (parsed documents, indices).",
    )

    api_prefix: str = Field(
        default="/api",
        description="URL prefix under which the HTTP API is mounted.",
    )
    cors_origins: list[str] = Field(
        default_factory=lambda: ["http://localhost:3000"],
        description="Origins permitted to call the API (the frontend dev server).",
    )

    openai_api_key: SecretStr | None = Field(
        default=None,
        description="Reserved for future LLM/embedding integrations.",
    )
    anthropic_api_key: SecretStr | None = Field(
        default=None,
        description="Reserved for future LLM/embedding integrations.",
    )


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Return the cached application settings instance."""
    return Settings()
