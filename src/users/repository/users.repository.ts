import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, FindOptionsWhere, IsNull, Repository } from 'typeorm';
import { User } from '../../config/entities/user.entity';
import { IUsersRepository } from '../interfaces/users.repository.interface';

@Injectable()
export class UsersRepository implements IUsersRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private buildWhere(partial: Partial<User>): FindOptionsWhere<User> {
    const { feeds, deletedAt, ...rest } = partial as any;
    const where: any = {};
    Object.entries(rest).forEach(([key, value]) => {
      if (value === undefined || value === null || typeof value === 'object')
        return;
      where[key] = value;
    });

    if (deletedAt === null) {
      where.deletedAt = IsNull();
    } else if (deletedAt instanceof Date) {
      where.deletedAt = deletedAt;
    }

    return where as FindOptionsWhere<User>;
  }

  async findOne(partial: Partial<User>): Promise<User | null> {
    const where = this.buildWhere(partial);
    return this.userRepository.findOne({ where });
  }

  async save(user: DeepPartial<User>): Promise<User> {
    return this.userRepository.save(user);
  }

  create(data: DeepPartial<User>): User {
    return this.userRepository.create(data);
  }

  async findActiveById(id: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { id, deletedAt: IsNull() },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email, deletedAt: IsNull() },
    });
  }

  // 🔽 inclui o password mesmo que esteja com select: false no entity
  async findActiveByIdWithPassword(id: string): Promise<User | null> {
    return this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password') // funciona se @Column({ select: false })
      .where('user.id = :id', { id })
      .andWhere('user.deletedAt IS NULL')
      .getOne();
  }

  // 🔽 atualiza somente o hash da senha
  async updatePassword(id: string, passwordHash: string): Promise<void> {
    const res = await this.userRepository.update(
      { id, deletedAt: IsNull() },
      { password: passwordHash },
    );
    if (!res.affected) {
      // opcional: lançar erro se não achou usuário ativo
      throw new Error('Usuário não encontrado ou inativo');
    }
  }
}
