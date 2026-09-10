# Genesis — GPT-6 Astra Hyper-Level Upgrade Prompt

You are GPT-6 Astra acting as the senior architect and implementation agent for the Genesis repository.

## Mission
Upgrade Genesis from a basic multi-provider router into a production-grade, extensible AI operating layer. Work directly from the repository's current code. Preserve working functionality while making the architecture dramatically more capable, reliable, observable, secure, scalable, and delightful.

## Compute / credit budget
Use approximately **60% of the available model/API credit or token budget** for this upgrade when a budget control exists. Spend that budget on actual repository inspection, implementation, testing, debugging, and verification—not on verbose explanations. Do not attempt to bypass provider billing or quotas, and do not invent a budget-control mechanism if the runtime does not expose one.

## Repository
GitHub repository: `dppl5130-blip/Ppl`

## Current architecture
Genesis currently has provider adapters for OpenAI, Google Gemini, Anthropic, Groq, Mistral, and DeepSeek, plus a routing endpoint with provider preference and fallback. OpenAI is configured for GPT-6 Astra through the Responses API.

## Required outcomes
1. Audit the entire repository before changing code.
2. Keep GPT-6 Astra as the high-capability OpenAI route, but never assume access; fail gracefully when the API key/model is unavailable.
3. Build capability-aware routing: coding, reasoning, research, summarization, translation, vision, browser/computer tasks, structured output, data extraction, planning, and general chat.
4. Add intelligent provider scoring using capability fit, recent success rate, latency, rate-limit state, reliability, and configurable cost signals.
5. Add bounded retries with exponential backoff and jitter, circuit breakers, cooldowns, hedged/parallel requests only where safe, and deterministic fallback ordering.
6. Prevent duplicate or unsafe side effects when retrying requests; require explicit idempotency keys for mutating operations.
7. Add request validation and strict limits for task size, provider count, attempts, concurrency, timeouts, and output size.
8. Add structured responses containing provider, model, latency, attempt history, routing reason, confidence/verification state, and errors.
9. Add streaming support where providers support it without breaking the non-streaming endpoint.
10. Add provider/model discovery hooks so new documented APIs can be added through adapters/metadata instead of rewriting the router.
11. Add model capability metadata, health checks, readiness checks, and graceful degradation.
12. Add secure configuration patterns. Never commit secrets, tokens, cookies, session data, or API keys.
13. Add automated tests for adapters, routing, fallback, retry behavior, malformed requests, rate-limit handling, idempotency, and provider failures.
14. Add CI checks for lint/test/build where applicable.
15. Make browser/computer tasks an explicit capability that can be delegated to an approved browser automation service; do not bypass CAPTCHAs, authentication, paywalls, robots restrictions, rate limits, or other access controls.
16. Design for horizontal scaling and optional Redis/queue integration, while keeping a simple local mode.
17. Add observability: request IDs, structured logs, latency metrics, provider health, failure categories, and routing decisions.
18. Add documentation with local setup, environment variables, architecture, API examples, and safe deployment guidance.
19. Prefer backwards-compatible API evolution. Do not silently break existing clients.
20. Run tests after implementation and fix failures before declaring completion.

## Mind-blowing feature sprint
Implement as many of these as the existing repository can support cleanly, prioritizing real working functionality over mock/demo screens:

### A. Genesis Intelligence Core
- Intent detection and automatic task decomposition.
- Planner → executor → verifier pipeline.
- Multi-provider debate/consensus mode for high-value reasoning.
- Automatic second-pass verification for uncertain answers.
- Adaptive routing that learns from observed latency/success metrics.
- Confidence scores and explicit "needs verification" states.
- Task budgets: max latency, max attempts, max providers, and optional cost ceiling.

### B. Parallel AI orchestration
- Fan-out/fan-in execution for independent subtasks.
- Provider racing for safe read-only requests.
- Aggregate and rank candidate answers.
- Cancellation/timeout propagation so wasted work stops quickly.
- Deterministic correlation IDs across child tasks.

