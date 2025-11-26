import { IsEmail, IsNotEmpty, MaxLength, MinLength, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '../enums/user-role.enum';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Email do usuário',
    example: 'usuario@email.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'João Silva',
    maxLength: 50,
  })
  @IsNotEmpty()
  @MaxLength(50)
  name: string;

  @ApiProperty({
    description: 'Senha do usuário (mínimo 6 caracteres)',
    example: '123456',
    minLength: 6,
  })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({
    description: 'Cargo do usuário na área de TI',
    enum: UserRole,
    example: UserRole.DESENVOLVEDOR_JUNIOR,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: 'Cargo inválido' })
  role?: UserRole;
}
