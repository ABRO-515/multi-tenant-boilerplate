'use strict';

function toTenantDto(tenant) {
  if (!tenant) return tenant;
  return {
    id: tenant.id,
    name: tenant.name,
    schemaName: tenant.schemaName,
    createdAt: tenant.createdAt
  };
}

module.exports = {
  toTenantDto
};
