'use strict';

const fp = require('fastify-plugin');

/**
 * Adds helpful utilities like `httpErrors`.
 * @param {import('fastify').FastifyInstance} fastify
 */
async function sensiblePlugin(fastify) {
  await fastify.register(require('@fastify/sensible'));
}

module.exports = fp(sensiblePlugin, { name: 'sensiblePlugin' });
