'use strict';

function normalizeTenantId(input) {
  if (!input) return null;
  const trimmed = String(input).trim();
  if (!trimmed) return null;

  // Allow common slug-like IDs. Keep it predictable.
  const ok = /^[a-zA-Z0-9][a-zA-Z0-9-_]{1,62}$/.test(trimmed);
  return ok ? trimmed : null;
}

function toSchemaName(tenantId) {
  const normalized = normalizeTenantId(tenantId);
  if (!normalized) return null;

  // Postgres identifier: lowercase + underscore.
  const safe = normalized.toLowerCase().replace(/[^a-z0-9_]/g, '_');
  const schema = `tenant_${safe}`;

  // Ensure schema is a safe identifier.
  if (!/^[a-z_][a-z0-9_]*$/.test(schema)) return null;
  return schema;
}

function escapeIdentifier(identifier) {
  // Only escape validated identifiers. This is defense-in-depth.
  if (!/^[a-z_][a-z0-9_]*$/.test(identifier)) {
    throw new Error('Invalid SQL identifier');
  }
  return `"${identifier}"`;
}

module.exports = {
  normalizeTenantId,
  toSchemaName,
  escapeIdentifier
};
