import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength, IsArray, IsUrl } from 'class-validator';

export class FeedUpdateDto {
  @ApiPropertyOptional({
    description: 'Título do post (máx. 255 caracteres)',
    example: 'Novo título do post',
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({
    description: 'Conteúdo do post (aceita múltiplas linhas)',
    example: 'Texto atualizado do post',
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({
    description: 'URL da imagem principal',
    example: 'https://example.com/image.jpg',
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  imageUrl?: string;

  @ApiPropertyOptional({
    description: 'Array de URLs de imagens',
    example: ['https://example.com/img1.jpg', 'https://example.com/img2.jpg'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  images?: string[];
}
