import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

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
}
