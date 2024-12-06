import { Blog } from 'src/blogs/entities/blog.entity';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  user_id: string;

  @Column({
    type: 'varchar',
    unique: true,
  })
  username: string;

  @Column({
    type: 'varchar',
  })
  user_first_name: string;

  @Column({
    type: 'varchar',
  })
  user_last_name: string;

  @Column({
    type: 'varchar',
    unique: true,
  })
  user_email: string;

  @Column({
    type: 'varchar',
    select: false,
  })
  user_password: string;

  @Column({
    type: 'date',
  })
  user_birthday: Date;

  @Column({
    type: 'simple-array',
  })
  user_roles: string[];

  @OneToMany(() => Blog, (blog) => blog.blog_owner, { cascade: true })
  blog: Blog; // virtual relationship, exists only in the entity for navigation purposes

  // @ManyToMany(() => Role)
  // @JoinTable({
  //   name: 'users_roles',
  //   joinColumn: {
  //     name: 'user',
  //     referencedColumnName: 'user_id',
  //     foreignKeyConstraintName: 'user_id',
  //   },
  //   inverseJoinColumn: {
  //     name: 'role',
  //     referencedColumnName: 'id',
  //     foreignKeyConstraintName: 'id',
  //   },
  // })
  // roles: Role;

  @BeforeInsert()
  @BeforeUpdate()
  formatNames() {
    this.user_first_name = this.capitalizeCase(this.user_first_name);
    this.user_last_name = this.capitalizeCase(this.user_last_name);
    this.user_email = this.user_email.toLowerCase().trim();
  }

  capitalizeCase(value: string): string {
    if (!value) return value;
    return value
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}
