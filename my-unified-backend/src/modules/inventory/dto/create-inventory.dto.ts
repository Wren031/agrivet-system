import { IsString, IsNumber, IsOptional, IsUUID, Min, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInventoryDto {
  @IsString()
  @MinLength(1)
  productName: string;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsUUID()
  subcategoryId?: string;

  @IsString()
  @MinLength(1)
  unit: string;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  costPrice: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  sellingPrice: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  stockLevel: number;

  @IsNumber()
  @Min(0)
  @Type(() => Number)
  reorderPoint: number;

  @IsOptional()
  expiryDate?: string;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}
