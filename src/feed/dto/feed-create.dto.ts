import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsArray, IsUrl } from 'class-validator';

export class FeedCreateDto {
  @ApiProperty({
    description: 'Titulo do post',
    example: 'Estudos sobre NestJS',
  })
  @IsOptional()
  @IsString()
  title: string;

  @ApiProperty({
    description: 'Descrição do post',
    example: 'conteúdo do post sobre NestJS',
  })
  @IsOptional()
  @IsString()
  content: string;

  @ApiProperty({
    description: 'URL da imagem principal ou Base64',
    example: 'https://example.com/image.jpg ou data:image/png;base64,...',
    required: false,
  })
  @IsOptional()
  @IsString()
  imageUrl?: string;

  @ApiProperty({
    description: 'Array de URLs de imagens ou Base64',
    example: ['https://example.com/img1.jpg', 'data:image/png;base64,...'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
