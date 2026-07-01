import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AddToFavoriteService } from './add-to-favorite.service';
import { CreateAddToFavoriteDto } from './dto/create-add-to-favorite.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('add-to-favorite')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AddToFavoriteController {
  constructor(private readonly addToFavoriteService: AddToFavoriteService) {}

  @Post()
  @Roles('BRANCH')
  create(@Body() dto: CreateAddToFavoriteDto, @CurrentUser() user: { id: string; role: string }) {
    return this.addToFavoriteService.create(dto, user.id);
  }

  @Get()
  @Roles('BRANCH')
  findAll(@CurrentUser() user: { id: string; role: string }) {
    return this.addToFavoriteService.findAll(user.id);
  }

  @Get(':id')
  @Roles('BRANCH')
  findOne(@Param('id') id: string, @CurrentUser() user: { id: string; role: string }) {
    return this.addToFavoriteService.findOne(id, user.id);
  }

  @Delete(':id')
  @Roles('BRANCH')
  remove(@Param('id') id: string, @CurrentUser() user: { id: string; role: string }) {
    return this.addToFavoriteService.remove(id, user.id);
  }

  @Delete('inventory/:inventoryId')
  @Roles('BRANCH')
  removeByInventory(
    @Param('inventoryId') inventoryId: string,
    @CurrentUser() user: { id: string; role: string },
  ) {
    return this.addToFavoriteService.removeByInventory(inventoryId, user.id);
  }
}
