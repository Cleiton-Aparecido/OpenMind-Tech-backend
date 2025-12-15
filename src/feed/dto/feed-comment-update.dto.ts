import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class FeedCommentUpdateDto {
  @ApiProperty({ example: 'Atualizando meu comentário...' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  content: string;
}
