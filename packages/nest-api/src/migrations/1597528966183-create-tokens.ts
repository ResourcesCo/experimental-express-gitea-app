import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import { isEqual } from 'lodash';

export class createTokens1597528966183 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tokens',
        columns: [
          {
            name: 'id',
            type: 'text',
            isPrimary: true,
          },
          {
            name: 'user_id',
            type: 'text',
          },
          {
            name: 'token',
            type: 'text',
          },
          {
            name: 'type',
            type: 'text',
          },
          {
            name: 'is_active',
            type: 'boolean',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'expires_at',
            type: 'timestamp',
          },
        ],
      }),
    );
    await queryRunner.createForeignKey(
      'tokens',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('tokens');
    const foreignKey = table.foreignKeys.find(fk =>
      isEqual(fk.columnNames, ['user_id']),
    );
    await queryRunner.dropForeignKey('tokens', foreignKey);
    await queryRunner.dropTable('tokens');
  }
}
