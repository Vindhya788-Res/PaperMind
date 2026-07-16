"""Smoke tests for the FastAPI application and its contract."""

from __future__ import annotations

from fastapi.testclient import TestClient

from papermind import __version__


def test_health_ok(client: TestClient) -> None:
    response = client.get("/api/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok", "version": __version__}


def test_info_reports_service(client: TestClient) -> None:
    response = client.get("/api/")

    assert response.status_code == 200
    body = response.json()
    assert body["name"] == "PaperMind API"
    assert body["version"] == __version__


def test_papers_endpoint_returns_camel_case(client: TestClient) -> None:
    response = client.get("/api/papers")

    assert response.status_code == 200
    papers = response.json()
    assert isinstance(papers, list)
    assert papers, "expected seeded papers"
    first = papers[0]
    # Contract check: JSON is camelCase to match the frontend data layer.
    assert "pageCount" in first
    assert "uploadedAt" in first
    assert "page_count" not in first


def test_projects_and_experiments_endpoints(client: TestClient) -> None:
    assert client.get("/api/projects").status_code == 200
    experiments = client.get("/api/experiments").json()
    assert experiments[0]["embeddingModel"]
    assert experiments[0]["status"] in {"queued", "running", "completed", "failed"}
