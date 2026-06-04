// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding EMONOSHOTS database...');

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL ?? 'admin@emonoshots.ma' },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL ?? 'admin@emonoshots.ma',
      name:  'Mohamed — EMONOSHOTS',
      role:  'ADMIN',
    },
  });
  console.log('✅ Admin user:', admin.email);

  // Demo client
  const client = await prisma.user.upsert({
    where: { email: 'demo@client.com' },
    update: {},
    create: {
      email: 'demo@client.com',
      name:  'Demo Client',
      role:  'CLIENT',
    },
  });

  // Demo booking
  await prisma.booking.upsert({
    where: { id: 'demo-booking-001' },
    update: {},
    create: {
      id:          'demo-booking-001',
      clientId:    client.id,
      type:        'AUTOMOTIVE',
      title:       'BMW M4 Night Shoot — Casablanca Port',
      description: 'Industrial night shoot with drift sequences. Blue hour + port cranes as backdrop.',
      status:      'CONFIRMED',
      locationName:'Port de Casablanca, Section 7',
      estimatedPrice: 5500,
      currency:    'MAD',
      moodboard: {
        type: 'AUTOMOTIVE',
        mood: 'Cinematic night, industrial, aggressive',
        locations: ['Port de Casablanca Section 7'],
        timeOfDay: 'night',
        estimatedBudget: { min: 5000, max: 6500, currency: 'MAD' },
        duration: 4,
        deliverables: ['30 edited JPEGs', '5 cinematic finals'],
        equipment: ['Sony A7 IV', '85mm f/1.4'],
        references: ['@_emonoshots'],
        notes: 'Wet road preferred.',
      },
    },
  });

  console.log('✅ Demo booking created');
  console.log('🎉 Seeding complete!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
