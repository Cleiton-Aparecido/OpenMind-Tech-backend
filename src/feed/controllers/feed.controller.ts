import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  ParseUUIDPipe,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Request } from 'express';
import { FeedCreateDto } from '../dto/feed-create.dto';
import { FeedUpdateDto } from '../dto/feed-update.dto';
import { FeedUseCase } from '../services/feed.usecase';
import { FeedResponseDto } from '../dto/feed-response.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

type AuthRequest = Request & {
  user?: { id: string; email: string; name?: string };
};

@ApiTags('Feed')
@ApiBearerAuth() // indica no Swagger que precisa de Bearer Token
@Controller('feed')
export class FeedController {
  constructor(private readonly feedUseService: FeedUseCase) {}

  /** CREATE */
  @Post()
  @ApiResponse({
    status: 201,
    description: 'Post criado com sucesso',
    schema: {
      example: {
        message: 'Post criado com sucesso',
        feedId: '94619e73-843d-4313-9aa2-698b12a6af2c',
      },
    },
  })
  async createPost(
    @Body() dto: FeedCreateDto,
    @Req() req: AuthRequest,
  ): Promise<FeedResponseDto> {
    const userId = req.user?.id;
    if (!userId) {
      return { message: 'Usuário não autenticado', feedId: '0' };
    }
    return this.feedUseService.createPost(dto, userId);
  }

  @Get()
  @ApiOkResponse({
    description: 'Lista os posts do usuário autenticado (paginado)',
    schema: {
      example: {
        data: [
          {
            id: '94619e73-843d-4313-9aa2-698b12a6af2c',
            title: 'Estudo sobre NestJS',
            content: 'Conteúdo do post...',
            imageUrl: 'https://example.com/image.jpg',
            images: ['https://example.com/img1.jpg', 'https://example.com/img2.jpg'],
            userId: '0ecf3512-b45f-4443-85b9-80142ff278a6',
            userName: 'João Silva',
            createdAt: '2025-10-25T12:00:00.000Z',
          },
        ],
        total: 1,
        page: 1,
        limit: 20,
      },
    },
  })
  async getFeed(@Req() req: AuthRequest, @Query() query: PaginationQueryDto) {
    const userId = req.user?.id;
    if (!userId) {
      return { message: 'Usuário não autenticado', feedId: '0' };
    }
    const page = query.page ?? 1;
    const limit = query.limit ?? 20;
    return this.feedUseService.listMyFeed(userId, page, limit);
  }

  /** READ - busca um post específico */
  @Get(':id')
  @ApiOkResponse({
    description: 'Busca um post específico do usuário',
  })
  async getOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: AuthRequest,
  ) {
    const userId = req.user?.id;
    if (!userId) {
      return { message: 'Usuário não autenticado', feedId: '0' };
    }
    return this.feedUseService.getMyPost(id, userId);
  }

  /** UPDATE */
  @Put(':id')
  @ApiOkResponse({
    description: 'Post atualizado com sucesso',
    schema: {
      example: {
        message: 'Post atualizado com sucesso',
        feedId: '94619e73-843d-4313-9aa2-698b12a6af2c',
      },
    },
  })
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() dto: FeedUpdateDto,
    @Req() req: AuthRequest,
  ): Promise<FeedResponseDto> {
    const userId = req.user?.id;
    if (!userId) {
      return { message: 'Usuário não autenticado', feedId: '0' };
    }
    return this.feedUseService.updateMyPost(id, dto, userId);
  }

  /** DELETE */
  @Delete(':id')
  @ApiOkResponse({
    description: 'Post deletado com sucesso',
    schema: {
      example: {
        message: 'Post deletado com sucesso',
        feedId: '94619e73-843d-4313-9aa2-698b12a6af2c',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Post não encontrado',
    schema: {
      example: {
        message: 'Post não encontrado',
        error: 'Not Found',
        statusCode: 404,
      },
    },
  })
  async delete(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: AuthRequest,
  ): Promise<FeedResponseDto> {
    const userId = req.user?.id;
    if (!userId) {
      return { message: 'Usuário não autenticado', feedId: '0' };
    }
    return this.feedUseService.deleteMyPost(id, userId);
  }

  @Post(':id/like')
  @ApiOkResponse({
    description: 'Like adicionado com sucesso',
    schema: {
      example: {
        message: 'Like adicionado com sucesso',
        feedId: '94619e73-843d-4313-9aa2-698b12a6af2c',
      },
    },
  })
  async likePost(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: AuthRequest,
  ): Promise<FeedResponseDto> {
    const userId = req.user?.id;
    if (!userId) {
      return { message: 'Usuário não autenticado', feedId: '0' };
    }
    return this.feedUseService.toggleLike(id, userId);
  }

  @Delete(':id/like')
  @ApiOkResponse({
    description: 'Like removido com sucesso',
    schema: {
      example: {
        message: 'Like removido com sucesso',
        feedId: '94619e73-843d-4313-9aa2-698b12a6af2c',
      },
    },
  })
  async unlikePost(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Req() req: AuthRequest,
  ): Promise<FeedResponseDto> {
    const userId = req.user?.id;
    if (!userId) {
      return { message: 'Usuário não autenticado', feedId: '0' };
    }
    return this.feedUseService.toggleLike(id, userId);
  }
}
