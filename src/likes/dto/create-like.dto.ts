import { IsArray, IsBoolean, IsUUID } from 'class-validator';

export class CreateLikeDto {
  @IsBoolean()
  like: boolean;
  // @IsUUID()
  // @IsArray()
  // like_owner: string;
  @IsUUID()
  // @IsArray()
  like_blog: string;
}
