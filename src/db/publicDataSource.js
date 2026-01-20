'use strict';

const { DataSource } = require('typeorm');
const { TenantEntity } = require('./entities/Tenant.entity');
const { CreateTenantsTable1700000000000 } = require('./migrations/public/1700000000000-CreateTenantsTable');

function buildPublicDataSource({ config }) {
  return new DataSource({
    type: 'postgres',
    host: config.db.host,
    port: config.db.port,
    username: config.db.user,
    password: config.db.password,
    database: config.db.database,
    schema: 'public',
    synchronize: false,
    logging: false,
    entities: [TenantEntity],
    migrations: [CreateTenantsTable1700000000000]
  });
}

module.exports = { buildPublicDataSource };
