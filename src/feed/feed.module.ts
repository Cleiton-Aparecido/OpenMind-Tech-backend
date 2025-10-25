import { Module } from '@nestjs/common';
import { FeedController } from './controllers/feed.controller';
import { FeedUseCaseProvider } from './providers/feed.provider';
import { FeedRepository } from './repository/feed.repository';
import { IFeedRepository } from './interfaces/feed.repository.interface';
import { Feed } from 'src/config/entities/feed.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Feed])],
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
