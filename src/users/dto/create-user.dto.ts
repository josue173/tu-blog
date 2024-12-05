import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEmail,
  IsString,
  IsUUID,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(7, { message: 'Username too short' })
  username: string;

  @IsString()
  user_first_name: string;

  @IsString()
  user_last_name: string;

  @IsString()
  @IsEmail()
  user_email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'The password must have a Uppercase, lowercase letter and a number',
  })
  user_password: string;

  @IsDate()
  @Type(() => Date)
  user_birthday: Date;

  @IsArray()
  @IsUUID('4', { each: true }) // Validate that each element is a UUID
  user_role: string[];
}
