import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';
import { resolveIdType } from '../util/helper-migrate';

export class CreateFeedCommentsTable1762055100000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    const dbType = queryRunner.connection.options.type;

    // ✅ garante UUID default no Postgres
    if (dbType === 'postgres') {
      await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);
    }

    await queryRunner.createTable(
      new Table({
        name: 'feed_comments',
        columns: [
          {
            name: 'id',
            type: resolveIdType(dbType),
            isPrimary: true,
            isNullable: false,
            ...(dbType === 'postgres' ? { default: 'gen_random_uuid()' } : {}),
          },
          {
            name: 'feedId',
            type: resolveIdType(dbType),
            isNullable: false,
          },
          {
            name: 'userId',
            type: resolveIdType(dbType),
            isNullable: false,
          },
          {
            name: 'content',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'deletedAt',
            type: 'timestamp',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'feed_comments',
      new TableIndex({
        name: 'IDX_feedComment_feedId',
        columnNames: ['feedId'],
      }),
    );

    await queryRunner.createIndex(
      'feed_comments',
      new TableIndex({
        name: 'IDX_feedComment_userId',
        columnNames: ['userId'],
      }),
    );

    await queryRunner.createForeignKey(
      'feed_comments',
      new TableForeignKey({
        name: 'FK_feedComment_feedId__feed_id',
        columnNames: ['feedId'],
        referencedTableName: 'feed',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'feed_comments',
      new TableForeignKey({
        name: 'FK_feedComment_userId__users_id',
        columnNames: ['userId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('feed_comments');
  }
}
