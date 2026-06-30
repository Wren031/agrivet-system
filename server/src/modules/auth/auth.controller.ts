import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { CreateAgentDto } from '../agents/dto/create-agent.dto';
import { CreateBranchAuthDto } from './dto/create-branch-auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('admin/login')
  async login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('admin/register')
  async register(@Body() dto: CreateUserDto) {
    return this.authService.register(dto);
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
