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

  /** CREATE */
  async save(dto: DeepPartial<Feed>): Promise<Feed> {
    const entity = this.feedRepository.create(dto);
    return this.feedRepository.save(entity);
  }

  /** READ (por ID) */
  async findById(id: string): Promise<Feed | null> {
    return this.feedRepository.findOne({ where: { id } });
  }

  /** READ (todos do usuário) */
  async findAllByUser(userId: string): Promise<Feed[]> {
    return this.feedRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' as const },
    });
  }

  /** READ (todos do usuário paginados) */
  async findAllByUserPaged(
    userId: string,
    page = 1,
    limit = 20,
  ): Promise<{ data: any; total: number; page: number; limit: number }> {
    // Busca os feeds com user e contagem de likes
    const queryBuilder = this.feedRepository
      .createQueryBuilder('feed')
      .leftJoinAndSelect('feed.user', 'user')
      .leftJoin('feed.likes', 'likes')
      .leftJoin('feed.likes', 'userLike', 'userLike.userId = :userId', { userId })
      .select([
        'feed.id',
        'feed.title',
        'feed.content',
        'feed.createdAt',
        'feed.userId',
        'user.id',
        'user.name',
      ])
      .addSelect('COUNT(DISTINCT likes.id)', 'likesCount')
      .addSelect('MAX(CASE WHEN userLike.id IS NOT NULL THEN 1 ELSE 0 END)', 'hasLiked')
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
      return {
        id: f.id,
        title: f.title,
        content: f.content,
        createdAt: f.createdAt,
        userId: f.userId,
        userName: f.user?.name,
        edit: f.userId === userId,
        likesCount: parseInt(raw.likesCount) || 0,
        hasLiked: parseInt(raw.hasLiked) === 1,
      };
    });

    return { data, total, page, limit };
  }

  /** UPDATE (parcial: título/conteúdo) */
  async updateById(
    id: string,
    patch: Partial<Pick<Feed, 'title' | 'content'>>,
  ): Promise<boolean> {
    const res: UpdateResult = await this.feedRepository.update({ id }, patch);
    return (res.affected ?? 0) > 0;
  }

  /** DELETE (retorna se excluiu) */
  async deleteById(id: string): Promise<boolean> {
    // const res: DeleteResult = await this.feedRepository.delete(id);
    const patch = { deletedAt: new Date() };
    const res: UpdateResult = await this.feedRepository.update({ id }, patch);
    return (res.affected ?? 0) > 0;
  }
}
