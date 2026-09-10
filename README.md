# Genesis AI Hunter

Genesis AI Hunter is a policy-aware AI API discovery, normalization, verification, routing, and fallback platform.

## Dashboard

The first real Genesis web dashboard is in `apps/web`.

- `apps/web/index.html` — dashboard UI
- `apps/web/styles.css` — responsive dark control-center interface
- `apps/web/app.js` — live API integration, routing console, provider health, and execution telemetry
- `.github/workflows/genesis-dashboard-pages.yml` — GitHub Pages deployment workflow

The dashboard is designed to connect directly to the Genesis API. By default it uses `/api` (same origin). If the dashboard is hosted separately, use **API endpoint** in the Providers panel to set the deployed Genesis API base URL; the value is saved in browser local storage.

### Run locally

Terminal 1:

```bash
cd apps/api
npm install
npm start
```

Terminal 2, from `apps/web`:

```bash
python3 -m http.server 3000
```

Open `http://localhost:3000` and set the API endpoint to `http://localhost:8080/api` if needed.

The dashboard can also render a clear offline/demo state when the API is unavailable; it never pretends that an API request succeeded.

## Goals
- Discover publicly documented AI APIs and services from official docs, public GitHub repositories, API directories, and public developer pages.
- Normalize providers, models, endpoints, capabilities, pricing/free tiers, limits, auth requirements, regions, health, and verification timestamps.
- Route a task to the best available provider and fail over safely when a provider is unavailable.
- Support LLM, vision, image, video, speech, embeddings, OCR, translation, coding, search, and agent capabilities.
- Scale horizontally with async workers, queues, caching, batching, and incremental rescans.

## Safety and reliability
Genesis does **not** bypass provider controls. It must respect robots.txt, terms, rate limits, CAPTCHAs, authentication, paywalls, and access controls. It never harvests exposed credentials and never sends charge-causing or destructive validation requests.

No provider is labeled free without a documented limit and verification timestamp. Unknown or stale records are marked `unverified`.

## Delegated AI contract
The router can send a structured task plus the full Genesis delegation policy to an external provider. Providers are treated as interchangeable workers: Genesis remains the source of truth for routing, safety policy, timeouts, retries, circuit breaking, and fallback decisions.

Provider names and model labels must be verified before being advertised. For example, an unverified `GPT-6` claim must never be presented as an official OpenAI model.

## Planned services
- `apps/api` - HTTP API
- `apps/web` - web dashboard
- `services/discovery` - source discovery
- `services/extractor` - metadata extraction
- `services/validator` - safe verification
- `services/router` - capability/cost/latency routing and fallback
- `services/indexer` - database indexing
- `workers` - asynchronous jobs
- `database` - PostgreSQL schema
- `tests` - unit and integration tests

## Environment
Copy `.env.example` to `.env` locally. Never commit real credentials.
