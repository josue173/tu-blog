import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Blog {
  @PrimaryGeneratedColumn('uuid')
  blog_id: string;

  @Column({
    type: 'varchar',
    length: 50,
  })
  blog_name: string;

  @Column({
    type: 'varchar',
    length: 500,
    unique: true,
  })
  blog_text: string;

  @Column({
    type: 'int',
    default: 0,
  })
  blog_views: number;

  @Column({
    type: 'int',
    default: 0,
  })
  blog_likes: number;

  @ManyToOne(() => User, (user) => user.blog)
  @JoinColumn({ name: 'blog_owner' })
  blog_owner: string;
}
