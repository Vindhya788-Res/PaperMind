"""Project path resolution.

Paths are derived at runtime from the location of this module so the package
never depends on a hardcoded absolute path or the process working directory.
"""

from __future__ import annotations

from pathlib import Path

_THIS_FILE = Path(__file__).resolve()


def get_project_root() -> Path:
    """Return the repository root directory.

    The package lives at ``<root>/backend/papermind/core/paths.py``, so the
    root is four parents up from this file.
    """
    return _THIS_FILE.parents[3]


def get_default_data_dir() -> Path:
    """Return the default directory for local data artifacts (``<root>/data``)."""
    return get_project_root() / "data"
