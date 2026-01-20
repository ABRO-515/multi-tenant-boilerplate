'use strict';

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { randomToken } = require('../utils/tokens');

function sessionKey({ tenantId, refreshToken }) {
  return `sess:${tenantId}:${refreshToken}`;
}

module.exports = ({ config, redis, userRepository }) => {
  return {
    async register({ email, displayName, password, makeAdminIfFirstUser = true }) {
      const existing = await userRepository.findByEmail(email);
      if (existing) {
        const err = new Error('Email already in use');
        err.statusCode = 409;
        throw err;
      }

      const passwordHash = await bcrypt.hash(String(password), 10);

      let role = 'user';
      if (makeAdminIfFirstUser) {
        const count = await userRepository.count();
        if (count === 0) role = 'admin';
      }

      return userRepository.createWithAuth({ email, displayName, passwordHash, role });
    },

    async login({ tenantId, email, password }) {
      const user = await userRepository.findByEmail(email);
      if (!user || !user.passwordHash) {
        const err = new Error('Invalid credentials');
        err.statusCode = 401;
        throw err;
      }

      const ok = await bcrypt.compare(String(password), user.passwordHash);
      if (!ok) {
        const err = new Error('Invalid credentials');
        err.statusCode = 401;
        throw err;
      }

      const scopes = user.role === 'admin'
        ? ['*', 'users:write']
        : ['read:profile'];

      const accessToken = jwt.sign(
        {
          tid: tenantId,
          role: user.role,
          scopes
        },
        config.auth.jwtAccessSecret,
        {
          subject: String(user.id),
          expiresIn: config.auth.jwtAccessTtlSeconds
        }
      );

      const refreshToken = randomToken(32);
      const refreshTtl = config.auth.refreshTokenTtlSeconds;

      await redis.set(
        sessionKey({ tenantId, refreshToken }),
        JSON.stringify({
          userId: user.id,
          tenantId,
          role: user.role,
          scopes
        }),
        'EX',
        refreshTtl
      );

      return {
        accessToken,
        expiresIn: config.auth.jwtAccessTtlSeconds,
        refreshToken,
        refreshExpiresIn: refreshTtl,
        user: {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          role: user.role
        }
      };
    },

    async refresh({ tenantId, refreshToken }) {
      if (!refreshToken) {
        const err = new Error('refreshToken required');
        err.statusCode = 400;
        throw err;
      }

      const raw = await redis.get(sessionKey({ tenantId, refreshToken }));
      if (!raw) {
        const err = new Error('Invalid refresh token');
        err.statusCode = 401;
        throw err;
      }

      const session = JSON.parse(raw);

      const accessToken = jwt.sign(
        {
          tid: tenantId,
          role: session.role,
          scopes: session.scopes
        },
        config.auth.jwtAccessSecret,
        {
          subject: String(session.userId),
          expiresIn: config.auth.jwtAccessTtlSeconds
        }
      );

      return {
        accessToken,
        expiresIn: config.auth.jwtAccessTtlSeconds
      };
    },

    async logout({ tenantId, refreshToken }) {
      if (!refreshToken) return;
      await redis.del(sessionKey({ tenantId, refreshToken }));
    },

    verifyAccessToken(token) {
      return jwt.verify(token, config.auth.jwtAccessSecret);
    }
  };
};
