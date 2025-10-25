import { DeepPartial } from 'typeorm';
import { FeedCreateDto } from '../dto/feed-create.dto';
import { Feed } from '../../config/entities/feed.entity';

export abstract class IFeedRepository {
  abstract save(dto: DeepPartial<Feed>): Promise<Feed>;
  abstract findById(id: string): Promise<Feed | null>;
  abstract findAllByUser(userId: string): Promise<Feed[]>;
  abstract findAllByUserPaged?(
    userId: string,
    page?: number,
    limit?: number,
  ): Promise<{ data: Feed[]; total: number; page: number; limit: number }>;
  abstract updateById?(
    id: string,
    patch: Partial<Pick<Feed, 'title' | 'content'>>,
  ): Promise<boolean>;
  abstract deleteById(id: string): Promise<boolean>;
}
