import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsWhere, IsNull, Repository } from 'typeorm';

import { User } from '../../config/entities/user.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private buildWhere(partial: Partial<User>): FindOptionsWhere<User> {
    const { feeds, deletedAt, ...rest } = partial as any;

    const where: any = {};
    Object.entries(rest).forEach(([key, value]) => {
      if (value === undefined || value === null || typeof value === 'object') {
        return;
      }
      where[key] = value;
    });

    if (deletedAt === null) {
      where.deletedAt = IsNull();
    } else if (deletedAt instanceof Date) {
      where.deletedAt = deletedAt;
    }

    return where as FindOptionsWhere<User>;
  }

  async findOne(partial: Partial<User>) {
    const where = this.buildWhere(partial);
    return this.userRepository.findOne({ where });
  }

  async save(user: DeepPartial<User>): Promise<User> {
    return this.userRepository.save(user);
  }

  create(data: DeepPartial<User>): User {
    return this.userRepository.create(data);
  }

  // Helpers
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
