'use strict';

const { EntitySchema } = require('typeorm');

const TenantEntity = new EntitySchema({
  name: 'Tenant',
  tableName: 'tenants',
  schema: 'public',
  columns: {
    id: {
      type: 'varchar',
      primary: true,
      length: 64
    },
    name: {
      type: 'varchar',
      length: 200
    },
    schemaName: {
      name: 'schema_name',
      type: 'varchar',
      length: 128,
      unique: true
    },
    keyHash: {
      name: 'key_hash',
      type: 'varchar',
      length: 200
    },
    createdAt: {
      name: 'created_at',
      type: 'timestamptz',
      createDate: true
    }
  },
  indices: [
    {
      name: 'IDX_TENANTS_ID',
      columns: ['id'],
      unique: true
    }
  ]
});

module.exports = { TenantEntity };
