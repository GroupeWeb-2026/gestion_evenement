import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seed des données EventSync...");

  // 1. Crée l'admin
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@eventsync.com" },
    update: {},
    create: {
      email: "admin@eventsync.com",
      name: "Administrateur",
      password: adminPassword,
      role: "ADMIN",
    },
  });
  console.log("✅ Admin créé");

  // 2. Crée les salles (rooms)
  const rooms = [
    { name: "Grande Salle" },
    { name: "Salle B" },
    { name: "Amphi C" },
  ];

  for (const room of rooms) {
    await prisma.room.upsert({
      where: { name: room.name },
      update: {},
      create: room,
    });
  }
  console.log("✅ Salles créées");

  // 3. Récupère les salles
  const grandeSalle = await prisma.room.findUnique({
    where: { name: "Grande Salle" },
  });
  const salleB = await prisma.room.findUnique({ where: { name: "Salle B" } });
  const amphiC = await prisma.room.findUnique({ where: { name: "Amphi C" } });

  // 4. Crée un événement (likes à 0 par défaut)
  const event = await prisma.event.create({
    data: {
      title: "DevCon 2026 - Madagascar",
      description:
        "La plus grande conférence tech de Madagascar. Deux jours de sessions, workshops et networking.",
      dateStart: new Date("2026-05-15T09:00:00Z"),
      dateEnd: new Date("2026-05-16T18:00:00Z"),
      organizerId: admin.id,
      likes: 0,
    },
  });
  console.log("✅ Événement créé");

  // 5. Crée les speakers
  const speakers = [
    {
      fullName: "Rajaona Andriamanantena",
      photo: "https://randomuser.me/api/portraits/men/1.jpg",
      bio: "Expert Next.js et architecte fullstack. 10 ans d'expérience.",
      externalLinks: "https://linkedin.com/in/rajaona",
    },
    {
      fullName: "Mireille Rasoazanany",
      photo: "https://randomuser.me/api/portraits/women/2.jpg",
      bio: "Spécialiste PostgreSQL et optimisation de bases de données.",
      externalLinks: "https://twitter.com/mireille",
    },
    {
      fullName: "Hery Rakotomalala",
      photo: "https://randomuser.me/api/portraits/men/3.jpg",
      bio: "Leader technique chez TechMada, passionné de Prisma et GraphQL.",
      externalLinks: "https://github.com/heryrak",
    },
  ];

  for (const speaker of speakers) {
    await prisma.speaker.create({
      data: speaker,
    });
  }
  console.log("✅ Speakers créés");

  // 6. Récupère les speakers
  const rajaona = await prisma.speaker.findFirst({
    where: { fullName: "Rajaona Andriamanantena" },
  });
  const mireille = await prisma.speaker.findFirst({
    where: { fullName: "Mireille Rasoazanany" },
  });
  const hery = await prisma.speaker.findFirst({
    where: { fullName: "Hery Rakotomalala" },
  });

  // 7. Crée les sessions
  const now = new Date();
  const liveStart = new Date(now);
  liveStart.setHours(now.getHours() - 1);
  const liveEnd = new Date(now);
  liveEnd.setHours(now.getHours() + 1);

  const sessions = [
    {
      title: "Next.js 15 et Server Components",
      description:
        "Découvrez les nouveautés de Next.js 15 et comment optimiser vos apps.",
      startTime: liveStart,
      endTime: liveEnd,
      capacity: 100,
      eventId: event.id,
      roomId: grandeSalle!.id,
    },
    {
      title: "Prisma ORM - Bonnes pratiques",
      description:
        "Apprenez à modéliser vos données et optimiser vos requêtes.",
      startTime: new Date("2026-05-15T11:00:00Z"),
      endTime: new Date("2026-05-15T12:30:00Z"),
      capacity: 80,
      eventId: event.id,
      roomId: salleB!.id,
    },
    {
      title: "PostgreSQL Advanced",
      description: "Indexing, partitioning et optimisation de requêtes.",
      startTime: new Date("2026-05-15T14:00:00Z"),
      endTime: new Date("2026-05-15T16:00:00Z"),
      capacity: 50,
      eventId: event.id,
      roomId: amphiC!.id,
    },
    {
      title: "Fullstack avec Next.js et Prisma",
      description: "Construisez une app complète de A à Z.",
      startTime: new Date("2026-05-16T10:00:00Z"),
      endTime: new Date("2026-05-16T12:00:00Z"),
      capacity: 120,
      eventId: event.id,
      roomId: grandeSalle!.id,
    },
  ];

  for (const session of sessions) {
    await prisma.session.create({
      data: session,
    });
  }
  console.log("✅ Sessions créées");

  // 8. Associe les speakers aux sessions
  const sessionList = await prisma.session.findMany();

  // Session 1 (Next.js) -> Rajaona + Hery
  await prisma.sessionSpeaker.createMany({
    data: [
      { sessionId: sessionList[0].id, speakerId: rajaona!.id },
      { sessionId: sessionList[0].id, speakerId: hery!.id },
    ],
  });

  // Session 2 (Prisma) -> Mireille + Hery
  await prisma.sessionSpeaker.createMany({
    data: [
      { sessionId: sessionList[1].id, speakerId: mireille!.id },
      { sessionId: sessionList[1].id, speakerId: hery!.id },
    ],
  });

  // Session 3 (PostgreSQL) -> Mireille
  await prisma.sessionSpeaker.create({
    data: { sessionId: sessionList[2].id, speakerId: mireille!.id },
  });

  // Session 4 (Fullstack) -> Rajaona + Hery
  await prisma.sessionSpeaker.createMany({
    data: [
      { sessionId: sessionList[3].id, speakerId: rajaona!.id },
      { sessionId: sessionList[3].id, speakerId: hery!.id },
    ],
  });

  console.log("✅ Speakers associés aux sessions");

  // 9. Ajout des questions de test sur la session LIVE
  await prisma.question.createMany({
    data: [
      {
        content: "Est-ce que Next.js 15 supporte React 19 ?",
        authorName: "Andry",
        upvotes: 5,
        sessionId: sessionList[0].id,
      },
      {
        content:
          "Quelle est la différence entre Server Actions et API Routes ?",
        authorName: null,
        upvotes: 3,
        sessionId: sessionList[0].id,
      },
      {
        content: "Prisma sera-t-il compatible avec Drizzle ?",
        authorName: "Tiana",
        upvotes: 2,
        sessionId: sessionList[0].id,
      },
    ],
  });
  console.log("✅ Questions de test ajoutées");

  console.log("\n✅ Seed terminé avec succès !");
  console.log("📧 Admin: admin@eventsync.com | Mot de passe: admin123");
  console.log("🔴 Une session LIVE est disponible (Next.js 15)");
}

main()
  .catch((e) => {
    console.error("❌ Erreur:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });