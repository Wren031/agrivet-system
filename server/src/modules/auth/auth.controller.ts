import { Controller, Post, Body, UseGuards, Req, Res } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { CreateAgentDto } from '../agents/dto/create-agent.dto';
import { CreateBranchAuthDto } from './dto/create-branch-auth.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Response, Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('change-password')
  @UseGuards(JwtAuthGuard)

  changePassword(@Body() dto: ChangePasswordDto, @CurrentUser() user: { id: string }) {
    return this.authService.changePassword(user.id, dto);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('admin/login')
  async adminLogin(@Body() dto: LoginDto) {
    return this.authService.adminLogin(dto);
  }

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('admin/register')
  async adminRegister(@Body() dto: CreateUserDto) {
    return this.authService.adminRegister(dto);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('agent/login')
  async agentLogin(@Body() dto: LoginDto) {
    return this.authService.agentLogin(dto);
  }

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('agent/register')
  async agentRegister(@Body() dto: CreateAgentDto) {
    return this.authService.agentRegister(dto);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('branches/login')
  async branchLogin(@Body() dto: LoginDto) {
    return this.authService.branchLogin(dto);
  }

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('branches/register')
  async branchRegister(@Body() dto: CreateBranchAuthDto) {
    return this.authService.branchRegister(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@CurrentUser() user: { id: string }, @Res() res: Response) {
    await this.authService.logout(user.id);

    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    return res.send({ message: 'Logout successful' });
  }
}