import { PartialType } from '@nestjs/mapped-types';
import { CreateBranchOrderItemDto } from './create-branch-order-item.dto';

export class UpdateBranchOrderItemDto extends PartialType(CreateBranchOrderItemDto) {}
