import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../database/prisma.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { CreateAgentDto } from '../agents/dto/create-agent.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const adminProfile = await this.prisma.adminProfile.findUnique({
      where: { email: dto.email },
      include: { user: true },
    });

    if (!adminProfile) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, adminProfile.user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: adminProfile.user.id,
      email: adminProfile.email,
      role: adminProfile.user.role,
    };

    return {
      message: `Welcome back, ${adminProfile.fullName}`,
      accessToken: this.jwtService.sign(payload),
      user: {
        id: adminProfile.user.id,
        email: adminProfile.email,
        fullName: adminProfile.fullName,
        role: adminProfile.user.role,

      },
    };
  }

  async register(dto: CreateUserDto) {
    const existing = await this.prisma.adminProfile.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new UnauthorizedException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        password: hashedPassword,
        role: dto.role ?? 'ADMIN',
        adminProfile: {
          create: {
            fullName: dto.fullName,
            contactNumber: dto.contactNumber,
            email: dto.email,
          },
        },
      },
      include: { adminProfile: true },
    });

    const payload = {
      sub: user.id,
      email: user.adminProfile.email,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.adminProfile.email,
        fullName: user.adminProfile.fullName,
        role: user.role,
      },
    };
  }

  async agentLogin(dto: LoginDto) {
    const agentProfile = await this.prisma.agentProfile.findUnique({
      where: { email: dto.email },
      include: { user: true },
    });

    if (!agentProfile) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (agentProfile.status !== 'APPROVED') {
      throw new UnauthorizedException('Account is not approved yet');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, agentProfile.user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: agentProfile.user.id,
      email: agentProfile.email,
      role: agentProfile.user.role,
    };

    return {
      message: `Welcome back, ${agentProfile.fullName}`,
      accessToken: this.jwtService.sign(payload),
      user: {
        id: agentProfile.user.id,
        email: agentProfile.email,
        fullName: agentProfile.fullName,
        role: agentProfile.user.role,
      },
    };
  }

  async agentRegister(dto: CreateAgentDto) {
    const existing = await this.prisma.agentProfile.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        password: hashedPassword,
        role: 'AGENT',
        agentProfile: {
          create: {
            fullName: dto.fullName,
            contactNumber: dto.contactNumber,
            email: dto.email,
            idVerificationUrl: dto.idVerificationUrl,
            status: 'PENDING',
          },
        },
      },
      include: { agentProfile: true },
    });

    const payload = {
      sub: user.id,
      email: user.agentProfile.email,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.agentProfile.email,
        fullName: user.agentProfile.fullName,
        role: user.role,
        status: user.agentProfile.status,
        contactNumber: user.agentProfile.contactNumber,
        idVerificationUrl: user.agentProfile.idVerificationUrl,
      },
    };
  }
}
