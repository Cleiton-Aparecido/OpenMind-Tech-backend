import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';
import {
  resolveGenerationStrategy,
  resolveIdDefault,
  resolveIdType,
} from '../util/helper-migrate';

export class CreateFeedLikesTable1762055000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const dbType = queryRunner.connection.options.type;

    await queryRunner.createTable(
      new Table({
        name: 'feed_likes',
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
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'feed_likes',
      new TableIndex({
        name: 'IDX_feedLike_feedId',
        columnNames: ['feedId'],
      }),
    );

    await queryRunner.createIndex(
      'feed_likes',
      new TableIndex({
        name: 'IDX_feedLike_userId',
        columnNames: ['userId'],
      }),
    );

    await queryRunner.createIndex(
      'feed_likes',
      new TableIndex({
        name: 'UQ_feedLike_feedId_userId',
        columnNames: ['feedId', 'userId'],
        isUnique: true,
      }),
    );

    await queryRunner.createForeignKey(
      'feed_likes',
      new TableForeignKey({
        name: 'FK_feedLike_feedId__feed_id',
        columnNames: ['feedId'],
        referencedTableName: 'feed',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'feed_likes',
      new TableForeignKey({
        name: 'FK_feedLike_userId__users_id',
        columnNames: ['userId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('feed_likes');
  }
}
