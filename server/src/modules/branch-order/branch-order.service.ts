import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateBranchOrderDto } from './dto/create-branch-order.dto';
import { UpdateBranchOrderDto } from './dto/update-branch-order.dto';
import { CreateBranchOrderItemDto } from './dto/create-branch-order-item.dto';
import { UpdateBranchOrderItemDto } from './dto/update-branch-order-item.dto';

@Injectable()
export class BranchOrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  private include = {
    branchProfile: true,
    adminProfile: true,
    items: {
      include: { inventory: true },
    },
  };

  private async resolveBranchProfileId(userId: string) {
    const branch = await this.prisma.branchProfile.findUnique({
      where: { userId },
    })

    if (!branch) {
      return null
    }

    return branch.id
  }

  async create(dto: CreateBranchOrderDto, userId: string) {
    const branchProfileId = await this.resolveBranchProfileId(userId);
    const totalAmount = dto.items.reduce((sum, item) => sum + item.subtotal, 0);

    return this.prisma.branchOrder.create({
      data: {
        branchProfileId,
        totalAmount,
        notes: dto.notes,
        items: {
          create: dto.items.map((item) => ({
            inventoryId: item.inventoryId,
            quantity: item.quantity,
            subtotal: item.subtotal,
          })),
        },
      },
      include: this.include,
    });
  }

async findAll(userId: string, role?: string) {
  const where: any = {}

  if (role === 'BRANCH') {
    const branchProfileId = await this.resolveBranchProfileId(userId)

    if (!branchProfileId) {
      return []
    }

    where.branchProfileId = branchProfileId
  }

  return this.prisma.branchOrder.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    include: this.include,
  })
}

async findOne(id: string, userId: string, role?: string) {
  const where: any = { id }

  if (role === 'BRANCH') {
    const branchProfileId = await this.resolveBranchProfileId(userId)

    if (!branchProfileId) {
      throw new NotFoundException('Branch profile not found for this user')
    }

    where.branchProfileId = branchProfileId
  }

  const order = await this.prisma.branchOrder.findFirst({
    where,
    include: this.include,
  })

  if (!order) {
    throw new NotFoundException('Branch order not found')
  }

  return order
}

  async update(id: string, userId: string, dto: UpdateBranchOrderDto) {
    await this.findOne(id, userId);

    const data: any = {};
    if (dto.notes !== undefined) data.notes = dto.notes;

    return this.prisma.branchOrder.update({
      where: { id },
      data,
      include: this.include,
    });
  }

async updateStatus(id: string, userId: string, status: string) {
  const order = await this.findOne(id, userId)

  const updated = await this.prisma.branchOrder.update({
    where: { id },
    data: { status },
    include: { ...this.include, branchProfile: true },
  })

  return updated
}

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);
    return this.prisma.branchOrder.delete({ where: { id } });
  }

  async addItem(orderId: string, userId: string, dto: CreateBranchOrderItemDto) {
    await this.findOne(orderId, userId);

    const item = await this.prisma.branchOrderItem.create({
      data: {
        branchOrderId: orderId,
        inventoryId: dto.inventoryId,
        quantity: dto.quantity,
        subtotal: dto.subtotal,
      },
      include: { inventory: true },
    });

    await this.recalculateTotal(orderId);

    return item;
  }

  async updateItem(orderId: string, itemId: string, userId: string, dto: UpdateBranchOrderItemDto) {
    await this.findOne(orderId, userId);

    const existing = await this.prisma.branchOrderItem.findFirst({
      where: { id: itemId, branchOrderId: orderId },
    });
    if (!existing) {
      throw new NotFoundException('Branch order item not found');
    }

    const data: any = {};
    if (dto.inventoryId !== undefined) data.inventoryId = dto.inventoryId;
    if (dto.quantity !== undefined) data.quantity = dto.quantity;
    if (dto.subtotal !== undefined) data.subtotal = dto.subtotal;

    const item = await this.prisma.branchOrderItem.update({
      where: { id: itemId },
      data,
      include: { inventory: true },
    });

    await this.recalculateTotal(orderId);

    return item;
  }

  async removeItem(orderId: string, itemId: string, userId: string) {
    await this.findOne(orderId, userId);

    const existing = await this.prisma.branchOrderItem.findFirst({
      where: { id: itemId, branchOrderId: orderId },
    });
    if (!existing) {
      throw new NotFoundException('Branch order item not found');
    }

    await this.prisma.branchOrderItem.delete({ where: { id: itemId } });
    await this.recalculateTotal(orderId);

    return { message: 'Item removed' };
  }

  async assign(id: string, adminProfileId: string, userId: string) {
    await this.findOne(id, userId, 'ADMIN');

    return this.prisma.branchOrder.update({
      where: { id },
      data: { adminProfileId },
      include: this.include,
    });
  }

  private async recalculateTotal(orderId: string) {
    const items = await this.prisma.branchOrderItem.findMany({
      where: { branchOrderId: orderId },
    });

    const totalAmount = items.reduce((sum, item) => sum + Number(item.subtotal), 0);

    await this.prisma.branchOrder.update({
      where: { id: orderId },
      data: { totalAmount },
    });
  }
}
