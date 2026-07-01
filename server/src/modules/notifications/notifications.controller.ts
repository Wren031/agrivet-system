import {
  Controller,
  Get,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @Roles('ADMIN', 'AGENT', 'BRANCH')
  findAll(@CurrentUser() user: { id: string; role: string }) {
    return this.notificationsService.findAll(user.id);
  }

  @Get('unread')
  @Roles('ADMIN', 'AGENT', 'BRANCH')
  findUnread(@CurrentUser() user: { id: string; role: string }) {
    return this.notificationsService.findUnread(user.id);
  }

  @Get('count')
  @Roles('ADMIN', 'AGENT', 'BRANCH')
  countUnread(@CurrentUser() user: { id: string; role: string }) {
    return this.notificationsService.countUnread(user.id);
  }

  @Patch(':id/read')
  @Roles('ADMIN', 'AGENT', 'BRANCH')
  markAsRead(
    @Param('id') id: string,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.notificationsService.markAsRead(id, user.id);
  }

  @Patch('read-all')
  @Roles('ADMIN', 'AGENT', 'BRANCH')
  markAllAsRead(@CurrentUser() user: { id: string; role: string }) {
    return this.notificationsService.markAllAsRead(user.id);
  }

  @Delete(':id')
  @Roles('ADMIN', 'AGENT', 'BRANCH')
  remove(
    @Param('id') id: string,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.notificationsService.remove(id, user.id);
  }
}
