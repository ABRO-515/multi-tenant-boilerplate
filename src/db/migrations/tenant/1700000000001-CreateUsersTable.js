'use strict';

class CreateUsersTable1700000000001 {
  name = 'CreateUsersTable1700000000001';

  async up(queryRunner) {
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS users (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        email varchar(320) NOT NULL,
        display_name varchar(200),
        created_at timestamptz NOT NULL DEFAULT now(),
        CONSTRAINT "UQ_USERS_EMAIL" UNIQUE (email)
      );
    `);
  }

  async down(queryRunner) {
    await queryRunner.query('DROP TABLE IF EXISTS users;');
  }
}

module.exports = { CreateUsersTable1700000000001 };
