'use strict';

class CreateTenantsTable1700000000000 {
  name = 'CreateTenantsTable1700000000000';

  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS public.tenants (
        id varchar(64) PRIMARY KEY,
        name varchar(200) NOT NULL,
        schema_name varchar(128) NOT NULL UNIQUE,
        key_hash varchar(200) NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now()
      );
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS "IDX_TENANTS_ID" ON public.tenants (id);
    `);
  }

  async down(queryRunner) {
    await queryRunner.query('DROP TABLE IF EXISTS public.tenants;');
  }
}

module.exports = { CreateTenantsTable1700000000000 };
