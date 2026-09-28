from __future__ import annotations

import concurrent.futures
import hashlib
import html
import json
import logging
import re
import threading
import time
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timedelta, timezone
from email.utils import parsedate_to_datetime
from html.parser import HTMLParser
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
CACHE = ROOT / "data" / "live_news.json"
REFRESH_SECONDS = 600
FEEDS = (
    {"name": "BBC News", "url": "https://feeds.bbci.co.uk/news/business/rss.xml", "category": "Business"},
    {"name": "The Guardian", "url": "https://www.theguardian.com/business/rss", "category": "Business"},
    {"name": "European Central Bank", "url": "https://www.ecb.europa.eu/rss/press.html", "category": "Economy"},
    {"name": "Federal Reserve", "url": "https://www.federalreserve.gov/feeds/press_monetary.xml", "category": "Economy"},
    {"name": "Bank for International Settlements", "url": "https://www.bis.org/doclist/all_pressrels.rss", "category": "Economy"},
)
HEADERS = {
    "User-Agent": "GlobalEconomyNews/1.0 (RSS reader; contact: local project)",
    "Accept": "application/rss+xml, application/atom+xml, application/xml, text/xml;q=0.9, */*;q=0.5",
}
_lock = threading.Lock()
_last_attempt = 0.0
_snapshot: dict[str, Any] | None = None


class _DescriptionParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.parts: list[str] = []
        self.image = ""

    def handle_data(self, data: str) -> None:
        text = data.strip()
        if text:
            self.parts.append(text)

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag.lower() == "img" and not self.image:
            self.image = dict(attrs).get("src") or ""


def _local_name(tag: str) -> str:
    return tag.rsplit("}", 1)[-1].split(":")[-1].lower()


def _child_text(node: ET.Element, names: set[str]) -> str:
    for child in node.iter():
        if child is not node and _local_name(child.tag) in names:
            value = " ".join(part.strip() for part in child.itertext() if part.strip())
            if value:
                return value
    return ""


def _published(node: ET.Element) -> datetime:
    value = _child_text(node, {"pubdate", "published", "updated", "date"})
    if value:
        try:
            result = parsedate_to_datetime(value)
        except (TypeError, ValueError, OverflowError):
            try:
                result = datetime.fromisoformat(value.replace("Z", "+00:00"))
            except ValueError:
                result = None
        if result:
            return result.replace(tzinfo=timezone.utc) if result.tzinfo is None else result.astimezone(timezone.utc)
    return datetime.now(timezone.utc)


