import { ApiProperty } from '@nestjs/swagger';

export class FeedCommentDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  feedId: string;

  @ApiProperty()
  userId: string;

  @ApiProperty()
  userName?: string;

  @ApiProperty()
  content: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ description: 'Se o comentário pertence ao usuário logado' })
  edit: boolean;
}
