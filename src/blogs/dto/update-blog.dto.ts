import { PartialType } from '@nestjs/mapped-types';
import { CreateBlogDto } from './create-blog.dto';
import { IsString, MaxLength } from 'class-validator';

export class UpdateBlogDto extends PartialType(CreateBlogDto) {
  @IsString()
  @MaxLength(25)
  blog_name: string;
  @IsString()
  blog_text: string;
}
