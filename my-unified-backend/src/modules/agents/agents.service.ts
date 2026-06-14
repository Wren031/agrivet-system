import { Injectable, ConflictException, NotFoundException, BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../database/prisma.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { UpdateAgentStatusDto } from './dto/update-agent-status.dto';

@Injectable()
export class AgentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateAgentDto) {
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
            status: dto.status,
          },
        },
      },
      include: { agentProfile: true },
    });

    return user;
  }

  async findAll() {
    return this.prisma.agentProfile.findMany({
      include: { user: { select: { id: true, role: true, createdAt: true } } },
    });
  }

  async findOne(id: string) {
    const agent = await this.prisma.agentProfile.findUnique({
      where: { id },
      include: { user: { select: { id: true, role: true, createdAt: true } } },
    });

    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    return agent;
  }

  async update(id: string, dto: UpdateAgentDto) {
    const agent = await this.prisma.agentProfile.findUnique({ where: { id } });
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    const data: any = {};
    if (dto.fullName) data.fullName = dto.fullName;
    if (dto.contactNumber) data.contactNumber = dto.contactNumber;
    if (dto.email) data.email = dto.email;
    if (dto.idVerificationUrl !== undefined) data.idVerificationUrl = dto.idVerificationUrl;
    if (dto.status !== undefined) data.status = dto.status;

    if (dto.password) {
      await this.prisma.user.update({
        where: { id: agent.userId },
        data: { password: await bcrypt.hash(dto.password, 10) },
      });
    }

    return this.prisma.agentProfile.update({
      where: { id },
      data,
      include: { user: { select: { id: true, role: true, createdAt: true } } },
    });
  }

  async updateStatus(id: string, dto: UpdateAgentStatusDto) {
    const agent = await this.prisma.agentProfile.findUnique({ where: { id } });
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    if (agent.status === dto.status) {
      return agent;
    }

    return this.prisma.agentProfile.update({
      where: { id },
      data: { status: dto.status },
      include: { user: { select: { id: true, role: true, createdAt: true } } },
    });
  }

  async remove(id: string) {
    const agent = await this.prisma.agentProfile.findUnique({ where: { id } });
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    await this.prisma.user.delete({ where: { id: agent.userId } });
    return { message: 'Agent deleted successfully' };
  }
}
