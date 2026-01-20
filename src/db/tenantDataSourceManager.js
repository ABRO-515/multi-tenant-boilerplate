'use strict';

const { DataSource } = require('typeorm');
const { LRUCache } = require('lru-cache');
const { UserEntity } = require('./entities/User.entity');
const { CreateUsersTable1700000000001 } = require('./migrations/tenant/1700000000001-CreateUsersTable');
const { AddAuthColumnsToUsers1700000000002 } = require('./migrations/tenant/1700000000002-AddAuthColumnsToUsers');
const { escapeIdentifier } = require('../utils/identifiers');

function buildTenantDataSource({ config, schemaName }) {
  return new DataSource({
    type: 'postgres',
    host: config.db.host,
    port: config.db.port,
    username: config.db.user,
    password: config.db.password,
    database: config.db.database,
    schema: schemaName,
    synchronize: false,
    logging: false,
    entities: [UserEntity],
    migrations: [CreateUsersTable1700000000001, AddAuthColumnsToUsers1700000000002]
  });
}

module.exports = ({ config, publicDataSource, logger }) => {
  const cache = new LRUCache({
    max: 200,
    ttl: 1000 * 60 * 30
  });

  async function ensureSchemaExists(schemaName) {
    const ident = escapeIdentifier(schemaName);
    await publicDataSource.query(`CREATE SCHEMA IF NOT EXISTS ${ident};`);
  }

  async function getDataSource(schemaName) {
    const cached = cache.get(schemaName);
    if (cached && cached.isInitialized) return cached;

    const ds = buildTenantDataSource({ config, schemaName });
    await ds.initialize();

    cache.set(schemaName, ds);
    return ds;
  }

  async function runMigrations(schemaName) {
    await ensureSchemaExists(schemaName);
    const ds = await getDataSource(schemaName);
    await ds.runMigrations();
  }

  async function shutdown() {
    for (const ds of cache.values()) {
      try {
        if (ds?.isInitialized) await ds.destroy();
      } catch (err) {
        logger.error('tenant datasource destroy error', {
          err: {
            name: err.name,
            message: err.message,
            stack: err.stack
          }
        });
      }
    }

    cache.clear();
  }

  return {
    ensureSchemaExists,
    getDataSource,
    runMigrations,
    shutdown
  };
};
