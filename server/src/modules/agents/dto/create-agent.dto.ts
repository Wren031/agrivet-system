import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { AgentStatus } from '@prisma/client';

export class CreateAgentDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  fullName: string;

  @IsString()
  contactNumber: string;

  @IsOptional()
  @IsString()
  idVerificationUrl?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsEnum(AgentStatus)
  status?: AgentStatus;
}
