import {
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Feed } from './feed.entity';

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
}
