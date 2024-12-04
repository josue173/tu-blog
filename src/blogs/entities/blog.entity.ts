import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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
  })
  blog_text: string;

  @Column({
    type: 'int',
  })
  blog_views: number;

  @Column({
    type: 'int',
  })
  blog_likes: number;

  @ManyToOne(() => User, (user) => user.blog)
  @Column({
    type: 'uuid',
  })
  blog_owner: string;
}
