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
import { CartItemsService } from './cart-items.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('cart-items')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CartItemsController {
  constructor(private readonly cartItemsService: CartItemsService) {}

  @Post()
  @Roles('BRANCH')
  create(@Body() dto: CreateCartItemDto, @CurrentUser() user: { id: string; role: string }) {
    return this.cartItemsService.create(dto, user.id);
  }

  @Get()
  @Roles('BRANCH')
  findAll(@CurrentUser() user: { id: string; role: string }) {
    return this.cartItemsService.findAll(user.id);
  }

  @Get(':id')
  @Roles('BRANCH')
  findOne(@Param('id') id: string, @CurrentUser() user: { id: string; role: string }) {
    return this.cartItemsService.findOne(id, user.id);
  }

  @Patch(':id')
  @Roles('BRANCH')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCartItemDto,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.cartItemsService.update(id, user.id, dto);
  }

  @Delete(':id')
  @Roles('BRANCH')
  remove(@Param('id') id: string, @CurrentUser() user: { id: string; role: string }) {
    return this.cartItemsService.remove(id, user.id);
  }

  @Delete()
  @Roles('BRANCH')
  clearCart(@CurrentUser() user: { id: string; role: string }) {
    return this.cartItemsService.clearCart(user.id);
  }
}
