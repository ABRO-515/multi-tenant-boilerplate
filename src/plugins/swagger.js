'use strict';

const fp = require('fastify-plugin');

/**
 * Swagger/OpenAPI docs on `/docs`.
 * @param {import('fastify').FastifyInstance} fastify
 */
async function swaggerPlugin(fastify) {
  if (!fastify.config.swagger.enabled) return;

  await fastify.register(require('@fastify/swagger'), {
    openapi: {
      info: {
        title: fastify.config.app.name,
        version: '0.1.0'
      }
    }
  });

  await fastify.register(require('@fastify/swagger-ui'), {
    routePrefix: fastify.config.swagger.routePrefix,
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false
    }
  });
}

module.exports = fp(swaggerPlugin, { name: 'swaggerPlugin' });
