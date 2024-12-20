import { Category } from 'src/categories/entities/category.entity';
import { Comment } from 'src/comments/entities/comment.entity';
import { Like } from 'src/likes/entities/like.entity';
import { Qualification } from 'src/qualifications/entities/qualification.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
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

  // @Column({
  //   type: 'int',
  //   default: 0,
  // })
  // blog_likes: number;

  @ManyToOne(() => User, (user) => user.blog)
  @JoinColumn({ name: 'blog_owner' })
  blog_owner: string;

  // PARA LIKE
  @OneToMany(() => Like, (like) => like.like_blog)
  like: Like[];

  // PARA CALIFICACION
  @OneToMany(() => Qualification, (qua) => qua.qua_blog)
  qualification: Qualification;

  // PARA COMMENTARIOS
  @OneToMany(() => Comment, (comment) => comment.comm_owner)
  comment: Comment[];

  @ManyToMany(() => Category, (category) => category.blogs, { cascade: true })
  @JoinTable({
    name: 'blog_categories',
    joinColumn: {
      name: 'blog',
      referencedColumnName: 'blog_id',
      foreignKeyConstraintName: 'blog_id',
    },
    inverseJoinColumn: {
      name: 'category',
      referencedColumnName: 'cat_id',
      foreignKeyConstraintName: 'cat_id',
    },
  })
  categories: Category[]; // Change this to Category[] instead of string[]
}
