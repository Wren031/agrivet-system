import {
  IsEmail,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateAdminStaffDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  fullName: string;

  @IsString()
  contactNumber: string;
}
