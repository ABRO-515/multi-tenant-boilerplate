'use strict';

class AddAuthColumnsToUsers1700000000002 {
  name = 'AddAuthColumnsToUsers1700000000002';

  async up(queryRunner) {
    await queryRunner.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash varchar(200);`);
    await queryRunner.query(`ALTER TABLE users ADD COLUMN IF NOT EXISTS role varchar(50) NOT NULL DEFAULT 'user';`);
  }

  async down(queryRunner) {
    await queryRunner.query('ALTER TABLE users DROP COLUMN IF EXISTS password_hash;');
    await queryRunner.query('ALTER TABLE users DROP COLUMN IF EXISTS role;');
  }
}

module.exports = { AddAuthColumnsToUsers1700000000002 };
