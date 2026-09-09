import Fastify from 'fastify';
import cors from '@fastify/cors';

const app = Fastify({ logger: true });
await app.register(cors, { origin: true });

const providers = new Map();

app.get('/api/health', async () => ({
  status: 'ok',
  service: 'genesis-ai-hunter',
  time: new Date().toISOString(),
  providers: providers.size
}));

app.get('/api/search', async (request) => {
  const q = String(request.query?.q ?? '').toLowerCase();
  return [...providers.values()].filter(p => !q || JSON.stringify(p).toLowerCase().includes(q));
});

app.post('/api/route', async (request, reply) => {
  const body = request.body ?? {};
  if (!body.task) return reply.code(400).send({ error: 'task is required' });
  return {
    status: 'accepted',
    policy: 'capability-cost-latency-reliability-fallback',
    task: body.task,
    message: 'Routing engine scaffold is ready; provider adapters will execute the task.'
  };
});

const port = Number(process.env.GENESIS_PORT ?? 8080);
await app.listen({ port, host: '0.0.0.0' });
