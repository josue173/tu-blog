import { Blog } from 'src/blogs/entities/blog.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({
  name: "qualifications"
})
@Check(`"qualification" BETWEEN 1 AND 5`)
export class Qualification {
  @PrimaryGeneratedColumn('uuid')
  qua_id: string;
  @Column({
    type: 'int',
  })
  qualification: number;
  @ManyToOne(() => User, (user) => user.qualification)
  @JoinColumn({ name: 'qua_owner' })
  qua_owner: User;
  @ManyToOne(() => Blog, (blog) => blog.qualification)
  @JoinColumn({ name: 'qua_blog' })
  qua_blog: Blog;
}
