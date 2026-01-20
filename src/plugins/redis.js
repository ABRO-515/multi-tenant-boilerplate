'use strict';

const fp = require('fastify-plugin');
const { asValue } = require('awilix');

/**
 * Redis connection.
 * Used for sessions, caching, and (later) distributed rate limiting.
 */
async function redisPlugin(fastify) {
  await fastify.register(require('@fastify/redis'), {
    host: fastify.config.redis.host,
    port: fastify.config.redis.port,
    password: fastify.config.redis.password
  });

  fastify.container.register({
    redis: asValue(fastify.redis)
  });
}

module.exports = fp(redisPlugin, { name: 'redisPlugin' });
