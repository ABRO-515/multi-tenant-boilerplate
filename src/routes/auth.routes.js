'use strict';

const fp = require('fastify-plugin');
const { registerSchema, loginSchema, refreshSchema, logoutSchema } = require('../schemas/auth.schema');

async function authRoutes(fastify) {
  fastify.post('/v1/auth/register', { schema: registerSchema }, async (request, reply) => {
    const controller = request.container.resolve('authController');
    return controller.register(request, reply);
  });

  fastify.post('/v1/auth/login', { schema: loginSchema }, async (request, reply) => {
    const controller = request.container.resolve('authController');
    return controller.login(request, reply);
  });

  fastify.post('/v1/auth/refresh', { schema: refreshSchema }, async (request, reply) => {
    const controller = request.container.resolve('authController');
    return controller.refresh(request, reply);
  });

  fastify.post('/v1/auth/logout', { schema: logoutSchema }, async (request, reply) => {
    const controller = request.container.resolve('authController');
    return controller.logout(request, reply);
  });
}

module.exports = fp(authRoutes, { name: 'authRoutes' });
