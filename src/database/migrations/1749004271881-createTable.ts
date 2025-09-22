import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTable1749004271881 implements MigrationInterface {
  name = 'CreateTable1749004271881';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE users (
          id CHAR(36) NOT NULL DEFAULT (UUID()), -- MySQL gera UUID em string
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          password VARCHAR(255) NOT NULL,
          createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          deletedAt TIMESTAMP NULL,
          CONSTRAINT UQ_users_email UNIQUE (email),
          CONSTRAINT PK_users PRIMARY KEY (id)
          )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE users`);
  }
}
