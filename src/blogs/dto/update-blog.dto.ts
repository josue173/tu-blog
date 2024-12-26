import { PartialType } from '@nestjs/mapped-types';
import { CreateBlogDto } from './create-blog.dto';
import { IsArray, IsString, IsUUID, MaxLength } from 'class-validator';

export class UpdateBlogDto extends PartialType(CreateBlogDto) {
  @IsString()
  @MaxLength(25)
  blog_name: string;
  @IsString()
  blog_text: string;
  @IsArray()
  @IsUUID('4', { each: true })
  categories: string[];
}
