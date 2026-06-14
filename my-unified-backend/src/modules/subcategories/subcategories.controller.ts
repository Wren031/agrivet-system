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
import { SubcategoriesService } from './subcategories.service';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('categories/:categoryId/subcategories')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SubcategoriesController {
  constructor(private readonly subcategoriesService: SubcategoriesService) {}

  @Post()
  @Roles('ADMIN')
  create(@Param('categoryId') categoryId: string, @Body() dto: CreateSubcategoryDto) {
    return this.subcategoriesService.create(categoryId, dto);
  }

  @Get()
  findAll(@Param('categoryId') categoryId: string) {
    return this.subcategoriesService.findAll(categoryId);
  }

  @Get(':id')
  findOne(@Param('categoryId') categoryId: string, @Param('id') id: string) {
    return this.subcategoriesService.findOne(categoryId, id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  update(
    @Param('categoryId') categoryId: string,
    @Param('id') id: string,
    @Body() dto: UpdateSubcategoryDto,
  ) {
    return this.subcategoriesService.update(categoryId, id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('categoryId') categoryId: string, @Param('id') id: string) {
    return this.subcategoriesService.remove(categoryId, id);
  }
}
