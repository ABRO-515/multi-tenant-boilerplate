'use strict';

const fp = require('fastify-plugin');
const { asValue } = require('awilix');
const { resolveTenant } = require('../utils/tenantResolver');

function shouldSkipTenancy(url) {
  return (
    url === '/health' ||
    url.startsWith('/docs') ||
    url.startsWith('/metrics') ||
    url.startsWith('/system')
  );
}

/**
 * Resolves tenant per request and attaches tenant context to request DI scope.
 */
async function tenancyPlugin(fastify) {
  // Lazy-require to avoid circular deps at boot.
  const buildTenantDataSourceManager = require('../db/tenantDataSourceManager');

  const tenantDataSourceManager = buildTenantDataSourceManager({
    config: fastify.config,
    publicDataSource: fastify.publicDataSource,
    logger: fastify.logger
  });

  fastify.decorate('tenantDataSourceManager', tenantDataSourceManager);
  fastify.container.register({ tenantDataSourceManager: asValue(tenantDataSourceManager) });

  fastify.decorateRequest('tenant', null);

  fastify.addHook('onRequest', async (request) => {
    if (shouldSkipTenancy(request.url)) return;

    const { tenantId, tenantKey, resolvedBy } = resolveTenant({
      request,
      config: fastify.config
    });

    if (!tenantId) {
      throw fastify.httpErrors.unauthorized('Tenant not resolved');
    }

    const tenantService = request.container.resolve('tenantService');
    const tenant = await tenantService.verifyTenant({ tenantId, tenantKey });

    const tenantDs = await tenantDataSourceManager.getDataSource(tenant.schemaName);

    const tenantContext = {
      tenantId: tenant.id,
      schemaName: tenant.schemaName,
      resolvedBy
    };

    request.tenant = tenantContext;

    request.container.register({
      tenantContext: asValue(tenantContext),
      tenantDataSource: asValue(tenantDs)
    });
  });

  fastify.addHook('onClose', async () => {
    await tenantDataSourceManager.shutdown();
  });
}

module.exports = fp(tenancyPlugin, { name: 'tenancyPlugin' });
