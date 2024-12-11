import { Blog } from 'src/blogs/entities/blog.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Category {
  @PrimaryGeneratedColumn('uuid')
  cat_id: string;

  @Column({
    type: 'varchar',
    unique: true,
  })
  name: string;

  @Column({
    type: 'varchar',
  })
  description: string;

  @ManyToMany(() => Blog, (blog) => blog.categories)
  blogs: Blog[]; // Change this to Blog[] instead of string[]
}
