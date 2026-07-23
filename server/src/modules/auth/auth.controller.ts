import { Controller, Post, Get, Body, UseGuards, Req, Res, UnauthorizedException } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { CreateAgentDto } from '../agents/dto/create-agent.dto';
import { CreateBranchAuthDto } from './dto/create-branch-auth.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Request, Response } from 'express';

const ACCESS_TOKEN_COOKIE = 'access_token';
const REFRESH_TOKEN_COOKIE = 'refresh_token';

const COOKIE_OPTIONS_ACCESS = {
  httpOnly: true,
  secure: true,
  sameSite: 'strict' as const,
  path: '/api',
  maxAge: 15 * 60 * 1000,
};

const COOKIE_OPTIONS_REFRESH = {
  httpOnly: true,
  secure: true,
  sameSite: 'strict' as const,
  path: '/api/auth/refresh',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

function setAuthCookies(res: Response, accessToken: string, refreshToken: string) {
  res.cookie(ACCESS_TOKEN_COOKIE, accessToken, COOKIE_OPTIONS_ACCESS);
  res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, COOKIE_OPTIONS_REFRESH);
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('change-password')
  @UseGuards(JwtAuthGuard)

  changePassword(@Body() dto: ChangePasswordDto, @CurrentUser() user: { id: string }) {
    return this.authService.changePassword(user.id, dto);
  }

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('admin/login')
  async adminLogin(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.adminLogin(dto);
    setAuthCookies(res, result.accessToken, result.refreshToken);
    return result;
  }

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('admin/register')
  async adminRegister(@Body() dto: CreateUserDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.adminRegister(dto);
    setAuthCookies(res, result.accessToken, result.refreshToken);
    return result;
  }

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('agent/login')
  async agentLogin(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.agentLogin(dto);
    setAuthCookies(res, result.accessToken, result.refreshToken);
    return result;
  }

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('agent/register')
  async agentRegister(@Body() dto: CreateAgentDto) {
    return this.authService.agentRegister(dto);
  }

  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('branches/login')
  async branchLogin(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.branchLogin(dto);
    setAuthCookies(res, result.accessToken, result.refreshToken);
    return result;
  }

  @Throttle({ default: { limit: 3, ttl: 60000 } })
  @Post('branches/register')
  async branchRegister(@Body() dto: CreateBranchAuthDto) {
    return this.authService.branchRegister(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@CurrentUser() user: { id: string }) {
    return this.authService.getProfile(user.id);
  }

  @Post('refresh')
  async refresh(@Body('refreshToken') bodyToken: string, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = bodyToken || req.cookies?.refresh_token;
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }
    const result = await this.authService.refreshAccessToken(refreshToken);
    res.cookie(ACCESS_TOKEN_COOKIE, result.accessToken, COOKIE_OPTIONS_ACCESS);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  async logout(@CurrentUser() user: { id: string }, @Res() res: Response) {
    await this.authService.logout(user.id);

    res.clearCookie(ACCESS_TOKEN_COOKIE);
    res.clearCookie(REFRESH_TOKEN_COOKIE);

    return res.send({ message: 'Logout successful' });
  }
}