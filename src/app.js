'use strict';

const fastify = require('fastify');
const { v4: uuidv4 } = require('uuid');

/**
 * Fastify app factory.
 *
 * @param {{ container: import('awilix').AwilixContainer }} params
 * @returns {Promise<import('fastify').FastifyInstance>}
 */
async function buildApp({ container }) {
  const config = container.resolve('config');
  const logger = container.resolve('logger');

  const app = fastify({
    logger: false,
    disableRequestLogging: true,
    genReqId: () => uuidv4(),
    ajv: {
      customOptions: {
        allErrors: true
      }
    }
  });

  app.decorate('container', container);
  app.decorate('config', config);
  app.decorate('logger', logger);

  logger.info('🧱 Loading plugins...');

  logger.info('🧩 Plugin: sensible');
  await app.register(require('./plugins/sensible'));
  logger.info('🧩 Plugin: typeorm');
  await app.register(require('./plugins/typeorm'));
  logger.info('🧩 Plugin: redis');
  await app.register(require('./plugins/redis'));
  logger.info('🧩 Plugin: rabbitmq');
  await app.register(require('./plugins/rabbitmq'));
  logger.info('🧩 Plugin: security');
  await app.register(require('./plugins/security'));
  logger.info('🧩 Plugin: rateLimit');
  await app.register(require('./plugins/rateLimit'));
  logger.info('🧩 Plugin: di');
  await app.register(require('./plugins/di'));
  logger.info('🧩 Plugin: tenancy');
  await app.register(require('./plugins/tenancy'));
  logger.info('🧩 Plugin: auth');
  await app.register(require('./plugins/auth'));
  logger.info('🧩 Plugin: audit');
  await app.register(require('./plugins/audit'));
  logger.info('🧩 Plugin: requestLogging');
  await app.register(require('./plugins/requestLogging'));
  logger.info('🧩 Plugin: metrics');
  await app.register(require('./plugins/metrics'));
  logger.info('🧩 Plugin: swagger');
  await app.register(require('./plugins/swagger'));

  logger.info('🛣️  Loading routes...');
  await app.register(require('./routes'));
  logger.info('🛣️  Routes loaded');

  app.setNotFoundHandler((request, reply) => {
    reply.code(404).send({
      statusCode: 404,
      error: 'Not Found',
      message: `Route ${request.method} ${request.url} not found`
    });
  });

  app.setErrorHandler((error, request, reply) => {
    const statusCode = error.statusCode || 500;

    const isValidationError = Array.isArray(error.validation);

    (request.logger || logger).error('unhandled error', {
      requestId: request.id,
      statusCode,
      err: {
        name: error.name,
        message: error.message,
        stack: error.stack
      }
    });

    const response = {
      statusCode,
      error: isValidationError ? 'Bad Request' : error.name || 'Error',
      message: isValidationError ? 'Validation error' : error.message
    };

    if (isValidationError && config.env !== 'production') {
      response.details = error.validation;
    }

    reply.code(statusCode).send(response);
  });

  return app;
}

module.exports = { buildApp };
