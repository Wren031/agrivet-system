import { Module } from '@nestjs/common';
import { BranchOrderController } from './branch-order.controller';
import { BranchOrderService } from './branch-order.service';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [BranchOrderController],
  providers: [BranchOrderService],
  exports: [BranchOrderService],
})
export class BranchOrderModule {}
