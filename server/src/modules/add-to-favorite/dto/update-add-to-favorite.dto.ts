import { PartialType } from '@nestjs/mapped-types';
import { CreateAddToFavoriteDto } from './create-add-to-favorite.dto';

export class UpdateAddToFavoriteDto extends PartialType(CreateAddToFavoriteDto) {}
