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
import { AgentsService } from './agents.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { UpdateAgentStatusDto } from './dto/update-agent-status.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('agents')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Post()
  @Roles('ADMIN')
  create(@Body() dto: CreateAgentDto) {
    return this.agentsService.create(dto);
  }

  @Get()
  @Roles('ADMIN')
  findAll() {
    return this.agentsService.findAll();
  }

  @Get('locations')
  @Roles('ADMIN')
  findAllWithLocations() {
    return this.agentsService.findAllWithLocations();
  }

  @Get(':id')
  @Roles('ADMIN')
  findOne(@Param('id') id: string) {
    return this.agentsService.findOne(id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdateAgentDto) {
    return this.agentsService.update(id, dto);
  }

  @Patch(':id/status')
  @Roles('ADMIN', 'AGENT')
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateAgentStatusDto,
    @CurrentUser() user: any,
  ) {
    return this.agentsService.updateStatus(id, dto, user.sub, user.role);
  }

  @Get(':id/location')
  @Roles('ADMIN', 'AGENT')
  getLocation(@Param('id') id: string, @CurrentUser() user: any) {
    return this.agentsService.getLocation(id, user.sub, user.role);
  }

  @Patch(':id/location')
  @Roles('ADMIN', 'AGENT')
  updateLocation(@Param('id') id: string, @Body() dto: UpdateLocationDto, @CurrentUser() user: any) {
    return this.agentsService.updateLocation(id, dto, user.sub, user.role);
  }

  @Get(':id/customers')
  @Roles('ADMIN', 'AGENT')
  findCustomers(@Param('id') id: string, @CurrentUser() user: any) {
    return this.agentsService.findCustomersByAgent(id, user.sub, user.role);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.agentsService.remove(id);
  }
}
