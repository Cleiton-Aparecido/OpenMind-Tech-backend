import { ChangePasswordDto } from '../dto/change-password.dto';
import { CreateUserDto } from '../dto/create-user.dto';

export abstract class UsersUseCase {
  abstract create(
    createUserDto: CreateUserDto,
  ): Promise<{ statusCode: number; message: string }>;
  abstract get(id: string): Promise<any>;
  abstract changePassword(
    userId: string,
    dto: ChangePasswordDto,
  ): Promise<void>;
}
