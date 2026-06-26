import { IsString, IsOptional, MinLength, IsUUID } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @MinLength(1)
  fullName: string;

  @IsString()
  @MinLength(1)
  phone: string;

  @IsOptional()
  @IsString()
  storeName?: string;

  @IsString()
  @MinLength(1)
  address: string;

  @IsOptional()
  @IsUUID()
  agentProfileId?: string;
}
