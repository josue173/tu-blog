import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
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
  })
  user_password: string;

  @Column({
    type: 'date',
  })
  user_birthday: Date;

  @BeforeInsert()
  @BeforeUpdate()
  formatNames() {
    this.user_first_name = this.capitalizeCase(this.user_first_name);
    this.user_last_name = this.capitalizeCase(this.user_last_name);
  }

  capitalizeCase(value: string): string {
    if (!value) return value;
    return value
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }
}
