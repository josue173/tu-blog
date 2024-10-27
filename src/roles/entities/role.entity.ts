import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({
    type: 'varchar',
    unique: true,
  })
  name: string;
  @BeforeInsert()
  checkNameInsert() {
    if (this.name) {
      this.name = this.name.toLowerCase();
    }
  }
}
