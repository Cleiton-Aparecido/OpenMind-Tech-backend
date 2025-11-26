import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersController } from './controllers/users.controller';
import { UsersService } from './services/users.service';
import { UsersRepository } from './repository/users.repository';
import { User } from 'src/config/entities/user.entity';
import { IUsersRepository } from './interfaces/users.repository.interface';
import { UsersUseCase } from './services/users.usecase';
import { UseCaseProvider } from './providers/user.provider';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UsersController],
  providers: [
    UseCaseProvider,
    {
      provide: IUsersRepository,
      useClass: UsersRepository,
    },
  ],
  exports: [IUsersRepository, UseCaseProvider],
})
export class UsersModule {}
