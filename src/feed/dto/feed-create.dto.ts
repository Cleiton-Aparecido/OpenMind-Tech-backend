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
    description: 'URL da imagem principal',
    example: 'https://example.com/image.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsUrl()
  imageUrl?: string;

  @ApiProperty({
    description: 'Array de URLs de imagens',
    example: ['https://example.com/img1.jpg', 'https://example.com/img2.jpg'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  images?: string[];
}
