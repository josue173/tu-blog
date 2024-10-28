import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
