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
import { BranchOrderService } from './branch-order.service';
import { CreateBranchOrderDto } from './dto/create-branch-order.dto';
import { UpdateBranchOrderDto } from './dto/update-branch-order.dto';
import { CreateBranchOrderItemDto } from './dto/create-branch-order-item.dto';
import { UpdateBranchOrderItemDto } from './dto/update-branch-order-item.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('branch-orders')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BranchOrderController {
  constructor(private readonly branchOrderService: BranchOrderService) {}

  @Post()
  @Roles('BRANCH')
  create(@Body() dto: CreateBranchOrderDto, @CurrentUser() user: { id: string; role: string }) {
    return this.branchOrderService.create(dto, user.id);
  }

  @Get()
  @Roles('BRANCH', 'ADMIN')
  findAll(@CurrentUser() user: { id: string; role: string }) {
    return this.branchOrderService.findAll(user.id, user.role);
  }

  @Get(':id')
  @Roles('BRANCH', 'ADMIN')
  findOne(@Param('id') id: string, @CurrentUser() user: { id: string; role: string }) {
    return this.branchOrderService.findOne(id, user.id, user.role);
  }

  @Patch(':id')
  @Roles('BRANCH')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateBranchOrderDto,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.branchOrderService.update(id, user.id, dto);
  }

  @Patch(':id/status')
  @Roles('BRANCH')
  updateStatus(
    @Param('id') id: string,
    @Body('status') status: string,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.branchOrderService.updateStatus(id, user.id, status);
  }

  @Delete(':id')
  @Roles('BRANCH')
  remove(@Param('id') id: string, @CurrentUser() user: { id: string; role: string }) {
    return this.branchOrderService.remove(id, user.id);
  }

  @Patch(':id/assign')
  @Roles('ADMIN')
  assign(
    @Param('id') id: string,
    @Body('adminProfileId') adminProfileId: string,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.branchOrderService.assign(id, adminProfileId, user.id);
  }

  @Post(':id/items')
  @Roles('BRANCH')
  addItem(
    @Param('id') id: string,
    @Body() dto: CreateBranchOrderItemDto,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.branchOrderService.addItem(id, user.id, dto);
  }

  @Patch(':id/items/:itemId')
  @Roles('BRANCH')
  updateItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateBranchOrderItemDto,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.branchOrderService.updateItem(id, itemId, user.id, dto);
  }

  @Delete(':id/items/:itemId')
  @Roles('BRANCH')
  removeItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.branchOrderService.removeItem(id, itemId, user.id);
  }
}
