# Genesis API

## Run

```bash
npm install
cp .env.example .env
npm start
```

Configure one or more provider keys locally. Never commit `.env` or real credentials.

## Routing

`POST /api/route`

```json
{
  "task": "Explain this code",
  "providers": ["groq", "openai", "google"],
  "max_attempts": 3
}
```

Genesis tries configured providers in the requested order, then remaining configured providers. If a provider fails, the router automatically falls back to the next provider. The response includes provider, model, latency, attempts, and whether fallback was used.

## Supported adapters

- OpenAI-compatible Chat Completions
- Google Gemini generateContent
- Anthropic Messages
- Groq OpenAI-compatible Chat Completions
- Mistral Chat Completions
- DeepSeek Chat Completions

Models are configurable through environment variables. Genesis does not assume or advertise unverified model names; set a model only when it is valid for your provider account/API.

## Safety

The service never contains API keys in source. It does not bypass authentication, CAPTCHAs, paywalls, rate limits, or other access controls. Provider failures are handled with application-level fallback rather than block evasion.
