import {
  Entity,
  Column,
  PrimaryColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'feed' })
export class Feed {
  @PrimaryColumn('char', { length: 36, default: () => 'UUID()' })
  id: string;

  @Column('varchar', { length: 255 })
  title: string;

  @Column('text')
  content: string;

  @Index('IDX_feed_userId')
  @Column('char', { length: 36, name: 'userId' })
  userId: string;

  @ManyToOne(() => User, (user) => User.feeds, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'userId',
    referencedColumnName: 'id',
    foreignKeyConstraintName: 'FK_feed_userId__users_id',
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
}
