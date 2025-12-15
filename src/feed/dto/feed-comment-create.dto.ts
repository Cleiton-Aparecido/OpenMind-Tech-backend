import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class FeedCommentCreateDto {
  @ApiProperty({ example: 'Muito bom seu post!' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  content: string;
}
