import { User } from 'src/config/entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { DeepPartial, FindOptionsWhere } from 'typeorm';

export abstract class IUsersRepository {
  abstract findOne(partial: Partial<User>);
  abstract save(user: DeepPartial<User>): Promise<User>;
  abstract create(data: DeepPartial<User>): User;
  abstract findActiveById(id: string);
  abstract findByEmail(email: string);
  abstract findActiveByIdWithPassword(id: string): Promise<User | null>;
  abstract updatePassword(id: string, passwordHash: string): Promise<void>;
}
