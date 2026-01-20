'use strict';

const fp = require('fastify-plugin');
const { asValue } = require('awilix');
const { buildPublicDataSource } = require('../db/publicDataSource');

/**
 * Initializes the public (shared) database connection.
 *
 * Public DB is used ONLY for tenant registry + system-level data.
 * Tenant data is never stored in public schema.
 */
async function typeormPlugin(fastify) {
  const publicDataSource = buildPublicDataSource({ config: fastify.config });

  await publicDataSource.initialize();
  await publicDataSource.runMigrations();

  fastify.decorate('publicDataSource', publicDataSource);

  // Register into root container so services can use it.
  fastify.container.register({
    publicDataSource: asValue(publicDataSource)
  });

  fastify.addHook('onClose', async () => {
    if (publicDataSource.isInitialized) {
      await publicDataSource.destroy();
    }
  });
}

module.exports = fp(typeormPlugin, { name: 'typeormPlugin' });
