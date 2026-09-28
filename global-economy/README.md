# Global Economy

A responsive, dark economic news briefing with a terminal inspired market panel. The first version uses clearly marked sample market figures and editorial sample stories; it is structured for replacing the JSON source with a licensed news feed and a live market data provider.

The interface includes an English / Persian switch in the header. It translates the interface and sample stories, switches the layout to right-to-left for Persian, and remembers the selected language in the browser.

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

For a quick static preview, run `py -m http.server 8080` from this directory and open <http://127.0.0.1:8080/frontend/>. The page reads its sample JSON from `data/news.json`. The FastAPI server is the complete experience, including API backed sample data.

## Project layout

```text
global-economy/
├── backend/
│   └── main.py           # FastAPI routes for news, markets and health
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

Each article has an `id`, `category`, `source`, `time`, `title`, `summary`, `image`, `readTime`, and canonical `url`. One item can set `featured: true` to populate the lead story. Market entries include a display symbol, value, change, and direction. These display strings are examples, not live quotes.

## Connecting real sources

Replace the JSON loading in `backend/main.py` with a service layer that normalizes stories from your chosen RSS feeds or provider APIs into the article contract above. Keep provider credentials in environment variables; do not expose them to browser JavaScript. Add source attribution, canonical links, publication timestamps, caching, rate limits, and feed terms checks before publishing live content. For real market values, connect a licensed quote provider and retain its timestamp and delayed/live status in the response.

The interface expects the API routes on the same origin. If the API is hosted separately, configure a trusted CORS origin in FastAPI and update the `API` constant in `frontend/app.js`.
