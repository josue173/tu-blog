import { Blog } from 'src/blogs/entities/blog.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: 'comments',
})
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  comm_id: string;
  @Column({
    type: 'varchar',
  })
  comm_text: string;
  @ManyToOne(() => User, (user) => user.comment)
  @JoinColumn({ name: 'comm_owner' })
  comm_owner: User;
  @ManyToOne(() => Blog, (blog) => blog.comment)
  @JoinColumn({ name: 'comm_blog' })
  comm_blog: Blog;
}
