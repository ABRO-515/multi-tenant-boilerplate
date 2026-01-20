'use strict';

const fp = require('fastify-plugin');
const { asValue } = require('awilix');

function parseBearer(request) {
  const header = request.headers.authorization;
  if (!header) return null;
  const value = String(header);
  const [type, token] = value.split(' ');
  if (!type || type.toLowerCase() !== 'bearer') return null;
  return token || null;
}

async function authPlugin(fastify) {
  fastify.decorateRequest('user', null);

  fastify.decorate('authenticate', async (request) => {
    const token = parseBearer(request);
    if (!token) {
      throw fastify.httpErrors.unauthorized('Missing bearer token');
    }

    const authService = request.container.resolve('authService');

    let payload;
    try {
      payload = authService.verifyAccessToken(token);
    } catch (_err) {
      throw fastify.httpErrors.unauthorized('Invalid token');
    }

    // Ensure token tenant matches resolved tenant.
    if (!request.tenant || payload.tid !== request.tenant.tenantId) {
      throw fastify.httpErrors.unauthorized('Tenant mismatch');
    }

    const userContext = {
      userId: payload.sub,
      role: payload.role,
      scopes: payload.scopes || []
    };

    request.user = userContext;
    request.container.register({ userContext: asValue(userContext) });
  });

  fastify.decorate('authorize', (requiredScopes) => {
    return async (request) => {
      if (!request.user) {
        throw fastify.httpErrors.unauthorized('Not authenticated');
      }

      const scopes = request.user.scopes || [];
      if (scopes.includes('*')) return;

      const needed = Array.isArray(requiredScopes) ? requiredScopes : [requiredScopes];
      const ok = needed.every((s) => scopes.includes(s));
      if (!ok) {
        throw fastify.httpErrors.forbidden('Missing required scope');
      }
    };
  });

  // Also make these available in the root DI container if needed.
  fastify.container.register({
    authenticate: asValue(fastify.authenticate),
    authorize: asValue(fastify.authorize)
  });
}

module.exports = fp(authPlugin, { name: 'authPlugin' });
