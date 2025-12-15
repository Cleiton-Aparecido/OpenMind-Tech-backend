import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedController } from './controllers/feed.controller';
import { FeedUseCaseProvider } from './providers/feed.provider';
import { FeedRepository } from './repository/feed.repository';
import { IFeedRepository } from './interfaces/feed.repository.interface';
import { Feed } from 'src/config/entities/feed.entity';
import { FeedLike } from 'src/config/entities/feed-like.entity';
import { FeedComment } from 'src/config/entities/feed-comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Feed, FeedLike, FeedComment])],
  controllers: [FeedController],
  providers: [
    FeedUseCaseProvider,
    {
      provide: IFeedRepository,
      useClass: FeedRepository,
    },
  ],
  exports: [],
})
export class FeedModule {}
