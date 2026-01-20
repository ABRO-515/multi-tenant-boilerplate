'use strict';

module.exports = ({ authService }) => {
  return {
    async register({ email, displayName, password }) {
      return authService.register({ email, displayName, password });
    },

    async login({ tenantId, email, password }) {
      return authService.login({ tenantId, email, password });
    },

    async refresh({ tenantId, refreshToken }) {
      return authService.refresh({ tenantId, refreshToken });
    },

    async logout({ tenantId, refreshToken }) {
      return authService.logout({ tenantId, refreshToken });
    }
  };
};
