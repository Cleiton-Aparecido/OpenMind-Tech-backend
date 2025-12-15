import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeepPartial, UpdateResult, DeleteResult } from 'typeorm';
import { Feed } from 'src/config/entities/feed.entity';
import { IFeedRepository } from '../interfaces/feed.repository.interface';

@Injectable()
export class FeedRepository implements IFeedRepository {
  constructor(
    @InjectRepository(Feed)
    private readonly feedRepository: Repository<Feed>,
  ) {}

  async save(dto: DeepPartial<Feed>): Promise<Feed> {
    const entity = this.feedRepository.create(dto);
    return this.feedRepository.save(entity);
  }

  async findById(id: string): Promise<Feed | null> {
    return this.feedRepository.findOne({ where: { id } });
  }

  async findAllByUser(userId: string): Promise<Feed[]> {
    return this.feedRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' as const },
    });
  }

  async findAllByUserPaged(
    userId: string,
    page = 1,
    limit = 20,
  ): Promise<{ data: any; total: number; page: number; limit: number }> {
    // Busca os feeds com user, contagem de likes e contagem de comentários
    const queryBuilder = this.feedRepository
      .createQueryBuilder('feed')
      .leftJoinAndSelect('feed.user', 'user')
      .leftJoin('feed.likes', 'likes')
      .leftJoin('feed.comments', 'comments') // ✅ NOVO: join comments (precisa da relação no Feed)
      .leftJoin(
        'feed_likes',
        'userLike',
        'userLike.feedId = feed.id AND userLike.userId = :userId',
        { userId },
      )
      .select([
        'feed.id',
        'feed.title',
        'feed.content',
        'feed.imageUrl',
        'feed.images',
        'feed.createdAt',
        'feed.userId',
        'user.id',
        'user.name',
      ])
      .addSelect('COALESCE(COUNT(DISTINCT likes.id), 0)', 'likesCount')
      .addSelect('COALESCE(COUNT(DISTINCT comments.id), 0)', 'commentsCount') // ✅ NOVO
      .addSelect(
        'COALESCE(MAX(CASE WHEN userLike.id IS NOT NULL THEN 1 ELSE 0 END), 0)',
        'hasLiked',
      )
      .groupBy('feed.id')
      .addGroupBy('user.id')
      .orderBy('feed.createdAt', 'DESC')
      .offset((page - 1) * limit)
      .limit(limit);

    const result = await queryBuilder.getRawAndEntities();

    const total = await this.feedRepository
      .createQueryBuilder('feed')
      .getCount();

    const data = result.entities.map((f, index) => {
      const raw = result.raw[index];
      const likesCount = parseInt(raw.likesCount) || 0;
      const commentsCount = parseInt(raw.commentsCount) || 0; // ✅ NOVO

      return {
        id: f.id,
        title: f.title,
        content: f.content,
        imageUrl: f.imageUrl,
        images: f.images,
        createdAt: f.createdAt,
        userId: f.userId,
        userName: f.user?.name,
        edit: f.userId === userId,
        ...(likesCount > 0 && { likesCount }),
        ...(commentsCount > 0 && { commentsCount }), // ✅ NOVO (só aparece quando > 0)
        hasLiked: parseInt(raw.hasLiked) === 1,
      };
    });

    return { data, total, page, limit };
  }

  async updateById(
    id: string,
    patch: Partial<Pick<Feed, 'title' | 'content' | 'imageUrl' | 'images'>>,
  ): Promise<boolean> {
    const res: UpdateResult = await this.feedRepository.update({ id }, patch);
    return (res.affected ?? 0) > 0;
  }

  async deleteById(id: string): Promise<boolean> {
    // const res: DeleteResult = await this.feedRepository.delete(id);
    const patch = { deletedAt: new Date() };
    const res: UpdateResult = await this.feedRepository.update({ id }, patch);
    return (res.affected ?? 0) > 0;
  }
}
