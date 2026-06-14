import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateSubcategoryDto } from './dto/create-subcategory.dto';
import { UpdateSubcategoryDto } from './dto/update-subcategory.dto';

@Injectable()
export class SubcategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(categoryId: string, dto: CreateSubcategoryDto) {
    const category = await this.prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const existing = await this.prisma.subCategory.findUnique({
      where: { name_categoryId: { name: dto.name, categoryId } },
    });
    if (existing) {
      throw new ConflictException('Subcategory already exists in this category');
    }

    return this.prisma.subCategory.create({
      data: { name: dto.name, categoryId },
    });
  }

  async findAll(categoryId: string) {
    const category = await this.prisma.category.findUnique({ where: { id: categoryId } });
    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return this.prisma.subCategory.findMany({
      where: { categoryId },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(categoryId: string, id: string) {
    const subcategory = await this.prisma.subCategory.findUnique({
      where: { id },
    });

    if (!subcategory || subcategory.categoryId !== categoryId) {
      throw new NotFoundException('Subcategory not found');
    }

    return subcategory;
  }

  async update(categoryId: string, id: string, dto: UpdateSubcategoryDto) {
    await this.findOne(categoryId, id);

    if (dto.name) {
      const existing = await this.prisma.subCategory.findUnique({
        where: { name_categoryId: { name: dto.name, categoryId } },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException('Subcategory name already taken in this category');
      }
    }

    return this.prisma.subCategory.update({
      where: { id },
      data: { name: dto.name },
    });
  }

  async remove(categoryId: string, id: string) {
    await this.findOne(categoryId, id);
    return this.prisma.subCategory.delete({ where: { id } });
  }
}
