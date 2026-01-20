'use strict';

const healthGetSchema = {
  tags: ['system'],
  summary: 'Health check',
  response: {
    200: {
      type: 'object',
      additionalProperties: false,
      required: ['status', 'app', 'env', 'uptime'],
      properties: {
        status: { type: 'string' },
        app: { type: 'string' },
        env: { type: 'string' },
        uptime: { type: 'number' }
      }
    }
  }
};

module.exports = { healthGetSchema };
