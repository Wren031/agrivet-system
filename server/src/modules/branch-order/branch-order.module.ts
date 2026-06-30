import { Module } from '@nestjs/common';
import { BranchOrderController } from './branch-order.controller';
import { BranchOrderService } from './branch-order.service';

@Module({
  controllers: [BranchOrderController],
  providers: [BranchOrderService],
  exports: [BranchOrderService],
})
export class BranchOrderModule {}
