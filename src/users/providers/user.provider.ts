import { Provider } from '@nestjs/common';
import { UsersUseCase } from '../services/users.usecase';
import { UsersService } from '../services/users.service';

export const UseCaseProvider: Provider = {
  provide: UsersUseCase,
  useClass: UsersService,
};
