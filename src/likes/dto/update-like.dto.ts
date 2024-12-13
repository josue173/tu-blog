import { PartialType } from '@nestjs/mapped-types';
import { CreateLikeDto } from './create-like.dto';
import { IsBoolean } from 'class-validator';

export class UpdateLikeDto extends PartialType(CreateLikeDto) {
    @IsBoolean()
    like: boolean;
}
