import { IsNumber, IsUUID, Max, Min } from 'class-validator';

export class CreateQualificationDto {
  @IsNumber()
  @Min(0)
  @Max(5)
  qualification: number;
  @IsUUID()
  qua_blog: string;
}
