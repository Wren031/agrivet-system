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
import { AdminService } from './admin.service';
import { CreateAdminStaffDto } from './dto/create-admin-staff.dto';
import { UpdateAdminStaffDto } from './dto/update-admin-staff.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('admin/staff')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  @Roles('ADMIN')
  create(@Body() dto: CreateAdminStaffDto) {
    return this.adminService.create(dto);
  }

  @Get()
  @Roles('ADMIN')
  findAll() {
    return this.adminService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdateAdminStaffDto) {
    return this.adminService.update(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.adminService.remove(id);
  }
}
