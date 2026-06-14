import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../database/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
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

    return user;
  }

  async findAll() {
    return this.prisma.user.findMany({
      include: { adminProfile: true },
    });
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { adminProfile: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findOne(id);

    const data: any = {};

    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 10);
    }
    if (dto.role) {
      data.role = dto.role;
    }

    const profileData: any = {};
    if (dto.fullName) profileData.fullName = dto.fullName;
    if (dto.contactNumber) profileData.contactNumber = dto.contactNumber;
    if (dto.email) profileData.email = dto.email;

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
