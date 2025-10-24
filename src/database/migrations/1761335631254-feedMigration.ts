import { MigrationInterface, QueryRunner } from 'typeorm';

export class NewMigration1761335631254 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE feed (
        id CHAR(36) NOT NULL DEFAULT (UUID()),
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        userId CHAR(36) NOT NULL,
        createdAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT PK_feed PRIMARY KEY (id),
        INDEX IDX_feed_userId (userId),
        CONSTRAINT FK_feed_userId__users_id
          FOREIGN KEY (userId) REFERENCES users(id)
          ON DELETE CASCADE
          ON UPDATE CASCADE
      )`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE feed`);
  }
}
