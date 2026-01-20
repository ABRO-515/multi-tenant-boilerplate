'use strict';

const { EntitySchema } = require('typeorm');

const UserEntity = new EntitySchema({
  name: 'User',
  tableName: 'users',
  columns: {
    id: {
      type: 'uuid',
      primary: true,
      generated: 'uuid'
    },
    email: {
      type: 'varchar',
      length: 320,
      unique: true
    },
    displayName: {
      name: 'display_name',
      type: 'varchar',
      length: 200,
      nullable: true
    },
    passwordHash: {
      name: 'password_hash',
      type: 'varchar',
      length: 200,
      nullable: true
    },
    role: {
      type: 'varchar',
      length: 50,
      default: 'user'
    },
    createdAt: {
      name: 'created_at',
      type: 'timestamptz',
      createDate: true
    }
  },
  indices: [
    {
      name: 'IDX_USERS_EMAIL',
      columns: ['email'],
      unique: true
    }
  ]
});

module.exports = { UserEntity };
