'use strict';

const fp = require('fastify-plugin');
const { healthGetSchema } = require('../schemas/health.schema');

/**
 * @param {import('fastify').FastifyInstance} fastify
 */
async function healthRoutes(fastify) {
  fastify.get('/health', { schema: healthGetSchema }, async (request, reply) => {
    const controller = request.container.resolve('healthController');
    return controller.getHealth(request, reply);
  });
}

module.exports = fp(healthRoutes, { name: 'healthRoutes' });
