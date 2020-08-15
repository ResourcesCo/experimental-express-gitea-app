import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class addRoleToUsers1597259424130 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const usersTable: Table = await queryRunner.getTable('users');
    await queryRunner.addColumn(
      usersTable,
      new TableColumn({
        name: 'role',
        type: 'text',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
