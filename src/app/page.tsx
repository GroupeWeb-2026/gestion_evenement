import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { EventCard, type EventCardData } from "@/components/EventCard";
import { Filters } from "@/components/Filters";
import { FeatureBar } from "@/components/FeatureBar";
import { Footer } from "@/components/Footer";
import { prisma } from "@/lib/prisma";

const FALLBACK: EventCardData[] = [
  {
    id: "1",
    title: "Conférence Tech & Innovation",
    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
    location: "Ivandry",
    city: "Antananarivo",
    dateLabel: "12 MAI 2026",
    category: "Conférence",
    categoryColor: "#7c3aed",
    price: 50000,
  },
  {
    id: "2",
    title: "Concert Live - Ny Hira",
    imageUrl: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800",
    location: "Stade Barea",
    city: "Antananarivo",
    dateLabel: "20 JUIN 2026",
    category: "Concert",
    categoryColor: "#ef4444",
    price: 60000,
  },
  {
    id: "3",
    title: "Workshop Développement Web",
    imageUrl: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=800",
    location: "Antanimena",
    city: "Antananarivo",
    dateLabel: "05 JUIL. 2026",
    category: "Atelier",
    categoryColor: "#10b981",
    price: 30000,
  },
  {
    id: "4",
    title: "Festival Gastronomique",
    imageUrl: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800",
    location: "Tana Waterfront",
    city: "Antananarivo",
    dateLabel: "16 AOÛT 2026",
    category: "Festival",
    categoryColor: "#f59e0b",
    price: 25000,
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  Conférence: "#7c3aed",
  Concert: "#ef4444",
  Atelier: "#10b981",
  Festival: "#f59e0b",
};

async function getEvents(): Promise<EventCardData[]> {
  try {
    const events = await prisma.event.findMany({
      take: 8,
      orderBy: { date: "asc" },
      include: { category: true },
    });
    if (!events.length) return FALLBACK;
    return events.map((e) => ({
      id: e.id,
      title: e.title,
      imageUrl: e.imageUrl ?? "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
      location: e.location,
      city: e.city,
      dateLabel: new Date(e.date)
        .toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })
        .toUpperCase(),
      category: e.category.name,
      categoryColor: CATEGORY_COLORS[e.category.name] ?? "#7c3aed",
      price: e.price,
    }));
  } catch {
    return FALLBACK;
  }
}

export default async function HomePage() {
  const events = await getEvents();
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />

      <main className="mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
          <section>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Événements recommandés</h2>
              <Link href="/events" className="text-sm font-medium text-brand-600 hover:underline">
                Voir tout
              </Link>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {events.slice(0, 4).map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
            </div>
          </section>

          <Filters />
        </div>
      </main>

      <FeatureBar />
      <Footer />
    </div>
  );
}
