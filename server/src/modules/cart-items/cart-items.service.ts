import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateCartItemDto } from './dto/create-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartItemsService {
  constructor(private readonly prisma: PrismaService) {}

  private include = {
    inventory: true,
    branchProfile: true,
  };

  private async resolveBranchProfileId(userId: string) {
    const branch = await this.prisma.branchProfile.findUnique({
      where: { userId },
    });
    if (!branch) {
      throw new NotFoundException('Branch profile not found');
    }
    return branch.id;
  }

  async create(dto: CreateCartItemDto, userId: string) {
    const branchProfileId = await this.resolveBranchProfileId(userId);
    return this.prisma.cartItem.create({
      data: {
        branchProfileId,
        inventoryId: dto.inventoryId,
        quantity: dto.quantity,
        status: dto.status,
      },
      include: this.include,
    });
  }

  async findAll(userId: string) {
    const branchProfileId = await this.resolveBranchProfileId(userId);
    return this.prisma.cartItem.findMany({
      where: { branchProfileId },
      orderBy: { createdAt: 'desc' },
      include: this.include,
    });
  }

  async findOne(id: string, userId: string) {
    const branchProfileId = await this.resolveBranchProfileId(userId);
    const item = await this.prisma.cartItem.findFirst({
      where: { id, branchProfileId },
      include: this.include,
    });

    if (!item) {
      throw new NotFoundException('Cart item not found');
    }

    return item;
  }

  async update(id: string, userId: string, dto: UpdateCartItemDto) {
    await this.findOne(id, userId);

    const data: any = {};
    if (dto.inventoryId !== undefined) data.inventoryId = dto.inventoryId;
    if (dto.quantity !== undefined) data.quantity = dto.quantity;
    if (dto.status !== undefined) data.status = dto.status;

    return this.prisma.cartItem.update({
      where: { id },
      data,
      include: this.include,
    });
  }

  async remove(id: string, userId: string) {
    const branchProfileId = await this.resolveBranchProfileId(userId);
    await this.findOne(id, userId);
    return this.prisma.cartItem.delete({ where: { id } });
  }

  async clearCart(userId: string) {
    const branchProfileId = await this.resolveBranchProfileId(userId);
    return this.prisma.cartItem.deleteMany({
      where: { branchProfileId },
    });
  }
}
