import {
  IsEmail,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @Length(2, 100)
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  @Length(6, 100)
  password?: string;

  @IsOptional()
  @IsString()
  birthdate?: string; // ou Date, se sua entidade usar Date

  @IsOptional()
  @IsString()
  profession?: string;

  @IsOptional()
  @IsString()
  specialty?: string;
}
