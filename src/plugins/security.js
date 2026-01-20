'use strict';

const fp = require('fastify-plugin');

/**
 * Security baseline (helmet + CORS).
 * @param {import('fastify').FastifyInstance} fastify
 */
async function securityPlugin(fastify) {
  await fastify.register(require('@fastify/helmet'));

  await fastify.register(require('@fastify/cors'), {
    origin: fastify.config.cors.origin
  });
}

module.exports = fp(securityPlugin, { name: 'securityPlugin' });
