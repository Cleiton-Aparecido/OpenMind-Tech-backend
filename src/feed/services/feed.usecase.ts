import { FeedCreateDto } from '../dto/feed-create.dto';
import { FeedUpdateDto } from '../dto/feed-update.dto';
import { FeedResponseDto } from '../dto/feed-response.dto';
import { Feed } from 'src/config/entities/feed.entity';

export abstract class FeedUseCase {
  /**
   * Cria um novo post.
   * @param dto Dados do post (título, conteúdo)
   * @param userId ID do usuário autenticado
   */
  abstract createPost(
    dto: FeedCreateDto,
    userId: string,
  ): Promise<FeedResponseDto>;

  /**
   * Lista os posts do usuário autenticado (com paginação opcional).
   * @param userId ID do usuário autenticado
   * @param page Página atual
   * @param limit Quantidade de itens por página
   */
  abstract listMyFeed(
    userId: string,
    page?: number,
    limit?: number,
  ): Promise<{ data: Feed[]; total: number; page: number; limit: number }>;

  /**
   * Busca um post específico do usuário autenticado.
   * @param id ID do post
   * @param userId ID do usuário autenticado
   */
  abstract getMyPost(id: string, userId: string): Promise<Feed>;

  /**
   * Atualiza um post do usuário autenticado.
   * @param id ID do post
   * @param dto Dados a atualizar (título/conteúdo)
   * @param userId ID do usuário autenticado
   */
  abstract updateMyPost(
    id: string,
    dto: FeedUpdateDto,
    userId: string,
  ): Promise<FeedResponseDto>;

  /**
   * Exclui um post do usuário autenticado.
   * @param id ID do post
   * @param userId ID do usuário autenticado
   */
  abstract deleteMyPost(id: string, userId: string): Promise<FeedResponseDto>;
}
