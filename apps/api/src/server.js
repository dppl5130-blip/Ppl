import Fastify from 'fastify';
import cors from '@fastify/cors';
import { adapters, configuredProviders } from './providers.js';

const app = Fastify({ logger: true });
await app.register(cors, { origin: true });

const health = new Map();

function providerOrder(body = {}) {
  const configured = configuredProviders().map(p => p.id);
  const requested = Array.isArray(body.providers) ? body.providers : [];
  const preferred = requested.filter(id => configured.includes(id));
  return [...new Set([...preferred, ...configured])];
}

function classify(task = '') {
  const text = task.toLowerCase();
  if (/code|coding|program|debug|javascript|python|typescript/.test(text)) return 'coding';
  if (/translate|translation/.test(text)) return 'translation';
  if (/summarize|summary|pdf|document/.test(text)) return 'summarization';
  if (/image|photo|visual/.test(text)) return 'vision';
  return 'general';
}

app.get('/api/health', async () => ({
  status: 'ok',
  service: 'genesis-ai-hunter',
  time: new Date().toISOString(),
  providers: configuredProviders().length,
  providerHealth: Object.fromEntries(health)
}));

app.get('/api/providers', async () => configuredProviders());

app.get('/api/search', async (request) => {
  const q = String(request.query?.q ?? '').toLowerCase();
  return configuredProviders().filter(p => !q || JSON.stringify(p).toLowerCase().includes(q));
});

app.post('/api/route', async (request, reply) => {
  const body = request.body ?? {};
  if (!body.task || typeof body.task !== 'string') {
    return reply.code(400).send({ error: 'task is required' });
  }

  const providers = providerOrder(body);
  if (!providers.length) {
    return reply.code(503).send({
      error: 'no AI providers configured',
      hint: 'Set at least one provider API key in the local environment.'
    });
  }

  const attempts = [];
  const capability = body.capability || classify(body.task);
  const maxAttempts = Math.min(Number(body.max_attempts || providers.length), providers.length);

  for (const providerId of providers.slice(0, maxAttempts)) {
    const adapter = adapters[providerId];
    const started = Date.now();
    try {
      const result = await adapter.chat({ task: body.task, model: body.model });
      const latencyMs = Date.now() - started;
      health.set(providerId, { status: 'healthy', latencyMs, checkedAt: new Date().toISOString() });
      return {
        status: 'ok',
        task: body.task,
        capability,
        provider: providerId,
        model: result.model,
        latencyMs,
        fallbackUsed: attempts.length > 0,
        attempts,
        result: result.text
      };
    } catch (error) {
      const latencyMs = Date.now() - started;
      health.set(providerId, {
        status: 'failed',
        latencyMs,
        error: error.message,
        checkedAt: new Date().toISOString()
      });
      attempts.push({ provider: providerId, latencyMs, error: error.message, status: error.status || 500 });
    }
  }

  return reply.code(502).send({
    status: 'failed',
    capability,
    attempts,
    message: 'All configured provider attempts failed.'
  });
});

const port = Number(process.env.GENESIS_PORT ?? 8080);
await app.listen({ port, host: '0.0.0.0' });
