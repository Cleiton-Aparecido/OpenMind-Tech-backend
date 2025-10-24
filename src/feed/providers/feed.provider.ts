import { Provider } from '@nestjs/common';
import { FeedService } from '../services/feed.service';
import { FeedUseCase } from '../services/feed.usecase';

export const FeedUseCaseProvider: Provider = {
  provide: FeedUseCase,
  useClass: FeedService,
};