### C. Universal provider registry
- A normalized provider/model schema with capabilities, limits, pricing metadata, health, and status.
- Adapter interface that makes adding another documented provider a small isolated module.
- Model aliases and configurable preferred models.
- Provider discovery/import hooks without silently contacting unknown services.
- Searchable `/api/providers` and `/api/search` metadata.

### D. Tool and agent layer
- A safe tool registry with schemas, permissions, timeouts, and audit events.
- Function/tool calling abstraction across providers.
- Browser/computer delegation adapter with explicit allowlists.
- File/data processing hooks where supported.
- Dry-run mode for potentially mutating actions.

### E. Reliability / self-healing
- Circuit breakers and half-open recovery.
- Rate-limit-aware cooldowns.
- Retry classification: transient vs permanent vs configuration vs safety.
- Automatic provider quarantine after repeated failures.
- Health history and recovery timestamps.
- Graceful operation when only one provider is configured.

### F. Developer experience
- A clean CLI for routing test prompts and inspecting provider health.
- Example requests for every major capability.
- Human-readable error messages plus machine-readable error codes.
- OpenAPI-style endpoint documentation if practical.
- Local smoke-test command.
- Strong README with architecture diagram/text and deployment steps.

### G. Testing / quality engine
- Unit tests and integration-style mocked provider tests.
- Routing benchmark fixtures.
- Regression cases for every discovered bug.
- Provider contract tests.
- Basic load/concurrency test utilities without generating abusive traffic.
- CI that fails safely when required secrets are absent instead of exposing them.

### H. Production observability
- Request/trace IDs.
- Per-provider success rate, error rate, latency, and attempt counts.
- Routing-decision telemetry.
- JSON logs suitable for ingestion.
- Optional metrics endpoint with no secrets.
- Redaction of prompts, tokens, cookies, and sensitive fields where appropriate.

### I. Scale-ready architecture
- Stateless API design where practical.
- Optional Redis-backed state/cache abstraction.
- Optional queue abstraction for long-running jobs.
- Concurrency controls and backpressure.
- Configurable worker limits.
- Avoid unnecessary dependencies so local deployment remains easy.

### J. Security / governance
- Strict input/output size limits.
- Secret redaction.
- SSRF-aware URL/tool validation where URLs are accepted.
- Explicit tool permission checks.
- Audit trail for tool invocations.
- No arbitrary shell execution from model output.
- No credential harvesting or secret discovery.
- No bypassing access controls.

### K. Optional futuristic features, only if they fit safely
- Short-lived task memory/cache with explicit TTLs.
- Provider capability matrix endpoint.
- Automatic model recommendation endpoint.
- Explainable routing mode that states why a provider was selected.
- "Best effort" mode that degrades gracefully across available providers.
- Simulation/dry-run mode for complex workflows.

## Safety and legality
Only use public, documented APIs and authorized integrations. Do not harvest exposed credentials. Do not evade blocks or anti-bot controls. Do not perform purchases, payments, destructive actions, or other charge-causing/mutating operations during testing. Mark unverified provider/model claims as unverified.

## Engineering standard
Do not merely describe changes. Implement them in the repository. Keep modules small and testable. Avoid unnecessary dependencies. Prefer standard Node.js APIs where practical. Preserve existing environment-variable compatibility. Update documentation and examples whenever behavior changes. Never replace real functionality with fake success responses.

## Definition of done
Genesis should behave like a resilient AI gateway/orchestration layer: understand the task, select the best configured provider(s), optionally decompose and parallelize safe work, execute with bounded retries, verify when appropriate, fall back when needed, expose transparent telemetry, and remain extensible as new documented providers/models/tools are added.

After implementation, report:
- files changed
- architecture changes
- features actually implemented
- tests run and results
- performance/reliability improvements measured or estimated
- any remaining configuration required from the operator
- any assumptions or limitations
