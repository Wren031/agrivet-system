import { IsString, IsEmail, IsOptional, MinLength, IsUUID } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @MinLength(1)
  fullName: string;

  @IsString()
  @MinLength(1)
  phone: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  @MinLength(1)
  address: string;

  @IsOptional()
  @IsUUID()
  agentProfileId?: string;
}
