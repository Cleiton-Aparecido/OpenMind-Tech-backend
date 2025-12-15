import { FeedCreateDto } from '../dto/feed-create.dto';
import { FeedUpdateDto } from '../dto/feed-update.dto';
import { FeedResponseDto } from '../dto/feed-response.dto';
import { Feed } from 'src/config/entities/feed.entity';
import { FeedGetDto } from '../dto/feed-get.dto';
import { UploadImageResponseDto } from '../dto/upload-image.dto';
import { FeedCommentUpdateDto } from '../dto/feed-comment-update.dto';
import { FeedCommentDto } from '../dto/feed-comment.dto';
import { FeedCommentCreateDto } from '../dto/feed-comment-create.dto';

export abstract class FeedUseCase {
  /**
   * Cria um novo post.
   * @param dto
   * @param userId
   */
  abstract createPost(
    dto: FeedCreateDto,
    userId: string,
  ): Promise<FeedResponseDto>;

  /**
   * Lista os posts do usuário autenticado (com paginação opcional).
   * @param userId
   * @param page
   * @param limit
   */
  abstract listMyFeed(
    userId: string,
    page?: number,
    limit?: number,
  ): Promise<{
    data: FeedGetDto[];
    total: number;
    page: number;
    limit: number;
  }>;

  /**
   * Busca um post específico do usuário autenticado.
   * @param id
   * @param userId
   */
  abstract getMyPost(id: string, userId: string): Promise<Feed>;

  /**
   * Atualiza um post do usuário autenticado.
   * @param id
   * @param dto
   * @param userId
   */
  abstract updateMyPost(
    id: string,
    dto: FeedUpdateDto,
    userId: string,
  ): Promise<FeedResponseDto>;

  /**
   * Exclui um post do usuário autenticado.
   * @param id
   * @param userId
   */
  abstract deleteMyPost(id: string, userId: string): Promise<FeedResponseDto>;

  /**
   * Alterna o like em um post (adiciona se não existe, remove se existe).
   * @param feedId
   * @param userId
   */
  abstract toggleLike(feedId: string, userId: string): Promise<FeedResponseDto>;

  /**
   * Processa e retorna a imagem em Base64 para ser salva no banco.
   * @param imageBase64
   */
  abstract uploadImage(imageBase64: string): Promise<UploadImageResponseDto>;
  abstract addComment(
    feedId: string,
    userId: string,
    dto: FeedCommentCreateDto,
  ): Promise<{ message: string; commentId: string; feedId: string }>;

  abstract listComments(
    feedId: string,
    userId: string,
    page?: number,
    limit?: number,
  ): Promise<{
    data: FeedCommentDto[];
    total: number;
    page: number;
    limit: number;
  }>;

  abstract updateComment(
    commentId: string,
    userId: string,
    dto: FeedCommentUpdateDto,
  ): Promise<{ message: string; commentId: string }>;

  abstract deleteComment(
    commentId: string,
    userId: string,
  ): Promise<{ message: string; commentId: string }>;
}
