import { IsInt, IsNumber, IsUUID, Min, IsOptional } from 'class-validator';

export class CreateOrderItemDto {
  @IsInt()
  @Min(1)
  quantity: number;

  @IsNumber()
  @Min(0)
  unitPrice: number;

  @IsOptional()
  @IsUUID()
  inventoryId?: string;
}
