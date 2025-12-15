import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FeedCreateDto } from '../dto/feed-create.dto';
import { IFeedRepository } from '../interfaces/feed.repository.interface';
import { FeedUseCase } from './feed.usecase';
import { FeedResponseDto } from '../dto/feed-response.dto';
import { FeedUpdateDto } from '../dto/feed-update.dto';
import { Feed } from 'src/config/entities/feed.entity';
import { FeedLike } from 'src/config/entities/feed-like.entity';
import { FeedGetDto } from '../dto/feed-get.dto';
import { FeedComment } from 'src/config/entities/feed-comment.entity';
import { FeedCommentCreateDto } from '../dto/feed-comment-create.dto';
import { FeedCommentUpdateDto } from '../dto/feed-comment-update.dto';
import { FeedCommentDto } from '../dto/feed-comment.dto';

@Injectable()
export class FeedService implements FeedUseCase {
  constructor(
    private readonly feedRepository: IFeedRepository,
    @InjectRepository(FeedLike)
    private readonly feedLikeRepository: Repository<FeedLike>,
    @InjectRepository(FeedComment)
    private readonly feedCommentRepository: Repository<FeedComment>,
  ) {}

  /** CREATE */
  async createPost(
    dto: FeedCreateDto,
    userId: string,
  ): Promise<FeedResponseDto> {
    try {
      const feedData = await this.feedRepository.save({
        content: dto.content,
        title: dto.title,
        userId: userId,
        imageUrl: dto.imageUrl,
        images: dto.images,
      });

      return { message: 'Post criado com sucesso', feedId: feedData.id };
    } catch (error) {
      console.error(error);
      return { message: 'Erro ao realizar a postagem', feedId: '0' };
    }
  }

  async listMyFeed(
    userId: string,
    page = 1,
    limit = 20,
  ): Promise<{
    data: FeedGetDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    if ('findAllByUserPaged' in this.feedRepository) {
      const feed = await this.feedRepository.findAllByUserPaged!(
        userId,
        page,
        limit,
      );
      return feed;
    }

    const data = await this.feedRepository.findAllByUser(userId);
    return { data, total: data.length, page, limit };
  }

  async getMyPost(id: string, userId: string): Promise<Feed> {
    const feed = await this.feedRepository.findById(id);
    if (!feed) throw new NotFoundException('Post não encontrado');
    if (feed.userId !== userId)
      throw new ForbiddenException(
        'Você não tem permissão para visualizar este post',
      );
    return feed;
  }

  async updateMyPost(
    id: string,
    dto: FeedUpdateDto,
    userId: string,
  ): Promise<FeedResponseDto> {
    const feed = await this.feedRepository.findById(id);
    if (!feed) throw new NotFoundException('Post não encontrado');
    if (feed.userId !== userId)
      throw new ForbiddenException(
        'Você não tem permissão para editar este post',
      );

    if ('updateById' in this.feedRepository) {
      await this.feedRepository.updateById!(id, dto);
    } else {
      Object.assign(feed, dto);
      await this.feedRepository.save(feed as any);
    }

    return { message: 'Post atualizado com sucesso', feedId: id };
  }

  async deleteMyPost(id: string, userId: string): Promise<FeedResponseDto> {
    const feed = await this.feedRepository.findById(id);
    if (!feed) throw new NotFoundException('Post não encontrado');
    if (feed.userId !== userId)
      throw new ForbiddenException(
        'Você não tem permissão para deletar este post',
      );

    const deleted = await this.feedRepository.deleteById(id);
    if (!deleted) throw new NotFoundException('Post não encontrado');

    return { message: 'Post deletado com sucesso', feedId: id };
  }

  async toggleLike(feedId: string, userId: string): Promise<FeedResponseDto> {
    console.log(feedId);

    const feed = await this.feedRepository.findById(feedId);

    console.log(feed);

    if (!feed) throw new NotFoundException('Post não encontrado');

    const existingLike = await this.feedLikeRepository.findOne({
      where: { feedId, userId },
    });

    if (existingLike) {
      console.log('existingLike');
      await this.feedLikeRepository.remove(existingLike);
      return { message: 'Like removido com sucesso', feedId };
    } else {
      console.log('newLike');
      const newLike = await this.feedLikeRepository.create({ feedId, userId });
      console.log(newLike);
      await this.feedLikeRepository.save(newLike);
      return { message: 'Like adicionado com sucesso', feedId };
    }
  }

  async uploadImage(imageBase64: string): Promise<{ imageUrl: string }> {
    // Valida se é uma string Base64 válida
    if (!imageBase64.startsWith('data:image/')) {
      throw new Error('Formato de imagem inválido');
    }

    // Retorna a própria string Base64 para ser salva
    return { imageUrl: imageBase64 };
  }
  async addComment(feedId: string, userId: string, dto: FeedCommentCreateDto) {
    const feed = await this.feedRepository.findById(feedId);
    if (!feed) throw new NotFoundException('Post não encontrado');

    const comment = this.feedCommentRepository.create({
      feedId,
      userId,
      content: dto.content,
    });

    const saved = await this.feedCommentRepository.save(comment);
    return {
      message: 'Comentário adicionado com sucesso',
      commentId: saved.id,
      feedId,
    };
  }

  async listComments(
    feedId: string,
    userId: string,
    page = 1,
    limit = 20,
  ): Promise<{
    data: FeedCommentDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const [rows, total] = await this.feedCommentRepository.findAndCount({
      where: { feedId, deletedAt: null as any },
      relations: { user: true } as any,
      order: { createdAt: 'ASC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    const data = rows.map((c: any) => ({
      id: c.id,
      feedId: c.feedId,
      userId: c.userId,
      userName: c.user?.name,
      content: c.content,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      edit: c.userId === userId,
    }));

    return { data, total, page, limit };
  }

  async updateComment(
    commentId: string,
    userId: string,
    dto: FeedCommentUpdateDto,
  ) {
    const comment = await this.feedCommentRepository.findOne({
      where: { id: commentId },
    });
    if (!comment || comment.deletedAt)
      throw new NotFoundException('Comentário não encontrado');
    if (comment.userId !== userId)
      throw new ForbiddenException(
        'Você não tem permissão para editar este comentário',
      );

    comment.content = dto.content;
    await this.feedCommentRepository.save(comment);

    return { message: 'Comentário atualizado com sucesso', commentId };
  }

  async deleteComment(commentId: string, userId: string) {
    const comment = await this.feedCommentRepository.findOne({
      where: { id: commentId },
    });
    if (!comment || comment.deletedAt)
      throw new NotFoundException('Comentário não encontrado');
    if (comment.userId !== userId)
      throw new ForbiddenException(
        'Você não tem permissão para deletar este comentário',
      );

    comment.deletedAt = new Date();
    await this.feedCommentRepository.save(comment);

    return { message: 'Comentário removido com sucesso', commentId };
  }
}
