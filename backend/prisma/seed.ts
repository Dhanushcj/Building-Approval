import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Setup User
  const passwordHash = await bcrypt.hash('password123', 10);
  
  const admin = await prisma.user.upsert({
    where: { phone: '1234567890' },
    update: {},
    create: {
      name: 'Admin User',
      phone: '1234567890',
      email: 'admin@example.com',
      role: 'ADMIN',
      password_hash: passwordHash,
    },
  });

  const staff = await prisma.user.upsert({
    where: { phone: '0987654321' },
    update: {},
    create: {
      name: 'Staff User',
      phone: '0987654321',
      email: 'staff@example.com',
      role: 'STAFF',
      password_hash: passwordHash,
    },
  });

  // Setup Checklist Templates for BUILDING_PLAN_APPROVAL
  await prisma.checklistTemplate.upsert({
    where: {
      approval_type_jurisdiction: {
        approval_type: 'BUILDING_PLAN_APPROVAL',
        jurisdiction: 'DTCP',
      },
    },
    update: {},
    create: {
      approval_type: 'BUILDING_PLAN_APPROVAL',
      jurisdiction: 'DTCP',
      required_document_types: ['SALE_DEED', 'SITE_PLAN', 'BUILDING_PLAN', 'EC'],
    },
  });

  await prisma.checklistTemplate.upsert({
    where: {
      approval_type_jurisdiction: {
        approval_type: 'BUILDING_PLAN_APPROVAL',
        jurisdiction: 'TOWN_PANCHAYAT',
      },
    },
    update: {},
    create: {
      approval_type: 'BUILDING_PLAN_APPROVAL',
      jurisdiction: 'TOWN_PANCHAYAT',
      required_document_types: ['SALE_DEED', 'TAX_RECEIPT', 'NOC_FIRE'],
    },
  });

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
