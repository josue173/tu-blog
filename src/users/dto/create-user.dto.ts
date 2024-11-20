import { Type } from 'class-transformer';
import { IsDate, IsEmail, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  username: string;

  @IsString()
  user_first_name: string;

  @IsString()
  user_last_name: string;

  @IsEmail()
  user_email: string;

  @IsString()
  user_password: string;

  @IsDate()
  @Type(() => Date)
  user_birthday: Date;
}
