import { IsEnum } from 'class-validator';
import { BranchStatus } from '@prisma/client';

export class UpdateBranchStatusDto {
  @IsEnum(BranchStatus)
  status: BranchStatus;
}
