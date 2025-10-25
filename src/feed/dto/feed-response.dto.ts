import { ApiProperty } from '@nestjs/swagger';

export class FeedResponseDto {
  @ApiProperty({ example: 'Feed criado com sucesso' })
  message: string;

  @ApiProperty({
    example: '8a7b9b5e-5c3a-4b7b-9d6d-2d0f1d9c8a77',
    description: 'ID do feed criado',
  })
  feedId: string;
}
