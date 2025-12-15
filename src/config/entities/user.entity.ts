import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
} from 'typeorm';
import { Feed } from './feed.entity';
import { FeedLike } from './feed-like.entity';

@Entity({ name: 'users' })
@Index('UQ_users_email', ['email'], { unique: true })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 255 })
  name: string;

  @Column('varchar', { length: 255 })
  email: string;

  @Column('varchar', { length: 255 })
  password: string;

  @Column('varchar', { length: 100, nullable: true })
  role?: string;

  @Column({ type: 'date', nullable: true })
  birthdate?: Date;

  @Column('varchar', { length: 100, nullable: true })
  profession?: string;

  @Column('varchar', { length: 100, nullable: true })
  specialty?: string;

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

  @OneToMany(() => Feed, (feed) => feed.user)
  feeds: Feed[];

  @OneToMany(() => FeedLike, (like) => like.user)
  feedLikes: FeedLike[];
}
