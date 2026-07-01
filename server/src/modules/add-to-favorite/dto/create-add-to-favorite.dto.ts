import { IsUUID } from 'class-validator';

export class CreateAddToFavoriteDto {
  @IsUUID()
  inventoryId: string;
}
