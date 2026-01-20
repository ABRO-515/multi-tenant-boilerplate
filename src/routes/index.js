'use strict';

const fp = require('fastify-plugin');

/**
 * Main route registration.
 * @param {import('fastify').FastifyInstance} fastify
 */
async function routes(fastify) {
  const logger = fastify.logger || fastify.log;

  logger.info('🛣️  Registering route groups...');
  logger.info('🛣️  Routes: health');
  await fastify.register(require('./health.routes'));

  logger.info('🛣️  Routes: system/tenant');
  await fastify.register(require('./system/tenant.routes'));

  logger.info('🛣️  Routes: auth');
  await fastify.register(require('./auth.routes'));

  logger.info('🛣️  Routes: users');
  await fastify.register(require('./user.routes'));

  logger.info('🛣️  Route groups registered');
}

module.exports = fp(routes, { name: 'routes' });
