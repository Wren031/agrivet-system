import { IsString, IsUUID, IsOptional, MinLength, IsArray, ValidateNested, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';
import { OrderStatus } from '@prisma/client';
import { CreateOrderItemDto } from './create-order-item.dto';

export class CreateOrderDto {
  @IsOptional()
  @IsString()
  notes?: string;

  @IsUUID()
  customerId: string;

  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items?: CreateOrderItemDto[];
}
