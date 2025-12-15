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
    description: 'URL da imagem principal ou Base64',
    example: 'https://example.com/image.jpg ou data:image/png;base64,...',
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiPropertyOptional({
    description: 'Array de URLs de imagens ou Base64',
    example: ['https://example.com/img1.jpg', 'data:image/png;base64,...'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
