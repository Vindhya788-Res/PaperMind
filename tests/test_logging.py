"""Smoke tests for logging configuration."""

from __future__ import annotations

import logging

from papermind.core.logging import configure_logging, get_logger


def test_configure_logging_sets_level() -> None:
    configure_logging("WARNING")

    assert logging.getLogger().level == logging.WARNING


def test_configure_logging_is_idempotent() -> None:
    configure_logging("INFO")
    handler_count = len(logging.getLogger().handlers)

    configure_logging("INFO")

    assert len(logging.getLogger().handlers) == handler_count


def test_invalid_level_falls_back_to_info() -> None:
    configure_logging("NOT_A_LEVEL")

    assert logging.getLogger().level == logging.INFO


def test_get_logger_returns_named_logger() -> None:
    logger = get_logger("papermind.test")

    assert logger.name == "papermind.test"
