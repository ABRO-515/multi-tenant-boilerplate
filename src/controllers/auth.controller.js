'use strict';

const { toLoginDto, toUserDto } = require('../models/auth.model');

module.exports = ({ authMediator }) => {
  return {
    async register(request, _reply) {
      const { email, displayName, password } = request.body;
      const user = await authMediator.register({ email, displayName, password });

      if (request.audit) {
        request.audit('auth.register', { subject: { userId: user.id, email: user.email } });
      }

      return {
        data: {
          ...toUserDto(user)
        }
      };
    },

    async login(request, _reply) {
      const { email, password } = request.body;
      const tenantId = request.tenant.tenantId;
      const result = await authMediator.login({ tenantId, email, password });

      if (request.audit) {
        request.audit('auth.login', { subject: { userId: result.user.id, email: result.user.email } });
      }

      return { data: toLoginDto(result) };
    },

    async refresh(request, _reply) {
      const tenantId = request.tenant.tenantId;
      const { refreshToken } = request.body;
      const data = await authMediator.refresh({ tenantId, refreshToken });

      if (request.audit) {
        request.audit('auth.refresh');
      }

      return { data };
    },

    async logout(request, _reply) {
      const tenantId = request.tenant.tenantId;
      const { refreshToken } = request.body;
      await authMediator.logout({ tenantId, refreshToken });

      if (request.audit) {
        request.audit('auth.logout');
      }

      return { ok: true };
    }
  };
};
