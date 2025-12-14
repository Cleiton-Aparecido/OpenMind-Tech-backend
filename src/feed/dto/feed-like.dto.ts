import { ApiProperty } from '@nestjs/swagger';

export class FeedLikeUserDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  userId: string;

  @ApiProperty({ example: 'João Silva' })
  userName: string;

  @ApiProperty({ example: '2024-12-14T10:30:00.000Z' })
  likedAt: Date;
}

export class FeedLikesResponseDto {
  @ApiProperty({ type: [FeedLikeUserDto] })
  likes: FeedLikeUserDto[];

  @ApiProperty({ example: 10 })
  total: number;
}
