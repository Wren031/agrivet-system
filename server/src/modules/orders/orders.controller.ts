import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AssignOrderDto } from './dto/assign-order.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Roles('ADMIN', 'AGENT')
  create(@Body() dto: CreateOrderDto, @CurrentUser() user: { id: string; role: string }) {
    return this.ordersService.create(dto, user);
  }

  @Get()
  findAll(@CurrentUser() user: { id: string; role: string }) {
    return this.ordersService.findAll(user);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'AGENT')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateOrderDto,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.ordersService.update(id, dto, user);
  }

  @Patch(':id/assign')
  @Roles('ADMIN')
  assign(
    @Param('id') id: string,
    @Body() dto: AssignOrderDto,
  ) {
    return this.ordersService.assignOrder(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN', 'AGENT')
  remove(@Param('id') id: string, @CurrentUser() user: { id: string; role: string }) {
    return this.ordersService.remove(id, user);
  }
}