def _relative_time(published: datetime) -> str:
    minutes = max(0, int((datetime.now(timezone.utc) - published).total_seconds() // 60))
    if minutes < 60:
        return f"{minutes} min ago"
    hours = minutes // 60
    if hours < 24:
        return f"{hours} hour{'s' if hours != 1 else ''} ago"
    return f"{minutes // 1440} days ago"


def _category(title: str, summary: str, fallback: str) -> str:
    text = f"{title} {summary}".casefold()
    rules = (
        ("Energy", ("energy", "oil", "gas", "renewable", "electricity", "solar", "wind power")),
        ("Technology", ("technology", "artificial intelligence", "\bai\b", "chip", "semiconductor", "data centre", "data center")),
        ("Markets", ("stock", "share", "equity", "bond", "market", "trading", "investor", "wall street")),
        ("Business", ("business", "company", "companies", "corporate", "trade", "industry", "retail")),
        ("Economy", ("economy", "economic", "inflation", "interest rate", "growth", "gdp", "employment", "central bank", "monetary policy")),
    )
    for category, words in rules:
        if any(re.search(rf"(?<!\w){word}(?!\w)", text) for word in words):
            return category
    return fallback


def _item_link(node: ET.Element) -> str:
    for child in node:
        if _local_name(child.tag) == "link":
            href = child.attrib.get("href")
            if href and child.attrib.get("rel", "alternate") == "alternate":
                return href.strip()
            if child.text and child.text.strip():
                return child.text.strip()
    return _child_text(node, {"guid", "id"})


def _item_image(node: ET.Element, description: str) -> str:
    for element in node.iter():
        if _local_name(element.tag) in {"thumbnail", "content", "enclosure"}:
            url = element.attrib.get("url") or element.attrib.get("href")
            if url and url.startswith("https://"):
                return url
    parser = _DescriptionParser()
    parser.feed(description)
    return parser.image if parser.image.startswith("https://") else ""


def _parse_feed(source: dict[str, str], body: bytes) -> list[dict[str, Any]]:
    root = ET.fromstring(body)
    entries = [element for element in root.iter() if _local_name(element.tag) in {"item", "entry"}]
    results = []
    for entry in entries:
        title = html.unescape(_child_text(entry, {"title"})).strip()
        link = _item_link(entry)
        if not title or not link.startswith(("https://", "http://")):
            continue
        raw_summary = _child_text(entry, {"description", "summary", "subtitle", "encoded", "content"})
        parser = _DescriptionParser()
        parser.feed(raw_summary)
        summary = re.sub(r"\s+", " ", html.unescape(" ".join(parser.parts))).strip()
        published = _published(entry)
        key = hashlib.sha1(link.encode("utf-8")).hexdigest()[:14]
        results.append({
            "id": f"feed-{key}",
            "category": _category(title, summary, source["category"]),
            "source": source["name"],
            "time": _relative_time(published),
            "publishedAt": published.isoformat(),
            "title": title,
            "summary": summary[:320],
            "image": _item_image(entry, raw_summary),
            "featured": False,
            "readTime": "3 min read",
            "url": link,
        })
    return results


def _fetch_one(source: dict[str, str]) -> tuple[str, list[dict[str, Any]], str | None]:
    request = urllib.request.Request(source["url"], headers=HEADERS)
    try:
        with urllib.request.urlopen(request, timeout=8) as response:
            body = response.read(2_000_000)
        items = _parse_feed(source, body)
        return source["name"], items, None if items else "No parseable entries"
    except (urllib.error.URLError, TimeoutError, ET.ParseError, ValueError) as error:
        logging.warning("News feed %s failed: %s", source["name"], error)
        return source["name"], [], type(error).__name__


def _read_cache() -> dict[str, Any] | None:
    try:
        with CACHE.open(encoding="utf-8") as file:
            payload = json.load(file)
        if isinstance(payload.get("articles"), list):
            return payload
    except (OSError, json.JSONDecodeError):
        pass
    return None


def get_snapshot(force: bool = False) -> dict[str, Any]:
    global _last_attempt, _snapshot
    with _lock:
        now = time.monotonic()
        if _snapshot is not None and not force and now - _last_attempt < REFRESH_SECONDS:
            return _snapshot

        cached = _snapshot or _read_cache()
        with concurrent.futures.ThreadPoolExecutor(max_workers=len(FEEDS)) as pool:
            results = list(pool.map(_fetch_one, FEEDS))

        fresh: dict[str, dict[str, Any]] = {}
        statuses = []
        for name, items, error in results:
            statuses.append({"name": name, "ok": error is None, "count": len(items), "error": error})
            for item in items:
                fresh[item["id"]] = item

        # Preserve recently cached items from feeds that failed this round.
        if cached:
            cutoff = datetime.now(timezone.utc) - timedelta(days=3)
            for item in cached.get("articles", []):
                if item.get("id") in fresh:
                    continue
                try:
                    published = datetime.fromisoformat(item["publishedAt"].replace("Z", "+00:00"))
                    if published >= cutoff:
                        fresh[item["id"]] = item
                except (KeyError, TypeError, ValueError):
                    continue

        articles = sorted(
            fresh.values(),
            key=lambda item: item.get("publishedAt", ""),
            reverse=True,
        )[:100]
        successful = sum(source["ok"] for source in statuses)
        snapshot = {
            "updatedAt": datetime.now(timezone.utc).isoformat(),
            "articles": articles,
            "sources": statuses,
            "successfulSources": successful,
            "totalSources": len(FEEDS),
            "mode": "live" if articles else "sample",
        }
        if articles:
            articles[0]["featured"] = True
            for item in articles[1:]:
                item["featured"] = False
            try:
                CACHE.write_text(json.dumps(snapshot, ensure_ascii=False, indent=2), encoding="utf-8")
            except OSError:
                logging.exception("Could not persist the live news cache")

        _last_attempt = now
        _snapshot = snapshot
        return snapshot
