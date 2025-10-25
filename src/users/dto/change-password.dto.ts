import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @ApiProperty({
    description: 'senha antiga',
    example: '123456',
  })
  oldPassword!: string;

  @ApiProperty({
    description: 'Nova senha',
    example: '654321',
  })
  @IsString()
  @MinLength(8, { message: 'A nova senha deve ter no mínimo 8 caracteres.' })
  newPassword!: string;
}
