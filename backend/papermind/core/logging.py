"""Centralized logging configuration for PaperMind.

Uses the standard library ``logging`` module to avoid extra dependencies.
Configuration is idempotent so repeated calls (e.g. across tests or worker
processes) do not attach duplicate handlers.
"""

from __future__ import annotations

import logging

_LOG_FORMAT = "%(asctime)s | %(levelname)-8s | %(name)s | %(message)s"
_DATE_FORMAT = "%Y-%m-%dT%H:%M:%S%z"
_CONFIGURED = False


def configure_logging(level: str | int = logging.INFO) -> None:
    """Configure the root logger once for the whole application.

    Args:
        level: Logging level, either a level name (``"INFO"``) or a numeric
            level. Invalid names fall back to ``INFO``.
    """
    global _CONFIGURED

    resolved_level = _resolve_level(level)

    root_logger = logging.getLogger()
    root_logger.setLevel(resolved_level)

    if not _CONFIGURED:
        handler = logging.StreamHandler()
        handler.setFormatter(logging.Formatter(fmt=_LOG_FORMAT, datefmt=_DATE_FORMAT))
        root_logger.addHandler(handler)
        _CONFIGURED = True


def get_logger(name: str) -> logging.Logger:
    """Return a namespaced logger for the given module or component name."""
    return logging.getLogger(name)


def _resolve_level(level: str | int) -> int:
    """Translate a level name or numeric level into a logging level integer."""
    if isinstance(level, int):
        return level

    resolved = logging.getLevelName(level.upper())
    return resolved if isinstance(resolved, int) else logging.INFO
