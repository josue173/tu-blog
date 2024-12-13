import { IsArray, IsBoolean, IsUUID } from 'class-validator';

export class CreateLikeDto {
  @IsBoolean()
  like: boolean;
  @IsUUID()
  like_blog: string;
}
