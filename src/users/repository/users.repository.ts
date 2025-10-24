import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../config/entities/user.entity';
import { Repository, FindOptionsWhere, IsNull, DeepPartial } from 'typeorm';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   * Converte Partial<User> em FindOptionsWhere<User>,
   * tratando deletedAt === null como IsNull()
   */
  private buildWhere(partial: Partial<User>): FindOptionsWhere<User> {
    const { deletedAt, ...rest } = partial;

    const where: FindOptionsWhere<User> = { ...rest };

    if (deletedAt === null) {
      // traduz "quero onde deletedAt é NULL"
      (where as any).deletedAt = IsNull();
    } else if (deletedAt instanceof Date) {
      (where as any).deletedAt = deletedAt;
    }
    // se for undefined, simplesmente não filtra por deletedAt

    return where;
  }

  async findOne(partial: Partial<User>) {
    const where = this.buildWhere(partial);
    return this.userRepository.findOne({ where });
  }

  async save(user: DeepPartial<User>): Promise<User> {
    return this.userRepository.save(user);
  }

  create(data: DeepPartial<User>): User {
    console.log(data);
    return this.userRepository.create(data);
  }

  // Helpers úteis (opcionais)
  async findActiveById(id: string) {
    return this.userRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });
  }

  async findByEmail(email: string) {
    return this.userRepository.findOne({
      where: { email, deletedAt: IsNull() },
    });
  }
}
