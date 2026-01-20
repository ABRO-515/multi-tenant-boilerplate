'use strict';

const { toTenantDto } = require('../../models/tenant.model');

module.exports = ({ tenantMediator }) => {
  return {
    async createTenant(request, _reply) {
      const apiKey = request.headers['x-api-key'];
      const { tenantId, name, tenantKey } = request.body;

      const { tenant, tenantKey: issuedKey } = await tenantMediator.createTenant({
        apiKey,
        tenantId,
        name,
        tenantKey
      });

      if (request.audit) {
        request.audit('system.tenant.create', { subject: { tenantId: tenant.id, schemaName: tenant.schemaName } });
      }

      // Return the plaintext key only once.
      return {
        tenant: toTenantDto(tenant),
        tenantKey: issuedKey
      };
    }
  };
};
