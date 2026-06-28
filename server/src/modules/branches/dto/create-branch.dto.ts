import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { BranchStatus } from '@prisma/client';

export class CreateBranchDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  fullName: string;

  @IsString()
  storeBranch: string;

  @IsString()
  contactNumber: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  verificationImage?: string;

  @IsOptional()
  @IsEnum(BranchStatus)
  status?: BranchStatus;
}
