'use strict';

const fp = require('fastify-plugin');

async function auditPlugin(fastify) {
  fastify.decorateRequest('audit', null);

  fastify.addHook('onRequest', async (request) => {
    request.audit = (action, meta = {}) => {
      const tenant = request.tenant || undefined;
      const user = request.user || undefined;

      fastify.logger.info(action, {
        channel: 'audit',
        requestId: request.id,
        method: request.method,
        url: request.url,
        tenant,
        user,
        ...meta
      });
    };
  });
}

module.exports = fp(auditPlugin, { name: 'auditPlugin' });
