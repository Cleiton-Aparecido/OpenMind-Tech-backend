import { Module } from '@nestjs/common';
import { FeedController } from './controllers/feed.controller';
import { FeedUseCaseProvider } from './providers/feed.provider';

@Module({
  imports: [],
  controllers: [FeedController],
  providers: [FeedUseCaseProvider],
  exports: [],
})
export class FeedModule {}
