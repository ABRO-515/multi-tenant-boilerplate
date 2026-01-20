'use strict';

module.exports = ({ userRepository }) => {
  return {
    async listUsers() {
      return userRepository.list();
    },

    async createUser({ email, displayName }) {
      return userRepository.create({ email, displayName });
    }
  };
};
