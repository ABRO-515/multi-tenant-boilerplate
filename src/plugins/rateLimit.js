'use strict';

const fp = require('fastify-plugin');

/**
 * Global rate limiting.
 *
 * Later we will back this with Redis for horizontally-scaled deployments.
 *
 * @param {import('fastify').FastifyInstance} fastify
 */
async function rateLimitPlugin(fastify) {
  if (!fastify.config.rateLimit.enabled) return;

  const opts = {
    max: fastify.config.rateLimit.max,
    timeWindow: fastify.config.rateLimit.timeWindow
  };

  if (fastify.redis) {
    opts.redis = fastify.redis;
  }

  await fastify.register(require('@fastify/rate-limit'), opts);
}

module.exports = fp(rateLimitPlugin, { name: 'rateLimitPlugin' });
