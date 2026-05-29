import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const categories = ['Work', 'Personal', 'Shopping', 'Health', 'Other'];

  for (const name of categories) {
    await prisma.category.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  console.log('Seeded categories:', categories);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
