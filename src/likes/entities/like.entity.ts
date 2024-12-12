import { IsBoolean } from 'class-validator';
import { Blog } from 'src/blogs/entities/blog.entity';
import { User } from 'src/users/entities/user.entity';
import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Like {
  @PrimaryGeneratedColumn()
  like_id: string;
  @IsBoolean()
  like: boolean;
  @ManyToOne(() => User, (user) => user.like)
  like_owner: User;
  @ManyToOne(() => Blog, (blog) => blog.like)
  like_blog: Blog;
}
