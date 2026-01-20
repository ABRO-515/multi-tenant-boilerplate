'use strict';

module.exports = ({ userService }) => {
  return {
    async listUsers() {
      return userService.listUsers();
    },

    async createUser({ email, displayName }) {
      return userService.createUser({ email, displayName });
    }
  };
};
