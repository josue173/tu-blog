import { Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEmail,
  IsString,
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

  @IsString({ each: true })
  @IsArray()
  user_roles: string[];
}
