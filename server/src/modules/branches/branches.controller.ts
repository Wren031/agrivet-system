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
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { UpdateBranchStatusDto } from './dto/update-branch-status.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('branches')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Post()
  @Roles('ADMIN')
  create(@Body() dto: CreateBranchDto) {
    return this.branchesService.create(dto);
  }

  @Get('profile')
  @Roles('BRANCH')
  findProfile(@CurrentUser() user: { id: string }) {
    return this.branchesService.findProfile(user.id);
  }

  @Patch('profile')
  @Roles('BRANCH')
  updateProfile(@Body() dto: UpdateBranchDto, @CurrentUser() user: { id: string }) {
    return this.branchesService.updateProfile(user.id, dto);
  }

  @Get()
  @Roles('ADMIN', 'AGENT')
  findAll() {
    return this.branchesService.findAll();
  }

  @Get(':id')
  @Roles('ADMIN', 'AGENT')
  findOne(@Param('id') id: string) {
    return this.branchesService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN', 'AGENT')
  update(@Param('id') id: string, @Body() dto: UpdateBranchDto) {
    return this.branchesService.update(id, dto);
  }

  @Patch(':id/status')
  @Roles('ADMIN', 'AGENT')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateBranchStatusDto) {
    return this.branchesService.updateStatus(id, dto);
  }

  @Delete(':id')
  @Roles('ADMIN', 'AGENT')
  remove(@Param('id') id: string) {
    return this.branchesService.remove(id);
  }
}
