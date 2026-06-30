import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCustomerDto, user?: { id: string; role: string }) {
    const data: any = { ...dto };

    if (user?.role === 'AGENT') {
      const agentProfile = await this.prisma.agentProfile.findUnique({
        where: { userId: user.id },
      });
      if (!agentProfile) {
        throw new ForbiddenException('Agent profile not found');
      }
      data.agentProfileId = agentProfile.id;
    }

    return this.prisma.customer.create({
      data,
      include: { agentProfile: true, _count: { select: { orders: true } } },
    });
  }

  async findAll(user?: { id: string; role: string }) {
    const where: any = {};

    // AGENT users only see their own customers
    if (user?.role === 'AGENT') {
      const agentProfile = await this.prisma.agentProfile.findUnique({
        where: { userId: user.id },
      });
      if (agentProfile) {
        where.agentProfileId = agentProfile.id;
      } else {
        return []; // no agent profile, no customers
      }
    }

    return this.prisma.customer.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { agentProfile: true, _count: { select: { orders: true } } },
    });
  }

  async findOne(id: string) {
    const customer = await this.prisma.customer.findUnique({
      where: { id },
      include: { agentProfile: true, _count: { select: { orders: true } } },
    });

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }

  async update(id: string, dto: UpdateCustomerDto, user?: { id: string; role: string }) {
    const customer = await this.findOne(id);

    // AGENT users can only update their own customers
    if (user?.role === 'AGENT') {
      const agentProfile = await this.prisma.agentProfile.findUnique({
        where: { userId: user.id },
      });
      if (!agentProfile || customer.agentProfileId !== agentProfile.id) {
        throw new ForbiddenException('You can only update your own customers');
      }
    }

    return this.prisma.customer.update({
      where: { id },
      data: dto,
      include: { agentProfile: true, _count: { select: { orders: true } } },
    });
  }

  async remove(id: string, user?: { id: string; role: string }) {
    const customer = await this.findOne(id);

    // AGENT users can only delete their own customers
    if (user?.role === 'AGENT') {
      const agentProfile = await this.prisma.agentProfile.findUnique({
        where: { userId: user.id },
      });
      if (!agentProfile || customer.agentProfileId !== agentProfile.id) {
        throw new ForbiddenException('You can only delete your own customers');
      }
    }

    return this.prisma.customer.delete({ where: { id } });
  }
}
