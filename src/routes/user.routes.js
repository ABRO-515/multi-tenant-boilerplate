'use strict';

const fp = require('fastify-plugin');
const { userListSchema, userCreateSchema } = require('../schemas/user.schema');

async function userRoutes(fastify) {
  fastify.get('/v1/users', { schema: userListSchema, preHandler: [fastify.authenticate] }, async (request, reply) => {
    const controller = request.container.resolve('userController');
    return controller.list(request, reply);
  });

  fastify.post(
    '/v1/users',
    { schema: userCreateSchema, preHandler: [fastify.authenticate, fastify.authorize('users:write')] },
    async (request, reply) => {
      const controller = request.container.resolve('userController');
      return controller.create(request, reply);
    }
  );
}

module.exports = fp(userRoutes, { name: 'userRoutes' });
