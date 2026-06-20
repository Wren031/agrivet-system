import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AssignOrderDto } from './dto/assign-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateOrderDto, user?: { id: string; role: string }) {
    let agentProfileId: string | undefined;

    if (user?.role === 'AGENT') {
      const agentProfile = await this.prisma.agentProfile.findUnique({
        where: { userId: user.id },
      });
      if (!agentProfile) {
        throw new ForbiddenException('Agent profile not found');
      }
      agentProfileId = agentProfile.id;
    }

    const itemsData = dto.items || [];
    const totalAmount = itemsData.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0,
    );

    return this.prisma.order.create({
      data: {
        notes: dto.notes,
        status: dto.status,
        customerId: dto.customerId,
        agentProfileId,
        totalAmount,
        items: {
          create: itemsData.map((item) => ({
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            subtotal: item.quantity * item.unitPrice,
            inventoryId: item.inventoryId,
          })),
        },
      },
      include: {
        customer: { include: { agentProfile: true } },
        items: { include: { inventory: true } },
        adminProfile: true,
      },
    });
  }

  async findAll(user?: { id: string; role: string }) {
    const where: any = {};

    if (user?.role === 'AGENT') {
      const agentProfile = await this.prisma.agentProfile.findUnique({
        where: { userId: user.id },
      });
      if (agentProfile) {
        where.agentProfileId = agentProfile.id;
      } else {
        return [];
      }
    }

    return this.prisma.order.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: { include: { agentProfile: true } },
        items: { include: { inventory: true } },
        adminProfile: true,
      },
    });
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        customer: { include: { agentProfile: true } },
        items: { include: { inventory: true } },
        adminProfile: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async update(id: string, dto: UpdateOrderDto, user?: { id: string; role: string }) {
    const order = await this.findOne(id);

    if (user?.role === 'AGENT') {
      const agentProfile = await this.prisma.agentProfile.findUnique({
        where: { userId: user.id },
      });
      if (!agentProfile || order.agentProfileId !== agentProfile.id) {
        throw new ForbiddenException('You can only update your own orders');
      }
    }

    const data: any = {};
    if (dto.notes !== undefined) data.notes = dto.notes;
    if (dto.status !== undefined) data.status = dto.status;

    if (dto.items && dto.items.length > 0) {
      const totalAmount = dto.items.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0,
      );
      data.totalAmount = totalAmount;

      await this.prisma.orderItem.deleteMany({ where: { orderId: id } });

      data.items = {
        create: dto.items.map((item) => ({
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          subtotal: item.quantity * item.unitPrice,
          inventoryId: item.inventoryId,
        })),
      };
    }

    return this.prisma.order.update({
      where: { id },
      data,
      include: {
        customer: { include: { agentProfile: true } },
        items: { include: { inventory: true } },
        adminProfile: true,
      },
    });
  }

  async assignOrder(id: string, dto: AssignOrderDto) {
    const order = await this.findOne(id);

    const data: any = {};

    if (dto.adminProfileId !== undefined) {
      data.adminProfileId = dto.adminProfileId;
      data.status = 'APPROVED';
    }

    if (dto.status !== undefined) {
      data.status = dto.status;
    }

    return this.prisma.order.update({
      where: { id },
      data,
      include: {
        customer: { include: { agentProfile: true } },
        items: { include: { inventory: true } },
        adminProfile: true,
      },
    });
  }

  async remove(id: string, user?: { id: string; role: string }) {
    const order = await this.findOne(id);

    if (user?.role === 'AGENT') {
      const agentProfile = await this.prisma.agentProfile.findUnique({
        where: { userId: user.id },
      });
      if (!agentProfile || order.agentProfileId !== agentProfile.id) {
        throw new ForbiddenException('You can only delete your own orders');
      }
    }

    return this.prisma.order.delete({ where: { id } });
  }
}
