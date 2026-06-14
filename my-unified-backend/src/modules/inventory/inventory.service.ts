import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { UpdateInventoryDto } from './dto/update-inventory.dto';

@Injectable()
export class InventoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateInventoryDto) {
    const data: any = {
      productName: dto.productName,
      unit: dto.unit,
      costPrice: dto.costPrice,
      sellingPrice: dto.sellingPrice,
      stockLevel: dto.stockLevel,
      reorderPoint: dto.reorderPoint,
    };

    if (dto.categoryId) data.categoryId = dto.categoryId;
    if (dto.subcategoryId) data.subcategoryId = dto.subcategoryId;
    if (dto.expiryDate) data.expiryDate = new Date(dto.expiryDate);
    if (dto.imageUrl !== undefined) data.imageUrl = dto.imageUrl;

    return this.prisma.inventory.create({
      data,
      include: { category: true, subcategory: true },
    });
  }

  async findAll() {
    return this.prisma.inventory.findMany({
      orderBy: { createdAt: 'desc' },
      include: { category: true, subcategory: true },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.inventory.findUnique({
      where: { id },
      include: { category: true, subcategory: true },
    });

    if (!item) {
      throw new NotFoundException('Inventory item not found');
    }

    return item;
  }

  async update(id: string, dto: UpdateInventoryDto) {
    await this.findOne(id);

    const data: any = {};
    if (dto.productName !== undefined) data.productName = dto.productName;
    if (dto.unit !== undefined) data.unit = dto.unit;
    if (dto.costPrice !== undefined) data.costPrice = dto.costPrice;
    if (dto.sellingPrice !== undefined) data.sellingPrice = dto.sellingPrice;
    if (dto.stockLevel !== undefined) data.stockLevel = dto.stockLevel;
    if (dto.reorderPoint !== undefined) data.reorderPoint = dto.reorderPoint;
    if (dto.categoryId !== undefined) data.categoryId = dto.categoryId;
    if (dto.subcategoryId !== undefined) data.subcategoryId = dto.subcategoryId;
    if (dto.expiryDate !== undefined) data.expiryDate = dto.expiryDate ? new Date(dto.expiryDate) : null;
    if (dto.imageUrl !== undefined) data.imageUrl = dto.imageUrl;

    return this.prisma.inventory.update({
      where: { id },
      data,
      include: { category: true, subcategory: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.inventory.delete({ where: { id } });
  }
}
