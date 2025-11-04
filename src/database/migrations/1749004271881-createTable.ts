import { MigrationInterface, QueryRunner, Table } from 'typeorm';

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
            type: this.resolveIdType(dbType),
            isPrimary: true,
            isNullable: false,
            generationStrategy: this.resolveGenerationStrategy(dbType),
            default: this.resolveIdDefault(dbType),
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
            type: this.resolveDateType(dbType),
            default: this.resolveDateDefault(dbType),
            isNullable: false,
          },
          {
            name: 'updatedAt',
            type: this.resolveDateType(dbType),
            default: this.resolveDateDefault(dbType),
            isNullable: false,
          },
          {
            name: 'deletedAt',
            type: this.resolveDateType(dbType),
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

  // === Helpers para adaptar tipos conforme o banco ===

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
