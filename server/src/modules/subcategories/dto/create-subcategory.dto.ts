import { IsString, MinLength } from 'class-validator';

export class CreateSubcategoryDto {
  @IsString()
  @MinLength(1)
  name: string;
}
