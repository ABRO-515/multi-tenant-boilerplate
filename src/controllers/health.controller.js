'use strict';

/**
 * @param {{ healthService: { getHealth: () => { status: string, app: string, env: string, uptime: number } } }} deps
 */
module.exports = ({ healthService }) => {
  return {
    /**
     * @param {import('fastify').FastifyRequest} _request
     * @param {import('fastify').FastifyReply} _reply
     */
    async getHealth(_request, _reply) {
      return healthService.getHealth();
    }
  };
};
