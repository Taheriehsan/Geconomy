from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data" / "news.json"
app = FastAPI(title="Global Economy News API", version="0.1.0")


def load_data() -> dict[str, Any]:
    with DATA.open(encoding="utf-8") as file:
        return json.load(file)


@app.get("/api/health")
def health() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/api/news")
def get_news(
    category: str | None = Query(default=None),
    q: str | None = Query(default=None, max_length=160),
    limit: int = Query(default=20, ge=1, le=100),
) -> dict[str, Any]:
    payload = load_data()
    items = payload["articles"]
    if category and category.lower() not in {"all", "top stories"}:
        items = [item for item in items if item["category"].lower() == category.lower()]
    if q:
        needle = q.casefold()
        items = [
            item for item in items
            if needle in " ".join((item["title"], item["summary"], item["source"])).casefold()
        ]
    return {
        "articles": items[:limit],
        "count": len(items),
        "updatedAt": payload["updatedAt"],
        "breaking": payload["breaking"],
    }


@app.get("/api/markets")
def get_markets() -> dict[str, Any]:
    return load_data()["markets"]


@app.get("/")
def index() -> FileResponse:
    return FileResponse(ROOT / "frontend" / "index.html")


app.mount("/assets", StaticFiles(directory=ROOT / "frontend" / "assets"), name="assets")
app.mount("/", StaticFiles(directory=ROOT / "frontend"), name="frontend")
