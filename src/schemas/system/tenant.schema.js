'use strict';

const createTenantSchema = {
  tags: ['system'],
  summary: 'Create a tenant (schema-per-tenant)',
  headers: {
    type: 'object',
    required: ['x-api-key'],
    properties: {
      'x-api-key': { type: 'string' }
    }
  },
  body: {
    type: 'object',
    additionalProperties: false,
    required: ['tenantId', 'name'],
    properties: {
      tenantId: { type: 'string' },
      name: { type: 'string' },
      tenantKey: { type: 'string' }
    }
  },
  response: {
    200: {
      type: 'object',
      additionalProperties: false,
      required: ['tenant', 'tenantKey'],
      properties: {
        tenant: {
          type: 'object',
          additionalProperties: false,
          required: ['id', 'name', 'schemaName', 'createdAt'],
          properties: {
            id: { type: 'string' },
            name: { type: 'string' },
            schemaName: { type: 'string' },
            createdAt: { type: 'string' }
          }
        },
        tenantKey: { type: 'string' }
      }
    }
  }
};

module.exports = { createTenantSchema };
