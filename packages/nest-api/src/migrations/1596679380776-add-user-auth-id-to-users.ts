import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class addUserAuthIdToUsers1596679380776 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const usersTable: Table = await queryRunner.getTable('users');
    await queryRunner.addColumn(
      usersTable,
      new TableColumn({
        name: 'user_auth_id',
        type: 'text',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const usersTable: Table = await queryRunner.getTable('users');
    await queryRunner.dropColumn(usersTable, 'user_auth_id');
  }
}
