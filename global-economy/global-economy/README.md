# Global Economy

A responsive, dark economic news briefing with a terminal inspired market panel. The first version uses clearly marked sample market figures and editorial sample stories; it is structured for replacing the JSON source with a licensed news feed and a live market data provider.

The interface includes an English / Persian switch in the header. It translates the interface and sample stories, switches the layout to right-to-left for Persian, and remembers the selected language in the browser.

## Live news sources

The FastAPI backend reads public RSS feeds from [BBC Business](https://feeds.bbci.co.uk/news/business/rss.xml), [The Guardian Business](https://www.theguardian.com/business/rss), the [European Central Bank](https://www.ecb.europa.eu/rss/press.html), the [U.S. Federal Reserve](https://www.federalreserve.gov/feeds/press_monetary.xml), and the [Bank for International Settlements](https://www.bis.org/doclist/all_pressrels.rss). It keeps headlines, short feed descriptions, publication times, attribution, and links to each publisher. Feeds refresh at most once every 10 minutes; the page checks for updates every 5 minutes. A local cache keeps the last successful headlines available through temporary source outages.

Use `GET /api/sources` to see which feeds responded. `GET /api/news` reports the feed connection count; if every source is unavailable and there is no cache yet, the API falls back to the sample stories in `data/news.json`. Market values remain sample data and are not live quotes.

Reuters and Associated Press require licensed API access; this integration does not scrape their sites. Check publisher feed terms before making the project public or using it commercially. The Guardian limits its RSS feeds to personal, non-commercial use; BBC terms may require permission for business use.

## Run locally

Requires Python 3.10 or newer.

```powershell
cd global-economy
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn backend.main:app --reload
```

Open <http://127.0.0.1:8000>. API documentation is available at <http://127.0.0.1:8000/docs>.

For a quick static preview, run `py -m http.server 8080` from this directory and open <http://127.0.0.1:8080/frontend/>. That mode only displays the sample JSON. Use the FastAPI server above for live RSS news.

## Project layout

```text
global-economy/
├── backend/
│   ├── main.py           # FastAPI routes for news, markets, sources and health
│   └── news_fetcher.py   # RSS ingestion, normalization and local cache
├── data/
│   └── news.json         # Sample response contract and content
├── frontend/
│   ├── index.html
│   ├── styles.css
│   └── app.js
└── requirements.txt
```

## API contract

- `GET /api/news?category=Markets&q=inflation&limit=20` returns `{ "articles": [], "count": 0, "updatedAt": "..." }`.
- `GET /api/markets` returns `{ "status": "...", "items": [] }`.
- `GET /api/health` returns `{ "status": "ok" }`.
- `GET /api/sources` returns per-feed connection status and the last refresh time.

Each article has an `id`, `category`, `source`, `time`, `title`, `summary`, `image`, `readTime`, and canonical `url`. One item can set `featured: true` to populate the lead story. Market entries include a display symbol, value, change, and direction. These display strings are examples, not live quotes.

## Connecting real sources

To add another RSS publisher, add its HTTPS feed URL and default category in `backend/news_fetcher.py`; entries are normalized to the article contract above. Keep any provider credentials in environment variables and out of browser JavaScript. For real market values, connect a licensed quote provider and retain its timestamp and delayed/live status in the response.

The interface expects the API routes on the same origin. If the API is hosted separately, configure a trusted CORS origin in FastAPI and update the `API` constant in `frontend/app.js`.
