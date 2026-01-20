'use strict';

const { toUserDto } = require('../models/user.model');

module.exports = ({ userMediator }) => {
  
  return {
    async list(request, _reply) {
      const users = await userMediator.listUsers();
      return {
        tenant: request.tenant,
        data: users.map(toUserDto)
      };
    },

    async create(request, _reply) {
      const created = await userMediator.createUser(request.body);

      if (request.audit) {
        request.audit('users.create', { subject: { userId: created.id, email: created.email } });
      }

      return { tenant: request.tenant, data: toUserDto(created) };
    }
  };
};
