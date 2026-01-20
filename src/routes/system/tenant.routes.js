'use strict';

const fp = require('fastify-plugin');
const { createTenantSchema } = require('../../schemas/system/tenant.schema');

async function systemTenantRoutes(fastify) {
  fastify.post('/system/tenants', { schema: createTenantSchema }, async (request, reply) => {
    const controller = request.container.resolve('systemTenantController');
    return controller.createTenant(request, reply);
  });
}

module.exports = fp(systemTenantRoutes, { name: 'systemTenantRoutes' });
