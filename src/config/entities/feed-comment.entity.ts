import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Feed } from './feed.entity';
import { User } from './user.entity';

@Entity({ name: 'feed_comments' })
export class FeedComment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('IDX_feedComment_feedId')
  @Column({ name: 'feedId', type: 'uuid' })
  feedId: string;

  @Index('IDX_feedComment_userId')
  @Column({ name: 'userId', type: 'uuid' })
  userId: string;

  @Column('text')
  content: string;

  @ManyToOne(() => Feed, (feed) => feed.comments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'feedId',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_feedComment_feedId__feed_id',
  })
  feed: Feed;

  @ManyToOne(() => User, (user) => user.feedComments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'userId',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_feedComment_userId__users_id',
  })
  user: User;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'createdAt',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updatedAt',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @DeleteDateColumn({ type: 'timestamp', name: 'deletedAt', nullable: true })
  deletedAt: Date | null;
}
