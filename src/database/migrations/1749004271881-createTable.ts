import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import {
  resolveDateDefault,
  resolveDateType,
  resolveGenerationStrategy,
  resolveIdDefault,
  resolveIdType,
} from '../util/helper-migrate';

export class CreateTable1749004271881 implements MigrationInterface {
  name = 'CreateTable1749004271881';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const dbType = queryRunner.connection.options.type;

    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: resolveIdType(dbType),
            isPrimary: true,
            isNullable: false,
            generationStrategy: resolveGenerationStrategy(dbType),
            default: resolveIdDefault(dbType),
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isNullable: false,
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: resolveDateType(dbType),
            default: resolveDateDefault(dbType),
            isNullable: false,
          },
          {
            name: 'updatedAt',
            type: resolveDateType(dbType),
            default: resolveDateDefault(dbType),
            isNullable: false,
          },
          {
            name: 'deletedAt',
            type: resolveDateType(dbType),
            isNullable: true,
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users');
  }
}
