import { IsString, IsNumber, IsOptional, IsUUID, Min, MinLength, ValidateNested, IsArray, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';

class CreateBranchOrderItemDto {
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

export class CreateBranchOrderDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateBranchOrderItemDto)
  items: CreateBranchOrderItemDto[];

  @IsOptional()
  @IsString()
  @MinLength(1)
  notes?: string;
}
