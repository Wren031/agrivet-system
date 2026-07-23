import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../database/prisma.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { CreateAgentDto } from '../agents/dto/create-agent.dto';
import { CreateBranchAuthDto } from './dto/create-branch-auth.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  generateAccessToken(user: { id: string; role: string; email: string }) {
    return this.jwtService.sign(
      {
        sub: user.id,
        email: user.email,
        role: user.role,
      },
      {
        expiresIn: '15m',
      },
    );
  }

  generateRefreshToken(user: { id: string }) {
    return this.jwtService.sign(
      {
        sub: user.id,
      },
      {
        expiresIn: '7d',
      },
    );
  }

  async adminLogin(dto: LoginDto) {
    const adminProfile = await this.prisma.adminProfile.findUnique({
      where: { email: dto.email },
      include: { user: true },
    });

    if (!adminProfile || !adminProfile.user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.password,
      adminProfile.user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = {
      id: adminProfile.user.id,
      email: adminProfile.email,
      role: adminProfile.user.role,
    };


    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken({ id: user.id });

    return {
      message: `Welcome back, ${adminProfile.fullName}`,
      accessToken,
      refreshToken,
      user: {
        id: adminProfile.user.id,
        email: adminProfile.email,
        fullName: adminProfile.fullName,
        role: adminProfile.user.role,
      },
    };
  }

  async adminRegister(dto: CreateUserDto) {
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

    const accessToken = this.generateAccessToken({
      id: user.id,
      email: user.adminProfile.email,
      role: user.role,
    });

    const refreshToken = this.generateRefreshToken({ id: user.id });

    return {
      accessToken,
      refreshToken,
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

    const allowedLoginStatuses = ['APPROVED', 'ONLINE', 'OFFLINE'];
    if (!allowedLoginStatuses.includes(agentProfile.status)) {
      const message = agentProfile.status === 'PENDING'
        ? 'Account is not approved yet'
        : `Account is ${agentProfile.status.toLowerCase()}`;
      throw new UnauthorizedException(message);
    }

    const isPasswordValid = await bcrypt.compare(dto.password, agentProfile.user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = {
      id: agentProfile.user.id,
      email: agentProfile.email,
      role: agentProfile.user.role,
    };

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken({ id: user.id });

    return {
      message: `Welcome back, ${agentProfile.fullName}`,
      accessToken,
      refreshToken,
      user: {
        id: agentProfile.user.id,
        email: agentProfile.email,
        fullName: agentProfile.fullName,
        role: agentProfile.user.role,
        status: agentProfile.status,
        contactNumber: agentProfile.contactNumber,
        idVerificationUrl: agentProfile.idVerificationUrl,
        agentProfileId: agentProfile.id,
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
        agentProfileId: user.agentProfile.id,
      },
    };
  }

  async branchLogin(dto: LoginDto) {
    const branchProfile = await this.prisma.branchProfile.findUnique({
      where: { email: dto.email },
      include: { user: true },
    });

    if (!branchProfile) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const allowedLoginStatuses = ['APPROVED', 'ONLINE', 'OFFLINE'];
    if (!allowedLoginStatuses.includes(branchProfile.status)) {
      const message = branchProfile.status === 'PENDING'
        ? 'Account is not approved yet'
        : `Account is ${branchProfile.status.toLowerCase()}`;
      throw new UnauthorizedException(message);
    }

    const isPasswordValid = await bcrypt.compare(dto.password, branchProfile.user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const user = {
      id: branchProfile.user.id,
      email: branchProfile.email,
      role: branchProfile.user.role,
    }

    const accessToken = this.generateAccessToken(user);
    const refreshToken = this.generateRefreshToken({ id: user.id });

    return {
      message: `Welcome back, ${branchProfile.fullName}`,
      accessToken,
      refreshToken,
      user: {
        id: branchProfile.user.id,
        email: branchProfile.email,
        fullName: branchProfile.fullName,
        storeName: branchProfile.storeBranch,
        role: branchProfile.user.role,
        status: branchProfile.status,
        contactNumber: branchProfile.contactNumber,
        address: branchProfile.address,
        idVerificationUrl: branchProfile.verificationImage,
        branchProfileId: branchProfile.id,
      },
    };
  }

  async branchRegister(dto: CreateBranchAuthDto) {
    const existing = await this.prisma.branchProfile.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        password: hashedPassword,
        role: 'BRANCH',
        branchProfile: {
          create: {
            fullName: dto.fullName,
            storeBranch: dto.storeName,
            contactNumber: dto.contactNumber,
            email: dto.email,
            address: dto.address ?? '',
            verificationImage: dto.idVerificationUrl ?? '',
            status: 'PENDING',
          },
        },
      },
      include: { branchProfile: true },
    });

    const payload = {
      sub: user.id,
      email: user.branchProfile.email,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.branchProfile.email,
        fullName: user.branchProfile.fullName,
        storeName: user.branchProfile.storeBranch,
        contactNumber: user.branchProfile.contactNumber,
        address: user.branchProfile.address,
        idVerificationUrl: user.branchProfile.verificationImage,
        role: user.role,
        status: user.branchProfile.status,
        branchProfileId: user.branchProfile.id,
      },
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        adminProfile: true,
        agentProfile: true,
        branchProfile: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const result: any = {
      id: user.id,
      role: user.role,
    };

    if (user.adminProfile) {
      result.email = user.adminProfile.email;
      result.fullName = user.adminProfile.fullName;
      result.contactNumber = user.adminProfile.contactNumber;
    } else if (user.agentProfile) {
      result.email = user.agentProfile.email;
      result.fullName = user.agentProfile.fullName;
      result.contactNumber = user.agentProfile.contactNumber;
      result.status = user.agentProfile.status;
      result.idVerificationUrl = user.agentProfile.idVerificationUrl;
    } else if (user.branchProfile) {
      result.email = user.branchProfile.email;
      result.fullName = user.branchProfile.fullName;
      result.contactNumber = user.branchProfile.contactNumber;
      result.status = user.branchProfile.status;
      result.storeName = user.branchProfile.storeBranch;
      result.address = user.branchProfile.address;
      result.idVerificationUrl = user.branchProfile.verificationImage;
    }

    return result;
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken);

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const accessToken = this.generateAccessToken({
        id: user.id,
        email: payload.email ?? '',
        role: user.role,
      });

      return { accessToken };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async changePassword(userId: string, dto: ChangePasswordDto) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isPasswordValid = await bcrypt.compare(dto.currentPassword, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Current password is incorrect');
    }

    if (dto.currentPassword === dto.newPassword) {
      throw new BadRequestException('New password must be different from current password');
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { message: 'Password changed successfully' };
  }

  async logout(userId: string) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }
}
