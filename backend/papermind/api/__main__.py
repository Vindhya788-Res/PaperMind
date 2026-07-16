"""Run the API server using host/port from settings.

    python -m papermind.api

Host and port come from ``PAPERMIND_API_HOST`` / ``PAPERMIND_API_PORT`` (defaults
127.0.0.1:8001), so the bind address lives in configuration, not in a command.
"""

from __future__ import annotations

import uvicorn

from papermind.config.settings import get_settings


def main() -> None:
    settings = get_settings()
    uvicorn.run(
        "papermind.api.app:app",
        host=settings.api_host,
        port=settings.api_port,
        reload=True,
    )


if __name__ == "__main__":
    main()
