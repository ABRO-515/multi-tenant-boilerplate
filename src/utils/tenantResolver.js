'use strict';

const { normalizeTenantId } = require('./identifiers');

function getHost(request) {
  // prefer x-forwarded-host when behind proxies
  const xfHost = request.headers['x-forwarded-host'];
  const host = xfHost || request.headers.host;
  if (!host) return null;
  return String(host).split(',')[0].trim();
}

function resolveTenantFromSubdomain({ request, baseDomain }) {
  if (!baseDomain) return null;
  const host = getHost(request);
  if (!host) return null;

  const hostname = host.split(':')[0].toLowerCase();
  const base = baseDomain.toLowerCase();

  if (hostname === base) return null;
  if (!hostname.endsWith(`.${base}`)) return null;

  const subdomain = hostname.slice(0, hostname.length - (base.length + 1));
  if (!subdomain) return null;

  // Support multi-level subdomains by taking the left-most segment.
  const tenantId = subdomain.split('.')[0];
  return normalizeTenantId(tenantId);
}

function resolveTenant({ request, config }) {
  const headerIdName = config.tenancy.headers.tenantId;
  const headerKeyName = config.tenancy.headers.tenantKey;

  const tenantIdHeader = request.headers[headerIdName];
  const tenantKeyHeader = request.headers[headerKeyName];

  const tenantId = normalizeTenantId(tenantIdHeader);
  const tenantKey = tenantKeyHeader ? String(tenantKeyHeader).trim() : null;

  const subdomainTenantId = resolveTenantFromSubdomain({
    request,
    baseDomain: config.tenancy.baseDomain
  });

  return {
    tenantId: tenantId || subdomainTenantId || null,
    tenantKey: tenantKey || null,
    resolvedBy: tenantId ? 'header' : subdomainTenantId ? 'subdomain' : null
  };
}

module.exports = { resolveTenant };
