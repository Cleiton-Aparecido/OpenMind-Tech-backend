import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
  Unique,
} from 'typeorm';
import { Feed } from './feed.entity';
import { User } from './user.entity';

@Entity({ name: 'feed_likes' })
@Unique(['feedId', 'userId'])
export class FeedLike {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('IDX_feedLike_feedId')
  @Column('char', { length: 36, name: 'feedId' })
  feedId: string;

  @Index('IDX_feedLike_userId')
  @Column('char', { length: 36, name: 'userId' })
  userId: string;

  @ManyToOne(() => Feed, (feed) => feed.likes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'feedId',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_feedLike_feedId__feed_id',
  })
  feed: Feed;

  @ManyToOne(() => User, (user) => user.feedLikes, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'userId',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_feedLike_userId__users_id',
  })
  user: User;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'createdAt',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;
}
