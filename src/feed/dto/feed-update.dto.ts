import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

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
}
