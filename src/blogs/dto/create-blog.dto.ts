import {
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
} from 'class-validator';

export class CreateBlogDto {
  @IsString()
  @MaxLength(25)
  blog_name: string;
  @IsString()
  blog_text: string;
  @IsNumber()
  @IsOptional()
  blog_views: number;
  @IsNumber()
  @IsOptional()
  blog_likes: number;
  @IsString()
  @IsUUID()
  @IsOptional()
  blog_owner: string;
}
