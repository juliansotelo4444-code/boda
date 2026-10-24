import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando carga de datos iniciales (Seed) para Julián & Yanet...');

  // 1. Admin User
  const passwordHash = await bcrypt.hash('admin123', 10);
  await prisma.adminUser.upsert({
    where: { email: 'admin@boda.com' },
    update: {},
    create: {
      email: 'admin@boda.com',
      passwordHash,
      name: 'Julián & Yanet',
      role: 'ADMIN',
    },
  });

  // 2. Configuración Maestra de la Boda
  await prisma.weddingSettings.upsert({
    where: { id: 'singleton' },
    update: {
      groomName: 'Julián',
      brideName: 'Yanet',
      weddingDate: new Date('2027-10-09T18:00:00.000Z'),
      venueName: 'Palacio San Souci / Jardines de la Reina',
      venueAddress: 'Av. Libertador 2450, San Fernando, Buenos Aires',
      primaryColor: '#67001A', // Burgundy
      secondaryColor: '#D4AF37', // Champagne Gold
      totalBudget: 25000.0,
      currency: 'USD',
    },
    create: {
      id: 'singleton',
      groomName: 'Julián',
      brideName: 'Yanet',
      weddingDate: new Date('2027-10-09T18:00:00.000Z'),
      venueName: 'Palacio San Souci / Jardines de la Reina',
      venueAddress: 'Av. Libertador 2450, San Fernando, Buenos Aires',
      primaryColor: '#67001A',
      secondaryColor: '#D4AF37',
      totalBudget: 25000.0,
      currency: 'USD',
      heroTitle: 'Julián & Yanet',
      heroSubtitle: 'Nos Casamos — 9 de Octubre de 2027',
      welcomeText: 'Estamos muy emocionados de compartir el día más especial de nuestras vidas junto a ustedes.',
    },
  });

  // 3. Mesas Iniciales
  const mesaNovios = await prisma.table.upsert({
    where: { number: 0 },
    update: {},
    create: {
      number: 0,
      name: 'Mesa Nupcial (Julián & Yanet)',
      capacity: 2,
      shape: 'presidential',
      color: '#67001A',
      posX: 380,
      posY: 50,
    },
  });

  await prisma.table.upsert({
    where: { number: 1 },
    update: {},
    create: {
      number: 1,
      name: 'Familia Novio',
      capacity: 10,
      shape: 'round',
      color: '#800020',
      posX: 200,
      posY: 180,
    },
  });

  await prisma.table.upsert({
    where: { number: 2 },
    update: {},
    create: {
      number: 2,
      name: 'Familia Novia',
      capacity: 10,
      shape: 'round',
      color: '#800020',
      posX: 560,
      posY: 180,
    },
  });

  // 4. Cronograma Inicial (Itinerario del 9 de Octubre 2027)
  const timelineEvents = [
    {
      title: 'Llegada y Bienvenida',
      startTime: '17:30',
      endTime: '18:00',
      location: 'Jardines de Entrada',
      iconName: 'HeartHandshake',
      orderIndex: 0,
      description: 'Recepción de invitados con aperitivos frescos y música ambiental.',
    },
    {
      title: 'Ceremonia Religiosa / Simbólica',
      startTime: '18:00',
      endTime: '19:00',
      location: 'Altar en Jardines Principales',
      iconName: 'Sparkles',
      orderIndex: 1,
      description: 'Ingreso de novios, intercambio de votos y anillos de matrimonio.',
    },
    {
      title: 'Cocktail & Sesión de Fotos',
      startTime: '19:00',
      endTime: '20:30',
      location: 'Terraza San Souci',
      iconName: 'Wine',
      orderIndex: 2,
      description: 'Finger food gourmet, barra de tragos de autor y fotos con invitados.',
    },
    {
      title: 'Ingreso al Salón & Cena',
      startTime: '20:30',
      endTime: '22:30',
      location: 'Salón de los Espejos',
      iconName: 'Utensils',
      orderIndex: 3,
      description: 'Cena principal de 3 pasos con maridaje de vinos y brindis.',
    },
    {
      title: 'Vals de los Novios & Apertura de Pista',
      startTime: '22:30',
      endTime: '23:00',
      location: 'Pista Central',
      iconName: 'Music',
      orderIndex: 4,
      description: 'Primer baile oficial de Julián & Yanet y comienzo de la fiesta.',
    },
    {
      title: 'Fiesta & Barra Libre',
      startTime: '23:00',
      endTime: '05:00',
      location: 'Pista Central & Lounge',
      iconName: 'PartyPopper',
      orderIndex: 5,
      description: 'DJ en vivo, cotillón premium, shows y mesa dulce de madrugada.',
    },
  ];

  for (const event of timelineEvents) {
    const existing = await prisma.timelineEvent.findFirst({ where: { title: event.title } });
    if (!existing) {
      await prisma.timelineEvent.create({ data: event });
    }
  }

  // 5. Nuestra Historia
  const storyMilestones = [
    {
      dateOrYear: 'Febrero 2021',
      title: 'El primer encuentro',
      narrative: 'Una tarde cualquiera que se transformó en el comienzo de la mejor aventura juntos.',
      orderIndex: 0,
      imageUrl: '/assets/couple.jpg',
    },
    {
      dateOrYear: 'Diciembre 2024',
      title: 'La Propuesta',
      narrative: 'Entre risas, miradas cómplices y con el corazón latiendo a mil por hora, dijimos ¡SÍ!',
      orderIndex: 1,
      imageUrl: '/assets/rings.jpg',
    },
    {
      dateOrYear: '9 de Octubre de 2027',
      title: 'Nuestro Gran Día',
      narrative: 'El momento de unir nuestras vidas para siempre rodeados de la gente que más amamos.',
      orderIndex: 2,
      imageUrl: '/assets/toast.jpg',
    },
  ];

  for (const story of storyMilestones) {
    const existing = await prisma.storyMilestone.findFirst({ where: { title: story.title } });
    if (!existing) {
      await prisma.storyMilestone.create({ data: story });
    }
  }

  console.log('✅ Base de datos precargada exitosamente.');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
