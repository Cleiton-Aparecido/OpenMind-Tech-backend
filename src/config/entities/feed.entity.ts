import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';

import { User } from './user.entity';

@Entity({ name: 'feed' })
export class Feed {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 255 })
  title: string;

  @Column('text')
  content: string;

  @Column('varchar', { length: 500, nullable: true, name: 'imageUrl' })
  imageUrl?: string;

  @Column('json', { nullable: true })
  images?: string[];

  // @Index('IDX_feed_userId')
  // @Column('char', { length: 36, name: 'userId' })
  // userId: string;

  // @ManyToOne(() => User, (user) => user.feeds, {
  //   onDelete: 'CASCADE',
  //   onUpdate: 'CASCADE',
  // })
  // @JoinColumn({
  //   name: 'userId',
  //   referencedColumnName: 'id',
  //   foreignKeyConstraintName: 'FK_feed_userId__users_id',
  // })
  // user: User;
  @ManyToOne(() => User, (user) => user.feeds, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'userId',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_feed_userId__users_id',
  })
  user: User;

  @RelationId((feed: Feed) => feed.user)
  userId: string; // 👈 aqui volta a existir pra TS, mas não é @Column

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
