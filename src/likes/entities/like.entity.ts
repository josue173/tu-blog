import { IsBoolean } from 'class-validator';
import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Like {
  @PrimaryColumn()
  like_owner: string;
  @PrimaryColumn()
  like_blog: string;
  @IsBoolean()
  like: boolean;
}
