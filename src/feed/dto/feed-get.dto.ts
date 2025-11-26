import { Feed } from 'src/config/entities/feed.entity';

export class FeedGetDto extends Feed {
  edit?: boolean;
}
