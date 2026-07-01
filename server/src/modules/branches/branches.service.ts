import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../database/prisma.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { UpdateBranchStatusDto } from './dto/update-branch-status.dto';

@Injectable()
export class BranchesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBranchDto) {
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
            storeBranch: dto.storeBranch,
            contactNumber: dto.contactNumber,
            email: dto.email,
            status: dto.status,
            address: dto.address,
            verificationImage: dto.verificationImage,
          },
        },
      },
      include: { branchProfile: true },
    });

    return user;
  }

  async findAll() {
    return this.prisma.branchProfile.findMany({
      include: { user: { select: { id: true, role: true, createdAt: true } } },
    });
  }

  async updateProfile(userId: string, dto: UpdateBranchDto) {
    const branch = await this.prisma.branchProfile.findUnique({
      where: { userId },
    });

    if (!branch) {
      throw new NotFoundException('Branch profile not found');
    }

    const data: any = {};
    if (dto.fullName) data.fullName = dto.fullName;
    if (dto.storeBranch) data.storeBranch = dto.storeBranch;
    if (dto.contactNumber) data.contactNumber = dto.contactNumber;
    if (dto.email) data.email = dto.email;
    if (dto.status) data.status = dto.status;
    if (dto.address !== undefined) data.address = dto.address;
    if (dto.verificationImage !== undefined) data.verificationImage = dto.verificationImage;

    if (dto.password) {
      await this.prisma.user.update({
        where: { id: branch.userId },
        data: { password: await bcrypt.hash(dto.password, 10) },
      });
    }

    return this.prisma.branchProfile.update({
      where: { userId },
      data,
      include: { user: { select: { id: true, role: true, createdAt: true } } },
    });
  }

  async findProfile(userId: string) {
    const branch = await this.prisma.branchProfile.findUnique({
      where: { userId },
      include: { user: { select: { id: true, role: true, createdAt: true } } },
    });

    if (!branch) {
      throw new NotFoundException('Branch profile not found');
    }

    return branch;
  }

  async findOne(id: string) {
    const branch = await this.prisma.branchProfile.findUnique({
      where: { id },
      include: { user: { select: { id: true, role: true, createdAt: true } } },
    });

    if (!branch) {
      throw new NotFoundException('Branch not found');
    }

    return branch;
  }

  async update(id: string, dto: UpdateBranchDto) {
    const branch = await this.prisma.branchProfile.findUnique({ where: { id } });
    if (!branch) {
      throw new NotFoundException('Branch not found');
    }

    const data: any = {};
    if (dto.fullName) data.fullName = dto.fullName;
    if (dto.storeBranch) data.storeBranch = dto.storeBranch;
    if (dto.contactNumber) data.contactNumber = dto.contactNumber;
    if (dto.email) data.email = dto.email;
    if (dto.status) data.status = dto.status;
    if (dto.address !== undefined) data.address = dto.address;
    if (dto.verificationImage !== undefined) data.verificationImage = dto.verificationImage;

    if (dto.password) {
      await this.prisma.user.update({
        where: { id: branch.userId },
        data: { password: await bcrypt.hash(dto.password, 10) },
      });
    }

    return this.prisma.branchProfile.update({
      where: { id },
      data,
      include: { user: { select: { id: true, role: true, createdAt: true } } },
    });
  }

  async updateStatus(id: string, dto: UpdateBranchStatusDto) {
    const branch = await this.prisma.branchProfile.findUnique({ where: { id } });
    if (!branch) {
      throw new NotFoundException('Branch not found');
    }

    if (branch.status === dto.status) {
      return branch;
    }

    const allowedTransitions: Record<string, string[]> = {
      PENDING: ['APPROVED', 'REJECTED'],
      APPROVED: ['ONLINE', 'OFFLINE', 'TERMINATED'],
      REJECTED: ['PENDING'],
      TERMINATED: [],
      ONLINE: ['OFFLINE', 'APPROVED'],
      OFFLINE: ['ONLINE', 'APPROVED'],
    };

    const allowed = allowedTransitions[branch.status];
    if (!allowed.includes(dto.status)) {
      throw new BadRequestException(
        `Cannot transition from ${branch.status} to ${dto.status}`,
      );
    }

    return this.prisma.branchProfile.update({
      where: { id },
      data: { status: dto.status },
      include: { user: { select: { id: true, role: true, createdAt: true } } },
    });
  }

  async remove(id: string) {
    const branch = await this.prisma.branchProfile.findUnique({ where: { id } });
    if (!branch) {
      throw new NotFoundException('Branch not found');
    }

    await this.prisma.user.delete({ where: { id: branch.userId } });
    return { message: 'Branch deleted successfully' };
  }
}
