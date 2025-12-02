import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';
import {
  resolveDateDefault,
  resolveDateType,
  resolveGenerationStrategy,
  resolveIdDefault,
  resolveIdType,
} from '../util/helper-migrate';

export class NewMigration1761335631254 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const dbType = queryRunner.connection.options.type;

    // Criação da tabela principal
    await queryRunner.createTable(
      new Table({
        name: 'feed',
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
            name: 'title',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'content',
            type: dbType === 'mssql' ? 'nvarchar(max)' : 'text',
            isNullable: false,
          },
          {
            name: 'userId',
            type: resolveIdType(dbType),
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
        indices: [
          {
            name: 'IDX_feed_userId',
            columnNames: ['userId'],
          },
        ],
      }),
      true,
    );

    // Criação da chave estrangeira
    await queryRunner.createForeignKey(
      'feed',
      new TableForeignKey({
        name: 'FK_feed_userId__users_id',
        columnNames: ['userId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove a FK primeiro (boa prática)
    const table = await queryRunner.getTable('feed');
    const foreignKey = table?.foreignKeys.find(
      (fk) => fk.name === 'FK_feed_userId__users_id',
    );
    if (foreignKey) {
      await queryRunner.dropForeignKey('feed', foreignKey);
    }

    await queryRunner.dropTable('feed');
  }

  // === Helpers para compatibilidade multi-banco ===

  private resolveIdType(db: string): string {
    switch (db) {
      case 'postgres':
        return 'uuid';
      case 'mssql':
        return 'uniqueidentifier';
      case 'sqlite':
        return 'text';
      default:
        return 'char';
    }
  }

  private resolveGenerationStrategy(db: string): 'uuid' | undefined {
    return db === 'postgres' ? 'uuid' : undefined;
  }

  private resolveIdDefault(db: string): string | undefined {
    switch (db) {
      case 'postgres':
        return 'gen_random_uuid()';
      case 'mysql':
      case 'mariadb':
        return '(UUID())';
      case 'mssql':
        return 'NEWID()';
      case 'sqlite':
        return '(lower(hex(randomblob(16))))';
      default:
        return undefined;
    }
  }

  private resolveDateType(db: string): string {
    return db === 'mssql' ? 'datetime' : 'timestamp';
  }

  private resolveDateDefault(db: string): string {
    switch (db) {
      case 'postgres':
        return 'now()';
      case 'mysql':
      case 'mariadb':
        return 'CURRENT_TIMESTAMP';
      case 'sqlite':
        return "(datetime('now'))";
      case 'mssql':
        return 'GETDATE()';
      default:
        return 'CURRENT_TIMESTAMP';
    }
  }
}
