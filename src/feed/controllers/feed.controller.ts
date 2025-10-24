import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FeedCreateDto } from '../dto/feed-create.dto';

@ApiTags('Feed')
@Controller('feed')
export class FeedController {
  @Post()
  async createPost(@Body() body: FeedCreateDto) {
    return 'Post created';
  }
  @Get()
  async getFeed() {
    return 'This is the feed';
  }
  @Put()
  async update() {
    return 'Post updated';
  }
}
