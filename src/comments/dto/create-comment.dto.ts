import { IsString, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  comm_text: string;
  @IsUUID()
  comm_blog: string;
}
