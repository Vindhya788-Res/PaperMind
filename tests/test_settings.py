"""Smoke tests for application settings and path resolution."""

from __future__ import annotations

from pathlib import Path

import pytest

from papermind.config.settings import (
    Environment,
    LogLevel,
    Settings,
    get_settings,
)
from papermind.core.paths import get_default_data_dir, get_project_root


def test_settings_defaults() -> None:
    settings = Settings()

    assert settings.environment is Environment.DEVELOPMENT
    assert settings.log_level is LogLevel.INFO
    assert isinstance(settings.data_dir, Path)


def test_settings_read_from_environment(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("PAPERMIND_ENVIRONMENT", "production")
    monkeypatch.setenv("PAPERMIND_LOG_LEVEL", "DEBUG")

    settings = Settings()

    assert settings.environment is Environment.PRODUCTION
    assert settings.log_level is LogLevel.DEBUG


def test_secrets_are_masked(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("PAPERMIND_OPENAI_API_KEY", "super-secret")

    settings = Settings()

    assert settings.openai_api_key is not None
    assert "super-secret" not in repr(settings)
    assert settings.openai_api_key.get_secret_value() == "super-secret"


def test_get_settings_is_cached() -> None:
    assert get_settings() is get_settings()


def test_project_root_contains_backend() -> None:
    assert (get_project_root() / "backend" / "papermind").is_dir()


def test_default_data_dir_is_under_root() -> None:
    assert get_default_data_dir() == get_project_root() / "data"
