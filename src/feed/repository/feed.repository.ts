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
    const [feeds, total] = await this.feedRepository
      .createQueryBuilder('feed')
      .innerJoinAndSelect('feed.user', 'user')
      .orderBy('feed.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();

    const data = feeds.map((f) => ({
      id: f.id,
      title: f.title,
      content: f.content,
      imageUrl: f.imageUrl,
      images: f.images,
      createdAt: f.createdAt,
      userId: f.userId,
      userName: f.user?.name,
      edit: userId == f.userId,
    }));

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
