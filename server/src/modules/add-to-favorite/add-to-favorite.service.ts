import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateAddToFavoriteDto } from './dto/create-add-to-favorite.dto';

@Injectable()
export class AddToFavoriteService {
  constructor(private readonly prisma: PrismaService) {}

  private include = {
    inventory: {
      include: {
        category: true,
        subcategory: true,
      },
    },
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

  async create(dto: CreateAddToFavoriteDto, userId: string) {
    const branchProfileId = await this.resolveBranchProfileId(userId);

    const existing = await this.prisma.favorite.findUnique({
      where: {
        branchProfileId_inventoryId: {
          branchProfileId,
          inventoryId: dto.inventoryId,
        },
      },
    });

    if (existing) {
      throw new ConflictException('Item is already in favorites');
    }

    return this.prisma.favorite.create({
      data: {
        branchProfileId,
        inventoryId: dto.inventoryId,
      },
      include: this.include,
    });
  }

  async findAll(userId: string) {
    const branchProfileId = await this.resolveBranchProfileId(userId);
    return this.prisma.favorite.findMany({
      where: { branchProfileId },
      orderBy: { createdAt: 'desc' },
      include: this.include,
    });
  }

  async findOne(id: string, userId: string) {
    const branchProfileId = await this.resolveBranchProfileId(userId);
    const item = await this.prisma.favorite.findFirst({
      where: { id, branchProfileId },
      include: this.include,
    });

    if (!item) {
      throw new NotFoundException('Favorite item not found');
    }

    return item;
  }

  async remove(id: string, userId: string) {
    const branchProfileId = await this.resolveBranchProfileId(userId);
    const item = await this.prisma.favorite.findFirst({
      where: { id, branchProfileId },
    });

    if (!item) {
      throw new NotFoundException('Favorite item not found');
    }

    return this.prisma.favorite.delete({ where: { id } });
  }

  async removeByInventory(inventoryId: string, userId: string) {
    const branchProfileId = await this.resolveBranchProfileId(userId);
    const item = await this.prisma.favorite.findUnique({
      where: {
        branchProfileId_inventoryId: {
          branchProfileId,
          inventoryId,
        },
      },
    });

    if (!item) {
      throw new NotFoundException('Favorite item not found');
    }

    return this.prisma.favorite.delete({ where: { id: item.id } });
  }
}
