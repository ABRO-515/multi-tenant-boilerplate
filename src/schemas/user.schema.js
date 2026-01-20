'use strict';

const userListSchema = {
  tags: ['users'],
  summary: 'List users in the tenant schema',
  response: {
    200: {
      type: 'object',
      additionalProperties: true
    }
  }
};

const userCreateSchema = {
  tags: ['users'],
  summary: 'Create user in the tenant schema',
  body: {
    type: 'object',
    additionalProperties: false,
    required: ['email'],
    properties: {
      email: { type: 'string', 'format': 'email' },
      displayName: { type: 'string' }
    }
  },
  response: {
    200: {
      type: 'object',
      additionalProperties: true
    }
  }
};

module.exports = { userListSchema, userCreateSchema };
