'use strict';

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { normalizeTenantId, toSchemaName } = require('../utils/identifiers');

module.exports = ({ config, tenantRepository, tenantDataSourceManager }) => {
  return {
    async verifyTenant({ tenantId, tenantKey }) {
      const normalized = normalizeTenantId(tenantId);
      if (!normalized) {
        throw new Error('Invalid tenant id');
      }

      const tenant = await tenantRepository.findById(normalized);
      if (!tenant) {
        const err = new Error('Invalid tenant');
        err.statusCode = 401;
        throw err;
      }

      if (!tenantKey) {
        const err = new Error('Tenant key required');
        err.statusCode = 401;
        throw err;
      }

      const ok = await bcrypt.compare(tenantKey, tenant.keyHash);
      if (!ok) {
        const err = new Error('Invalid tenant key');
        err.statusCode = 401;
        throw err;
      }

      // Ensure schema is migrated before use (idempotent).
      await tenantDataSourceManager.runMigrations(tenant.schemaName);

      return tenant;
    },

    async createTenant({ tenantId, name, tenantKey }) {
      const normalized = normalizeTenantId(tenantId);
      if (!normalized) {
        throw new Error('Invalid tenant id');
      }

      const schemaName = toSchemaName(normalized);
      if (!schemaName) {
        throw new Error('Invalid tenant schema name');
      }

      const existing = await tenantRepository.findById(normalized);
      if (existing) {
        const err = new Error('Tenant already exists');
        err.statusCode = 409;
        throw err;
      }

      const plainKey = tenantKey || uuidv4().replace(/-/g, '');
      const keyHash = await bcrypt.hash(plainKey, 10);

      const created = await tenantRepository.createTenant({
        id: normalized,
        name,
        schemaName,
        keyHash
      });

      await tenantDataSourceManager.runMigrations(schemaName);

      return {
        tenant: created,
        tenantKey: plainKey
      };
    },

    verifySystemApiKey(apiKey) {
      if (!apiKey || String(apiKey) !== String(config.system.apiKey)) {
        const err = new Error('Invalid system api key');
        err.statusCode = 401;
        throw err;
      }
    }
  };
};
