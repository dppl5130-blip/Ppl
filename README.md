# Genesis AI Hunter

Genesis AI Hunter is a policy-aware AI API discovery, normalization, verification, routing, and fallback platform.

## Dashboard

The first real Genesis web dashboard is in `apps/web`.

- `apps/web/index.html` — dashboard UI
- `apps/web/styles.css` — responsive dark control-center interface
- `apps/web/app.js` — live API integration, routing console, provider health, and execution telemetry
- `vercel.json` — Vercel configuration for the static dashboard
- `.github/workflows/genesis-dashboard-pages.yml` — GitHub Pages deployment workflow
- `render.yaml` — Render blueprint for the Node/Fastify backend

The dashboard connects directly to the Genesis API. By default it uses `/api` (same origin). If the dashboard is hosted separately, use **API endpoint** in the Providers panel to set the deployed Genesis API base URL; the value is saved in browser local storage.

### Recommended cloud deployment

For the current architecture, use **Vercel for the static dashboard + Render for the Fastify API**. This keeps the frontend fast and globally cached while the stateful provider-routing process runs as a normal Node service.

1. Import this repository into Vercel and deploy the root project. The included `vercel.json` points Vercel at `apps/web`.
2. Create a Render Web Service from this repository. The included `render.yaml` defines the `apps/api` service, build command, start command, health check, and provider environment variables.
3. In Render, add the real provider API keys as encrypted environment variables. Do not commit keys to Git.
4. Open the Vercel dashboard and set **API endpoint** to the Render service URL plus `/api`.
5. Verify `GET /api/health` before running real tasks.

Vercel hosts the frontend; it does **not** replace the backend service in this architecture.

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
Copy `.env.example` to `.env` locally. Never commit real credentials. Cloud deployments should use the host's encrypted environment-variable/secret store.
