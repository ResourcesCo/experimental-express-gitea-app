import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createUsers1596593896933 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'text',
            isPrimary: true,
          },
          {
            name: 'email',
            type: 'text',
          },
          {
            name: 'password_digest',
            type: 'text',
          },
          {
            name: 'first_name',
            type: 'text',
          },
          {
            name: 'last_name',
            type: 'text',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('users');
    await queryRunner.dropTable('users');
  }
}
