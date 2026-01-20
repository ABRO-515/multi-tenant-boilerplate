'use strict';

const fp = require('fastify-plugin');
const { asValue } = require('awilix');

/**
 * Creates a per-request scope and attaches it to `request.container`.
 *
 * Later, this is where we’ll register tenant context (schema, tenantId) and auth context.
 *
 * @param {import('fastify').FastifyInstance} fastify
 */
async function diPlugin(fastify) {
  fastify.decorateRequest('container', null);

  fastify.addHook('onRequest', async (request) => {
    const scope = fastify.container.createScope();
    scope.register({ request: asValue(request) });
    request.container = scope;
  });
}

module.exports = fp(diPlugin, { name: 'diPlugin' });
