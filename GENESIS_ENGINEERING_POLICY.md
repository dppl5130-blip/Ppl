# Genesis Engineering Policy

This file is a persistent engineering contract for Genesis. Every developer, coding agent, CI workflow, and deployment should treat these rules as mandatory unless a higher-priority security or platform constraint applies.

## Startup and availability

1. Start the Genesis API reliably and expose `/api/health`.
2. A single provider, browser worker, queue, or dependency failure must never collapse the entire Genesis service.
3. Validate configuration at startup. Missing optional provider credentials should be reported clearly without taking down Genesis.
4. Keep the dashboard connected to the API and clearly distinguish real execution from DEMO/OFFLINE mode.

## Routing and execution

5. Keep the GPT-6 Astra route available for high-complexity tasks.
6. Route tasks using capability, provider health, latency, reliability, and task requirements.
7. Use bounded retries, timeouts, circuit breakers/cooldowns, and provider fallback.
8. Validate provider responses before reporting success.
9. If a provider fails, automatically use another configured provider when appropriate.
10. Prefer safe, observable, production-ready implementations over simulated success.

## Security and privacy

11. Store API keys and credentials only in environment variables or an approved secret store.
12. Never expose provider secrets to the frontend, logs, source code, commits, artifacts, or client-visible responses.
13. Do not harvest, infer, or reuse exposed credentials.
14. Do not bypass CAPTCHA, authentication, paywalls, rate limits, robots rules, anti-bot controls, or other access controls.
15. Browser/headless automation must use legitimate access and respect provider/site terms.
16. Do not perform purchases, payments, destructive actions, or other mutating operations during automated tests or validation.

## Reliability and observability

17. Isolate failures and keep healthy parts of Genesis operational.
18. Record useful operational telemetry such as provider health, latency, attempts, fallback usage, correlation IDs, and errors without recording secrets or unnecessary sensitive data.
19. Use health checks and graceful failure paths for external dependencies.
20. Prefer idempotent operations and safe cancellation where applicable.

## Engineering workflow

21. Preserve backwards compatibility unless a change is explicitly required.
22. Before significant changes, inspect the existing repository and preserve working behavior.
23. Run tests, linting, builds, and health checks after significant code changes or deployment changes.
24. Never claim that a task, provider call, deployment, or test succeeded unless it actually succeeded.
25. Update documentation when architecture, configuration, deployment, or operational behavior changes.
26. Keep the architecture extensible so new documented/public providers and tools can be added without rewriting the core router.

## Deployment contract

27. Render is responsible for running the Genesis backend/API and its server-side provider integrations.
28. Vercel is responsible for hosting the web dashboard/static frontend.
29. Provider API keys belong in Render's encrypted environment variables, never in Vercel frontend code.
30. Production CORS should eventually be restricted to the deployed dashboard origin rather than allowing arbitrary origins.
31. A deployment is considered healthy only after the backend health endpoint and the frontend-to-backend connection have been verified.

## Agent behavior

When modifying Genesis, agents should implement the requested change, inspect affected code, run appropriate tests/checks, and report exact results. Do not merely describe a plan. If a requested action conflicts with security, access-control, privacy, or platform constraints, use a safe compliant alternative instead of attempting to bypass the constraint.

## Definition of done

Genesis should understand the task, select suitable providers, safely decompose or parallelize work when useful, execute with bounded failure handling, verify results, fall back when necessary, expose useful telemetry, and remain operational and extensible when individual dependencies fail.
