import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterImageUrlToText1762070000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Altera o tipo da coluna imageUrl de varchar(500) para text
    await queryRunner.query(
      `ALTER TABLE "feed" ALTER COLUMN "imageUrl" TYPE text`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Reverte para varchar(500)
    await queryRunner.query(
      `ALTER TABLE "feed" ALTER COLUMN "imageUrl" TYPE varchar(500)`,
    );
  }
}
