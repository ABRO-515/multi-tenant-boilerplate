'use strict';

const fp = require('fastify-plugin');
const promClient = require('prom-client');

/**
 * Prometheus metrics endpoint and HTTP latency histogram.
 *
 * @param {import('fastify').FastifyInstance} fastify
 */
async function metricsPlugin(fastify) {
  if (!fastify.config.metrics.enabled) return;

  const register = new promClient.Registry();

  register.setDefaultLabels({
    app: fastify.config.app.name,
    env: fastify.config.env
  });

  const interval = promClient.collectDefaultMetrics({ register });

  const httpRequestDurationMs = new promClient.Histogram({
    name: 'http_request_duration_ms',
    help: 'Duration of HTTP requests in ms',
    labelNames: ['method', 'route', 'status_code'],
    buckets: [5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000],
    registers: [register]
  });

  fastify.addHook('onResponse', async (request, reply) => {
    if (!request._startAt) return;
    const durationMs = Number(process.hrtime.bigint() - request._startAt) / 1e6;
    const route = request.routeOptions?.url || 'unknown';

    httpRequestDurationMs
      .labels(request.method, route, String(reply.statusCode))
      .observe(durationMs);
  });

  fastify.get(fastify.config.metrics.route, async (_request, reply) => {
    reply.header('Content-Type', register.contentType);
    return reply.send(await register.metrics());
  });

  fastify.addHook('onClose', async () => {
    if (interval) {
      clearInterval(interval);
    }
  });
}

module.exports = fp(metricsPlugin, { name: 'metricsPlugin' });
