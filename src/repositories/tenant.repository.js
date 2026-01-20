'use strict';

const { TenantEntity } = require('../db/entities/Tenant.entity');

module.exports = ({ publicDataSource }) => {
  const repo = publicDataSource.getRepository(TenantEntity);

  return {
    async findById(id) {
      return repo.findOne({ where: { id } });
    },

    async findBySchemaName(schemaName) {
      return repo.findOne({ where: { schemaName } });
    },

    async createTenant({ id, name, schemaName, keyHash }) {
      const entity = repo.create({ id, name, schemaName, keyHash });
      return repo.save(entity);
    }
  };
};
