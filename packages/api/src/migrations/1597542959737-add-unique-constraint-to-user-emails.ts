import { MigrationInterface, QueryRunner, TableUnique } from 'typeorm';
import { isEqual } from 'lodash';

export class addUniqueConstraintToUserEmails1597542959737
  implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.createUniqueConstraint(
      'users',
      new TableUnique({
        name: 'users_email_key',
        columnNames: ['email'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('users');
    queryRunner.dropUniqueConstraint('users', 'users_email_key');
  }
}
