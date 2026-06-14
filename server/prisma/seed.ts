import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // ── Categories ──────────────────────────────────────────────
  const categoryNames = [
    'Feeds & Nutrition',
    'Veterinary Drugs & Biologics',
    'Agricultural Inputs',
    'Farm Equipment & Hardware',
    'Poultry',
    'Swine',
    'Aquaculture',
    'Livestock',
  ];

  for (const name of categoryNames) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log('Categories seeded');

  // ── Subcategories ────────────────────────────────────────────
  const subcategoryMap: Record<string, string[]> = {
    'Feeds & Nutrition': ['Poultry Feeds', 'Swine Feeds', 'Fish Feeds', 'Cattle Feeds'],
    'Veterinary Drugs & Biologics': ['Antibiotics', 'Vaccines', 'Dewormers', 'Vitamins'],
    'Agricultural Inputs': ['Fertilizers', 'Pesticides'],
    'Farm Equipment & Hardware': ['Hand Tools', 'Machinery'],
    Poultry: ['Chickens', 'Ducks'],
    Swine: ['Piglets', 'Sows'],
    Aquaculture: ['Fish', 'Shrimp'],
    Livestock: ['Cattle', 'Goats'],
  };

  const allCategories = await prisma.category.findMany();

  for (const category of allCategories) {
    const subs = subcategoryMap[category.name] || [];
    for (const subName of subs) {
      await prisma.subCategory.upsert({
        where: { name_categoryId: { name: subName, categoryId: category.id } },
        update: {},
        create: { name: subName, categoryId: category.id },
      });
    }
  }

  console.log('Subcategories seeded');

  // ── Inventory items ──────────────────────────────────────────
  const allSubcategories = await prisma.subCategory.findMany({
    include: { category: true },
  });

  const findSub = (catName: string, subName: string) =>
    allSubcategories.find((s) => s.category.name === catName && s.name === subName);

  const inventoryItems = [
    {
      id: 'inv-001',
      productName: 'Grower Mash 50kg',
      unit: 'Sack',
      costPrice: 850.0,
      sellingPrice: 950.0,
      stockLevel: 120,
      reorderPoint: 30,
      expiryDate: '2026-12-31',
      imageUrl: 'https://via.placeholder.com/150?text=Grower+Mash',
      sub: findSub('Feeds & Nutrition', 'Poultry Feeds'),
    },
    {
      id: 'inv-002',
      productName: 'Starter Mash 25kg',
      unit: 'Sack',
      costPrice: 550.0,
      sellingPrice: 620.0,
      stockLevel: 80,
      reorderPoint: 20,
      expiryDate: '2026-11-30',
      imageUrl: 'https://via.placeholder.com/150?text=Starter+Mash',
      sub: findSub('Feeds & Nutrition', 'Poultry Feeds'),
    },
    {
      id: 'inv-003',
      productName: 'Swine Finisher 50kg',
      unit: 'Sack',
      costPrice: 900.0,
      sellingPrice: 1020.0,
      stockLevel: 60,
      reorderPoint: 15,
      expiryDate: '2027-01-15',
      imageUrl: 'https://via.placeholder.com/150?text=Swine+Finisher',
      sub: findSub('Feeds & Nutrition', 'Swine Feeds'),
    },
    {
      id: 'inv-004',
      productName: 'Fish Floating Feeds 25kg',
      unit: 'Sack',
      costPrice: 1200.0,
      sellingPrice: 1350.0,
      stockLevel: 40,
      reorderPoint: 10,
      expiryDate: '2026-10-20',
      imageUrl: 'https://via.placeholder.com/150?text=Fish+Feeds',
      sub: findSub('Feeds & Nutrition', 'Fish Feeds'),
    },
    {
      id: 'inv-005',
      productName: 'Amoxicillin 500mg 100s',
      unit: 'Box',
      costPrice: 180.0,
      sellingPrice: 220.0,
      stockLevel: 200,
      reorderPoint: 50,
      expiryDate: '2027-06-01',
      imageUrl: 'https://via.placeholder.com/150?text=Amoxicillin',
      sub: findSub('Veterinary Drugs & Biologics', 'Antibiotics'),
    },
    {
      id: 'inv-006',
      productName: 'Newcastle Disease Vaccine',
      unit: 'Vial',
      costPrice: 350.0,
      sellingPrice: 420.0,
      stockLevel: 150,
      reorderPoint: 40,
      expiryDate: '2026-09-15',
      imageUrl: 'https://via.placeholder.com/150?text=ND+Vaccine',
      sub: findSub('Veterinary Drugs & Biologics', 'Vaccines'),
    },
    {
      id: 'inv-007',
      productName: 'Multivitamin Soluble Powder 100g',
      unit: 'Pouch',
      costPrice: 95.0,
      sellingPrice: 130.0,
      stockLevel: 300,
      reorderPoint: 60,
      expiryDate: '2027-08-20',
      imageUrl: 'https://via.placeholder.com/150?text=Multivitamin',
      sub: findSub('Veterinary Drugs & Biologics', 'Vitamins'),
    },
    {
      id: 'inv-008',
      productName: 'Urea Fertilizer 50kg',
      unit: 'Sack',
      costPrice: 1100.0,
      sellingPrice: 1250.0,
      stockLevel: 50,
      reorderPoint: 10,
      imageUrl: 'https://via.placeholder.com/150?text=Urea',
      sub: findSub('Agricultural Inputs', 'Fertilizers'),
    },
    {
      id: 'inv-009',
      productName: 'Roundup Herbicide 1L',
      unit: 'Bottle',
      costPrice: 280.0,
      sellingPrice: 350.0,
      stockLevel: 90,
      reorderPoint: 20,
      expiryDate: '2027-05-10',
      imageUrl: 'https://via.placeholder.com/150?text=Roundup',
      sub: findSub('Agricultural Inputs', 'Pesticides'),
    },
    {
      id: 'inv-010',
      productName: 'Hoe with Handle',
      unit: 'Piece',
      costPrice: 150.0,
      sellingPrice: 200.0,
      stockLevel: 75,
      reorderPoint: 15,
      imageUrl: 'https://via.placeholder.com/150?text=Hoe',
      sub: findSub('Farm Equipment & Hardware', 'Hand Tools'),
    },
    {
      id: 'inv-011',
      productName: 'Pruning Shears',
      unit: 'Piece',
      costPrice: 210.0,
      sellingPrice: 280.0,
      stockLevel: 45,
      reorderPoint: 10,
      imageUrl: 'https://via.placeholder.com/150?text=Shears',
      sub: findSub('Farm Equipment & Hardware', 'Hand Tools'),
    },
    {
      id: 'inv-012',
      productName: 'Day-old Chicks (Broiler)',
      unit: 'Head',
      costPrice: 25.0,
      sellingPrice: 35.0,
      stockLevel: 500,
      reorderPoint: 100,
      imageUrl: 'https://via.placeholder.com/150?text=Broiler+Chicks',
      sub: findSub('Poultry', 'Chickens'),
    },
    {
      id: 'inv-013',
      productName: 'Weanling Piglets',
      unit: 'Head',
      costPrice: 2500.0,
      sellingPrice: 3200.0,
      stockLevel: 20,
      reorderPoint: 5,
      imageUrl: 'https://via.placeholder.com/150?text=Piglets',
      sub: findSub('Swine', 'Piglets'),
    },
    {
      id: 'inv-014',
      productName: 'Fingerlings (Tilapia)',
      unit: 'Piece',
      costPrice: 3.0,
      sellingPrice: 5.0,
      stockLevel: 2000,
      reorderPoint: 500,
      imageUrl: 'https://via.placeholder.com/150?text=Tilapia',
      sub: findSub('Aquaculture', 'Fish'),
    },
    {
      id: 'inv-015',
      productName: 'Butchered Goat Meat (per kg)',
      unit: 'Kg',
      costPrice: 250.0,
      sellingPrice: 320.0,
      stockLevel: 30,
      reorderPoint: 8,
      imageUrl: 'https://via.placeholder.com/150?text=Goat+Meat',
      sub: findSub('Livestock', 'Goats'),
    },
  ];

  for (const item of inventoryItems) {
    const data: any = {
      productName: item.productName,
      unit: item.unit,
      costPrice: item.costPrice,
      sellingPrice: item.sellingPrice,
      stockLevel: item.stockLevel,
      reorderPoint: item.reorderPoint,
      imageUrl: item.imageUrl || null,
    };

    if (item.expiryDate) data.expiryDate = new Date(item.expiryDate);
    if (item.sub) {
      data.categoryId = item.sub.categoryId;
      data.subcategoryId = item.sub.id;
    }

    await prisma.inventory.upsert({
      where: { id: item.id },
      update: { ...data, id: undefined },
      create: { id: item.id, ...data },
    });
  }

  console.log('Inventory seeded');

  // ── Admin user ───────────────────────────────────────────────
  const adminUser = await prisma.user.upsert({
    where: { id: 'default-admin-id' },
    update: {},
    create: {
      id: 'default-admin-id',
      password: hashedPassword,
      role: Role.ADMIN,
      adminProfile: {
        create: {
          fullName: 'Admin User',
          contactNumber: '09123456789',
          email: 'admin@agrivet.com',
        },
      },
    },
  });

  console.log('Seed data created:', adminUser);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
