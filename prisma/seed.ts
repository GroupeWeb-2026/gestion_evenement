import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Création des catégories
  const categories = [
    { name: "Conférence", slug: "conference" },
    { name: "Concert", slug: "concert" },
    { name: "Atelier", slug: "atelier" },
    { name: "Festival", slug: "festival" },
  ];

  for (const c of categories) {
    await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    });
  }

  // Création de l'organisateur
  const password = await bcrypt.hash("password123", 10);
  const organizer = await prisma.user.upsert({
    where: { email: "organizer@eventhub.mg" },
    update: {},
    create: {
      email: "organizer@eventhub.mg",
      name: "Organisateur Demo",
      password,
      role: "ORGANIZER",
    },
  });

  // Récupération des catégories
  const conf = await prisma.category.findUnique({ where: { slug: "conference" } });
  const concert = await prisma.category.findUnique({ where: { slug: "concert" } });
  const atelier = await prisma.category.findUnique({ where: { slug: "atelier" } });
  const festival = await prisma.category.findUnique({ where: { slug: "festival" } });

  // Création des événements
  const events = [
    {
      title: "Conférence Tech & Innovation",
      description: "Une journée dédiée aux dernières innovations technologiques.",
      imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
      location: "Ivandry",
      city: "Antananarivo",
      date: new Date("2026-05-12T09:00:00Z"),
      price: 50000,
      capacity: 200,
      categoryId: conf!.id,
      organizerId: organizer.id,
    },
    {
      title: "Concert Live - Ny Hira",
      description: "Soirée musicale exceptionnelle avec les meilleurs artistes.",
      imageUrl: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800",
      location: "Stade Barea",
      city: "Antananarivo",
      date: new Date("2026-06-20T19:00:00Z"),
      price: 60000,
      capacity: 5000,
      categoryId: concert!.id,
      organizerId: organizer.id,
    },
    {
      title: "Workshop Développement Web",
      description: "Apprenez à construire des apps modernes avec Next.js.",
      imageUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800",
      location: "Antanimena",
      city: "Antananarivo",
      date: new Date("2026-07-05T10:00:00Z"),
      price: 30000,
      capacity: 50,
      categoryId: atelier!.id,
      organizerId: organizer.id,
    },
    {
      title: "Festival Gastronomique",
      description: "Découvrez la richesse culinaire malgache.",
      imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
      location: "Tana Waterfront",
      city: "Antananarivo",
      date: new Date("2026-08-16T11:00:00Z"),
      price: 25000,
      capacity: 1000,
      categoryId: festival!.id,
      organizerId: organizer.id,
    },
  ];

  for (const e of events) {
    await prisma.event.upsert({
      where: { id: e.title }, // petit hack, normalement il faudrait un vrai ID
      update: {},
      create: e,
    });
  }

  console.log("✅ Base de données initialisée avec succès !");
}

main()
  .catch((e) => {
    console.error("❌ Erreur:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });