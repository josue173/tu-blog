import { Blog } from 'src/blogs/entities/blog.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class Like {
  @PrimaryGeneratedColumn('uuid')
  like_id: string;
  @Column({
    type: 'boolean',
  })
  like: boolean;
  @ManyToOne(() => User, (user) => user.like)
  @JoinColumn({ name: 'like_owner' })
  like_owner: User;
  @ManyToOne(() => Blog, (blog) => blog.like)
  @JoinColumn({ name: 'like_blog' })
  like_blog: Blog;
}
