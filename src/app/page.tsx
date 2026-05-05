import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { EventCard } from "@/components/EventCard";
import { Filters } from "@/components/Filters";
import { FeatureBar } from "@/components/FeatureBar";
import { Footer } from "@/components/Footer";
import { prisma } from "@/lib/prisma";

export type EventCardData = {
  id: string;
  title: string;
  imageUrl: string;
  location: string;
  city: string;
  dateLabel: string;
  category: string;
  categoryColor?: string;
  initialLiked?: boolean;
};

const CATEGORY_COLORS: Record<string, string> = {
  Conférence: "#7c3aed",
  Concert: "#ef4444",
  Atelier: "#10b981",
  Festival: "#f59e0b",
};

async function getEvents(): Promise<EventCardData[]> {
  try {
    const events = await prisma.event.findMany({
      take: 4,
      orderBy: { dateStart: "asc" },
    });
    if (!events.length) return [];
    return events.map((e) => ({
      id: e.id,
      title: e.title,
      imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
      location: "Ivandry",
      city: "Antananarivo",
      dateLabel: new Date(e.dateStart)
        .toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })
        .toUpperCase(),
      category: "Conférence",
      categoryColor: CATEGORY_COLORS["Conférence"] ?? "#7c3aed",
    }));
  } catch (error) {
    console.error("Erreur getEvents:", error);
    return [];
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
              {events.map((e) => (
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