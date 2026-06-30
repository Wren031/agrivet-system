import { PartialType, OmitType } from '@nestjs/mapped-types';
import { CreateBranchOrderDto } from './create-branch-order.dto';

export class UpdateBranchOrderDto extends PartialType(
  OmitType(CreateBranchOrderDto, ['items'] as const),
) {}
