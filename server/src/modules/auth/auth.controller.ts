import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { CreateAgentDto } from '../agents/dto/create-agent.dto';
import { CreateBranchAuthDto } from './dto/create-branch-auth.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  
  changePassword(@Body() dto: ChangePasswordDto, @CurrentUser() user: { id: string }) {
    return this.authService.changePassword(user.id, dto);
  }

  @Post('admin/login')
  async adminLogin(@Body() dto: LoginDto) {
    return this.authService.adminLogin(dto);
  }

  @Post('admin/register')
  async adminRegister(@Body() dto: CreateUserDto) {
    return this.authService.adminRegister(dto);
  }

  @Post('agent/login')
  async agentLogin(@Body() dto: LoginDto) {
    return this.authService.agentLogin(dto);
  }

  @Post('agent/register')
  async agentRegister(@Body() dto: CreateAgentDto) {
    return this.authService.agentRegister(dto);
  }

  @Post('branches/login')
  async branchLogin(@Body() dto: LoginDto) {
    return this.authService.branchLogin(dto);
  }

  @Post('branches/register')
  async branchRegister(@Body() dto: CreateBranchAuthDto) {
    return this.authService.branchRegister(dto);
  }
}
