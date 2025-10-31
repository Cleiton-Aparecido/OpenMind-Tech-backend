import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddImageToFeed1730390000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Adiciona coluna para URL/caminho da imagem principal
    await queryRunner.addColumn(
      'feed',
      new TableColumn({
        name: 'imageUrl',
        type: 'varchar',
        length: '500',
        isNullable: true,
        comment: 'URL ou caminho da imagem principal do post',
      }),
    );

    // Adiciona coluna para múltiplas imagens (formato JSON)
    await queryRunner.addColumn(
      'feed',
      new TableColumn({
        name: 'images',
        type: 'json',
        isNullable: true,
        comment: 'Array de URLs de imagens',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('feed', 'imageUrl');
    await queryRunner.dropColumn('feed', 'images');
  }
}
