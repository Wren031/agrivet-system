import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

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
