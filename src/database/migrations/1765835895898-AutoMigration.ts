import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1765835895898 implements MigrationInterface {
    name = 'AutoMigration1765835895898'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."UQ_feedLike_feedId_userId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_feed_userId"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "birthdate" date`);
        await queryRunner.query(`ALTER TABLE "users" ADD "profession" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "users" ADD "specialty" character varying(100)`);
        await queryRunner.query(`ALTER TABLE "feed_likes" DROP CONSTRAINT "PK_cc8da4d504330fc9a28b227976c"`);
        await queryRunner.query(`ALTER TABLE "feed_likes" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "feed_likes" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`);
        await queryRunner.query(`ALTER TABLE "feed_likes" ADD CONSTRAINT "PK_cc8da4d504330fc9a28b227976c" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "feed_likes" ALTER COLUMN "createdAt" SET DEFAULT now()`);
        await queryRunner.query(`COMMENT ON COLUMN "feed"."imageUrl" IS NULL`);
        await queryRunner.query(`COMMENT ON COLUMN "feed"."images" IS NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3"`);
        await queryRunner.query(`COMMENT ON COLUMN "users"."role" IS NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_users_email" ON "users" ("email") `);
        await queryRunner.query(`ALTER TABLE "feed_likes" ADD CONSTRAINT "UQ_b9c8be3aed9ca0ad4ca32d476a4" UNIQUE ("feedId", "userId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "feed_likes" DROP CONSTRAINT "UQ_b9c8be3aed9ca0ad4ca32d476a4"`);
        await queryRunner.query(`DROP INDEX "public"."UQ_users_email"`);
        await queryRunner.query(`COMMENT ON COLUMN "users"."role" IS 'Cargo do usuário na área de TI'`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email")`);
        await queryRunner.query(`COMMENT ON COLUMN "feed"."images" IS 'Array de URLs de imagens'`);
        await queryRunner.query(`COMMENT ON COLUMN "feed"."imageUrl" IS 'URL ou caminho da imagem principal do post'`);
        await queryRunner.query(`ALTER TABLE "feed_likes" ALTER COLUMN "createdAt" SET DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "feed_likes" DROP CONSTRAINT "PK_cc8da4d504330fc9a28b227976c"`);
        await queryRunner.query(`ALTER TABLE "feed_likes" DROP COLUMN "id"`);
        await queryRunner.query(`ALTER TABLE "feed_likes" ADD "id" character varying(36) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "feed_likes" ADD CONSTRAINT "PK_cc8da4d504330fc9a28b227976c" PRIMARY KEY ("id")`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "specialty"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "profession"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "birthdate"`);
        await queryRunner.query(`CREATE INDEX "IDX_feed_userId" ON "feed" ("userId") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "UQ_feedLike_feedId_userId" ON "feed_likes" ("feedId", "userId") `);
    }

}
