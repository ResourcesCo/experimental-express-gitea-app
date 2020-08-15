import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class addActiveToUsers1597260032072 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const usersTable: Table = await queryRunner.getTable('users');
    await queryRunner.addColumn(
      usersTable,
      new TableColumn({
        name: 'is_active',
        type: 'boolean',
        default: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
