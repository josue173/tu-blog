import { PartialType } from '@nestjs/mapped-types';
import { CreateQualificationDto } from './create-qualification.dto';
import { IsNumber, Max, Min } from 'class-validator';

export class UpdateQualificationDto extends PartialType(CreateQualificationDto) {
  @IsNumber()
  @Min(0)
  @Max(5)
  qualification: number;
}
