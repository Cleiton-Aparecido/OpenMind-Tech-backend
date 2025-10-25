import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { FeedCreateDto } from '../dto/feed-create.dto';
import { IFeedRepository } from '../interfaces/feed.repository.interface';
import { FeedUseCase } from './feed.usecase';
import { FeedResponseDto } from '../dto/feed-response.dto';
import { FeedUpdateDto } from '../dto/feed-update.dto';
import { Feed } from 'src/config/entities/feed.entity';

@Injectable()
export class FeedService implements FeedUseCase {
  constructor(private readonly feedRepository: IFeedRepository) {}

  /** CREATE */
  async createPost(
    dto: FeedCreateDto,
    userId: string,
  ): Promise<FeedResponseDto> {
    try {
      const feedData = await this.feedRepository.save({
        content: dto.content,
        title: dto.title,
        userId,
      });

      return { message: 'Post created successfully', feedId: feedData.id };
    } catch (error) {
      console.error(error);
      return { message: 'Erro ao realizar a postagem', feedId: '0' };
    }
  }

  /** READ - listar todos do usuário (paginado ou simples) */
  async listMyFeed(
    userId: string,
    page = 1,
    limit = 20,
  ): Promise<{ data: Feed[]; total: number; page: number; limit: number }> {
    if ('findAllByUserPaged' in this.feedRepository) {
      return this.feedRepository.findAllByUserPaged!(userId, page, limit);
    }

    const data = await this.feedRepository.findAllByUser(userId);
    return { data, total: data.length, page, limit };
  }

  /** READ - buscar um feed específico */
  async getMyPost(id: string, userId: string): Promise<Feed> {
    const feed = await this.feedRepository.findById(id);
    if (!feed) throw new NotFoundException('Feed not found');
    if (feed.userId !== userId)
      throw new ForbiddenException('You are not allowed to view this feed');
    return feed;
  }

  /** UPDATE */
  async updateMyPost(
    id: string,
    dto: FeedUpdateDto,
    userId: string,
  ): Promise<FeedResponseDto> {
    const feed = await this.feedRepository.findById(id);
    if (!feed) throw new NotFoundException('Feed not found');
    if (feed.userId !== userId)
      throw new ForbiddenException('You are not allowed to edit this feed');

    if ('updateById' in this.feedRepository) {
      await this.feedRepository.updateById!(id, dto);
    } else {
      Object.assign(feed, dto);
      await this.feedRepository.save(feed as any);
    }

    return { message: 'Post updated successfully', feedId: id };
  }

  /** DELETE */
  async deleteMyPost(id: string, userId: string): Promise<FeedResponseDto> {
    const feed = await this.feedRepository.findById(id);
    if (!feed) throw new NotFoundException('Feed not found');
    if (feed.userId !== userId)
      throw new ForbiddenException('You are not allowed to delete this feed');

    const deleted = await this.feedRepository.deleteById(id);
    if (!deleted) throw new NotFoundException('Feed not found');

    return { message: 'Post deleted successfully', feedId: id };
  }
}
