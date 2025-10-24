import { FeedUseCase } from './feed.usecase';

export class FeedService implements FeedUseCase {
  async createPost(): Promise<string> {
    return 'Post created';
  }
}
