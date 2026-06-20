import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../database/prisma.service';
import { CreateAdminStaffDto } from './dto/create-admin-staff.dto';
import { UpdateAdminStaffDto } from './dto/update-admin-staff.dto';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAdminStaffDto) {
    const existing = await this.prisma.adminProfile.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        password: hashedPassword,
        role: 'ADMIN',
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

    return user;
  }

  async findAll() {
    return this.prisma.user.findMany({
      where: { role: 'ADMIN' },
      include: { adminProfile: true },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { adminProfile: true },
    });

    if (!user || user.role !== 'ADMIN') {
      throw new NotFoundException('Admin staff not found');
    }

    return user;
  }

  async update(id: string, dto: UpdateAdminStaffDto) {
    await this.findOne(id);

    const data: any = {};

    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 10);
    }

    const profileData: any = {};
    if (dto.fullName) profileData.fullName = dto.fullName;
    if (dto.contactNumber) profileData.contactNumber = dto.contactNumber;
    if (dto.email) {
      const existing = await this.prisma.adminProfile.findUnique({
        where: { email: dto.email },
      });
      if (existing && existing.userId !== id) {
        throw new ConflictException('Email already taken');
      }
      profileData.email = dto.email;
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        ...data,
        adminProfile: {
          update: profileData,
        },
      },
      include: { adminProfile: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.user.delete({ where: { id } });
  }
}
