'use strict';

const { UserEntity } = require('../db/entities/User.entity');

module.exports = ({ tenantDataSource }) => {
  const repo = tenantDataSource.getRepository(UserEntity);

  return {
    async count() {
      return repo.count();
    },

    async list() {
      return repo.find({ order: { createdAt: 'DESC' } });
    },

    async findByEmail(email) {
      return repo.findOne({ where: { email } });
    },

    async create({ email, displayName }) {
      const entity = repo.create({ email, displayName });
      return repo.save(entity);
    },

    async createWithAuth({ email, displayName, passwordHash, role }) {
      const entity = repo.create({ email, displayName, passwordHash, role });
      return repo.save(entity);
    }
  };
};
