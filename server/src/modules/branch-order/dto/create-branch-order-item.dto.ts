import { IsNumber, IsUUID, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBranchOrderItemDto {
  @IsUUID()
  inventoryId: string;

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  quantity: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  subtotal: number;
}
