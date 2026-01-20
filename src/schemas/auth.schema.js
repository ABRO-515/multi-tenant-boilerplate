'use strict';

const registerSchema = {
  tags: ['auth'],
  summary: 'Register user in the tenant',
  body: {
    type: 'object',
    additionalProperties: false,
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string', minLength: 8 },
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

const loginSchema = {
  tags: ['auth'],
  summary: 'Login (returns access + refresh tokens)',
  body: {
    type: 'object',
    additionalProperties: false,
    required: ['email', 'password'],
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string' }
    }
  },
  response: {
    200: {
      type: 'object',
      additionalProperties: true
    }
  }
};

const refreshSchema = {
  tags: ['auth'],
  summary: 'Refresh access token',
  body: {
    type: 'object',
    additionalProperties: false,
    required: ['refreshToken'],
    properties: {
      refreshToken: { type: 'string' }
    }
  },
  response: {
    200: {
      type: 'object',
      additionalProperties: true
    }
  }
};

const logoutSchema = {
  tags: ['auth'],
  summary: 'Logout (invalidate refresh token)',
  body: {
    type: 'object',
    additionalProperties: false,
    required: ['refreshToken'],
    properties: {
      refreshToken: { type: 'string' }
    }
  },
  response: {
    200: {
      type: 'object',
      additionalProperties: true
    }
  }
};

module.exports = { registerSchema, loginSchema, refreshSchema, logoutSchema };
