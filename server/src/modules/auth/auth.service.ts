import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../database/prisma.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { CreateAgentDto } from '../agents/dto/create-agent.dto';
import { CreateBranchAuthDto } from './dto/create-branch-auth.dto';

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

    const payload = {
      sub: branchProfile.user.id,
      email: branchProfile.email,
      role: branchProfile.user.role,
    };

    return {
      message: `Welcome back, ${branchProfile.fullName}`,
      accessToken: this.jwtService.sign(payload),
      user: {
        id: branchProfile.user.id,
        email: branchProfile.email,
        fullName: branchProfile.fullName,
        storeName: branchProfile.storeBranch,
        contactNumber: branchProfile.contactNumber,
        address: branchProfile.address,
        idVerificationUrl: branchProfile.verificationImage,
        role: branchProfile.user.role,
        status: branchProfile.status,
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
}
