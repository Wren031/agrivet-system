import { Injectable, ConflictException, NotFoundException, BadRequestException, ForbiddenException, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../database/prisma.service';
import { GeocodingService } from './geocoding.service';
import { CreateAgentDto } from './dto/create-agent.dto';
import { UpdateAgentDto } from './dto/update-agent.dto';
import { UpdateAgentStatusDto } from './dto/update-agent-status.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class AgentsService {
  private readonly logger = new Logger(AgentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly geocoding: GeocodingService,
  ) {}

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
            address: dto.address,
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
      include: { user: { select: { id: true, role: true, createdAt: true } }, locations: true },
    });
  }

  async findAllWithLocations() {
    const agents = await this.prisma.agentProfile.findMany({
      include: {
        user: { select: { id: true, role: true, createdAt: true } },
        locations: {
          select: {
            latitude: true,
            longitude: true,
            address: true,
            updatedAt: true,
          },
        },
      },
    });

    return agents
      .filter(a => a.locations.length > 0)
      .map(a => ({
        id: a.id,
        fullName: a.fullName,
        contactNumber: a.contactNumber,
        email: a.email,
        status: a.status,
        createdAt: a.createdAt,
        user: a.user,
        location: a.locations[0],
      }))
      .sort((a, b) => {
        const dateA = a.location.updatedAt.getTime();
        const dateB = b.location.updatedAt.getTime();
        return dateB - dateA;
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
    if (dto.address !== undefined) data.address = dto.address;
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

  private async verifyOwnership(agentId: string, userId: string, userRole: string) {
    if (userRole === 'ADMIN') return;
    const agent = await this.prisma.agentProfile.findUnique({
      where: { id: agentId },
      select: { userId: true },
    });
    if (!agent || agent.userId !== userId) {
      throw new ForbiddenException('You can only access your own agent profile');
    }
  }

  async updateStatus(id: string, dto: UpdateAgentStatusDto, userId?: string, userRole?: string) {
    if (userId && userRole) {
      await this.verifyOwnership(id, userId, userRole);
    }
    const agent = await this.prisma.agentProfile.findUnique({ where: { id } });
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    if (agent.status === dto.status) {
      return agent;
    }

    if (userRole === 'AGENT' && dto.status !== 'ONLINE' && dto.status !== 'OFFLINE') {
      throw new ForbiddenException('Agents can only set ONLINE or OFFLINE status');
    }

    if (dto.status === 'ONLINE' || dto.status === 'OFFLINE') {
      const allowed = ['APPROVED', 'ONLINE', 'OFFLINE'];
      if (!allowed.includes(agent.status)) {
        throw new BadRequestException(
          'Only approved agents can transition between ONLINE and OFFLINE statuses',
        );
      }
    }

    return this.prisma.agentProfile.update({
      where: { id },
      data: { status: dto.status },
      include: { user: { select: { id: true, role: true, createdAt: true } } },
    });
  }

  async updateLocation(id: string, dto: UpdateLocationDto, userId?: string, userRole?: string) {
    if (userId && userRole) {
      await this.verifyOwnership(id, userId, userRole);
    }

    const agent = await this.prisma.agentProfile.findUnique({ where: { id } });
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    let address: string | null = null;
    try {
      address = await this.geocoding.reverse(dto.latitude, dto.longitude);
    } catch (error) {
      this.logger.warn(`Geocoding failed for agent ${id}: ${(error as Error).message}`);
    }

    return this.prisma.agentLocation.upsert({
      where: { agentId: id },
      update: { latitude: dto.latitude, longitude: dto.longitude, address },
      create: { agentId: id, latitude: dto.latitude, longitude: dto.longitude, address },
    });
  }

  async getLocation(id: string, userId?: string, userRole?: string) {
    if (userId && userRole) {
      await this.verifyOwnership(id, userId, userRole);
    }

    const agent = await this.prisma.agentProfile.findUnique({ where: { id }, select: { id: true } });
    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    const location = await this.prisma.agentLocation.findUnique({
      where: { agentId: id },
    });

    return location ?? { message: 'No location data available for this agent' };
  }

  async findCustomersByAgent(id: string, userId?: string, userRole?: string) {
    if (userId && userRole) {
      await this.verifyOwnership(id, userId, userRole);
    }

    const agent = await this.prisma.agentProfile.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    return this.prisma.customer.findMany({
      where: { agentProfileId: id },
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
