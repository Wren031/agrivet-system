import { IsString, IsNumber, IsOptional, IsUUID, Min, IsIn } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCartItemDto {
  @IsUUID()
  inventoryId: string;

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  quantity: number;

  @IsOptional()
  @IsString()
  @IsIn(['CHECKOUT', 'NOT_CHECKOUT'])
  status?: string;
}
