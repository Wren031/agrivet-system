import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class CreateBranchAuthDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  fullName: string;

  @IsString()
  storeName: string;

  @IsString()
  contactNumber: string;

  @IsOptional()
  @IsString()
  idVerificationUrl?: string;

  @IsOptional()
  @IsString()
  address?: string;
}
