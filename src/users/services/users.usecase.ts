import { ChangePasswordDto } from '../dto/change-password.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

export abstract class UsersUseCase {
  abstract create(
    createUserDto: CreateUserDto,
  ): Promise<{ statusCode: number; message: string }>;

  abstract get(id: string): Promise<any>;

  abstract changePassword(
    userId: string,
    dto: ChangePasswordDto,
  ): Promise<void>;

  abstract update(
    id: string,
    dto: UpdateUserDto,
  ): Promise<any>;
}
