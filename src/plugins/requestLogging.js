'use strict';

const fp = require('fastify-plugin');

/**
 * Request/response logging using Winston (centralized app logger).
 *
 * @param {import('fastify').FastifyInstance} fastify
 */
async function requestLoggingPlugin(fastify) {
  fastify.decorateRequest('logger', null);

  fastify.addHook('onRequest', async (request) => {
    // High-resolution start time for latency measurement.
    request._startAt = process.hrtime.bigint();

    request.logger = typeof fastify.logger.child === 'function'
      ? fastify.logger.child({ requestId: request.id })
      : fastify.logger;
  });

  fastify.addHook('onResponse', async (request, reply) => {
    const durationMs = Number(process.hrtime.bigint() - request._startAt) / 1e6;

    request.logger.info('request completed', {
      requestId: request.id,
      method: request.method,
      url: request.url,
      statusCode: reply.statusCode,
      durationMs
    });
  });

  fastify.addHook('onError', async (request, reply, error) => {
    request.logger.error('request error', {
      requestId: request.id,
      method: request.method,
      url: request.url,
      statusCode: reply.statusCode,
      err: {
        name: error.name,
        message: error.message,
        stack: error.stack
      }
    });
  });
}

module.exports = fp(requestLoggingPlugin, { name: 'requestLoggingPlugin' });
