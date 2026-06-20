import { IsOptional, IsUUID, IsEnum } from 'class-validator';
import { OrderStatus } from '@prisma/client';

export class AssignOrderDto {
  @IsOptional()
  @IsUUID()
  adminProfileId?: string;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;
}
