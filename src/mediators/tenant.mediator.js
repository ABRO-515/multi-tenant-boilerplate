'use strict';

module.exports = ({ tenantService }) => {
  return {
    async createTenant({ apiKey, tenantId, name, tenantKey }) {
      tenantService.verifySystemApiKey(apiKey);
      return tenantService.createTenant({ tenantId, name, tenantKey });
    }
  };
};
