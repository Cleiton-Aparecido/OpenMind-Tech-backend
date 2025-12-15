import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UsersUseCase } from './users.usecase';
import { IUsersRepository } from '../interfaces/users.repository.interface';

import { CreateUserDto } from '../dto/create-user.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UsersService implements UsersUseCase {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async create(
    createUserDto: CreateUserDto,
  ): Promise<{ statusCode: number; message: string }> {
    try {
      const { email, name, password, role } = createUserDto;

      const hashedPassword = await bcrypt.hash(password, 10);

      const userExists = await this.usersRepository.findOne({ email });
      if (userExists) {
        throw new ConflictException('E-mail já cadastrado');
      }

      const userCreated = this.usersRepository.create({
        email,
        name,
        password: hashedPassword,
        role,
      });
      await this.usersRepository.save(userCreated);

      return {
        statusCode: 201,
        message: 'Usuário criado com sucesso',
      };
    } catch (error) {
      Logger.error(error);
      throw error;
    }
  }

  async get(id: string): Promise<any> {
    try {
      const user = await this.usersRepository.findActiveById(id);
      if (user === null) {
        return { message: 'Usuário inexistente', statusCode: 404 };
      }
      const { password, deletedAt, ...safeUser } = user;
      return safeUser;
    } catch (error) {
      return { message: error.message, statusCode: 404 };
    }
  }

  async update(id: string, dto: UpdateUserDto): Promise<any> {
    const user = await this.usersRepository.findActiveById(id);
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    // Se vier nova senha, faz o hash; senão mantém a atual
    let newPassword = user.password;
    if (dto.password) {
      const saltRounds = 10;
      newPassword = await bcrypt.hash(dto.password, saltRounds);
    }

    const dataToUpdate = {
      name: dto.name ?? user.name,
      email: dto.email ?? user.email,
      password: newPassword,
      birthdate: dto.birthdate ?? user.birthdate,
      profession: dto.profession ?? user.profession,
      specialty: dto.specialty ?? user.specialty,
    };

    const updated = await this.usersRepository.update(id, dataToUpdate);

    const { password, deletedAt, ...safeUser } = updated;
    return safeUser;
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
    const user = await this.usersRepository.findActiveByIdWithPassword(userId);
    if (!user) throw new NotFoundException('Usuário não encontrado');

    const matches = await bcrypt.compare(dto.oldPassword, user.password);
    if (!matches) {
      throw new BadRequestException('Senha antiga incorreta');
    }

    if (dto.oldPassword === dto.newPassword) {
      throw new BadRequestException(
        'A nova senha deve ser diferente da antiga',
      );
    }

    const saltRounds = 10; // ou traga de uma config/env
    const hash = await bcrypt.hash(dto.newPassword, saltRounds);

    await this.usersRepository.updatePassword(user.id, hash);
  }
}
