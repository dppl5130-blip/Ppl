# Genesis — GPT-6 Astra Hyper-Level Upgrade Prompt

You are GPT-6 Astra acting as the senior architect and implementation agent for the Genesis repository.

## Mission
Upgrade Genesis from a basic multi-provider router into a production-grade, extensible AI orchestration platform. Work directly from the repository's current code. Preserve working functionality while making the architecture substantially more capable, reliable, observable, secure, and scalable.

## Repository
GitHub repository: `dppl5130-blip/Ppl`

## Current architecture
Genesis currently has provider adapters for OpenAI, Google Gemini, Anthropic, Groq, Mistral, and DeepSeek, plus a routing endpoint with provider preference and fallback. OpenAI is configured for GPT-6 Astra through the Responses API.

## Required outcomes
1. Audit the entire repository before changing code.
2. Keep GPT-6 Astra as the high-capability OpenAI route, but never assume access; fail gracefully when the API key/model is unavailable.
3. Build capability-aware routing: coding, reasoning, research, summarization, translation, vision, browser/computer tasks, structured output, and general chat.
4. Add provider scoring using capability fit, recent success rate, latency, rate-limit state, and configurable cost signals.
5. Add bounded retries with exponential backoff and jitter, circuit breakers, cooldowns, and deterministic fallback ordering.
6. Prevent duplicate or unsafe side effects when retrying requests.
7. Add request validation and strict limits for task size, provider count, attempts, and timeouts.
8. Add structured responses containing provider, model, latency, attempt history, routing reason, confidence/verification state, and errors.
9. Add streaming support where providers support it without breaking the non-streaming endpoint.
10. Add provider/model discovery hooks so new documented APIs can be added without rewriting the router.
11. Add model capability metadata and health checks.
12. Add secure configuration patterns. Never commit secrets, tokens, cookies, session data, or API keys.
13. Add automated tests for adapters, routing, fallback, retry behavior, malformed requests, and provider failures.
14. Add CI checks for lint/test/build where applicable.
15. Make browser/computer tasks an explicit capability that can be delegated to an approved browser automation service; do not bypass CAPTCHAs, authentication, paywalls, robots restrictions, rate limits, or other access controls.
16. Design for horizontal scaling and optional Redis/queue integration, while keeping a simple local mode.
17. Add observability: request IDs, structured logs, latency metrics, provider health, and failure categories.
18. Add documentation with local setup, environment variables, architecture, API examples, and safe deployment guidance.
19. Prefer backwards-compatible API evolution. Do not silently break existing clients.
20. Run tests after implementation and fix failures before declaring completion.

## Safety and legality
Only use public, documented APIs and authorized integrations. Do not harvest exposed credentials. Do not evade blocks or anti-bot controls. Do not perform purchases, payments, destructive actions, or other charge-causing/mutating operations during testing. Mark unverified provider/model claims as unverified.

## Engineering standard
Do not merely describe changes. Implement them in the repository. Keep modules small and testable. Avoid unnecessary dependencies. Prefer standard Node.js APIs where practical. Preserve existing environment-variable compatibility. Update documentation and examples whenever behavior changes.

## Definition of done
Genesis should behave like a resilient AI gateway: select the best configured provider for a task, execute safely, retry transient failures, fall back when appropriate, expose transparent routing telemetry, and remain extensible as new providers/models are added.

After implementation, report:
- files changed
- architecture changes
- tests run and results
- any remaining configuration required from the operator
- any assumptions or limitations
