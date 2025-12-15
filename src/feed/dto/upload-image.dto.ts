import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UploadImageDto {
  @ApiProperty({
    description: 'Imagem em Base64',
    example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...',
  })
  @IsNotEmpty()
  @IsString()
  imageBase64: string;
}

export class UploadImageResponseDto {
  @ApiProperty({
    description: 'URL da imagem salva',
    example: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUA...',
  })
  imageUrl: string;
}
