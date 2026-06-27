import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { EventCard } from "@/components/EventCard";
import { Filters } from "@/components/Filters";
import { FeatureBar } from "@/components/FeatureBar";
import { Footer } from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Plus } from "lucide-react";

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
      imageUrl: e.imageUrl || "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgGRi4OB4Th0FjYm6Xky36a1KNag90YhCiTPjg6FoiROEfhyphenhyphenYtsvsnysQu0e9o4BDtiN9644uukvYrPKB7aa8P-oAM_zZaBrmwv0lGrzbXwIM1DziJO3RibWQBqJZtX0rTblHXB3zWl1Ltz8YR53NzQes6qF1ine-9uO1W64RymzAK8oT5CMW6y4XKlWKLw/s1200/U%20MAGIS%20CHAMPION%202022%20DU%20SMATCHIN.jpg",
      location: e.location || "Non précisé",
      city: e.city || "Non précisé",
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

// Composant Carte "Créer un événement"
function CreateEventCard() {
  return (
    <Link href="/admin/events/new">
      <div className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:shadow-lg cursor-pointer h-full flex flex-col items-center justify-center min-h-[280px]">
        <div className="flex flex-col items-center justify-center gap-3 p-6">
          <div className="rounded-full bg-brand-50 p-4 group-hover:bg-brand-100 transition">
            <Plus className="h-8 w-8 text-brand-600" />
          </div>
          <p className="text-sm font-medium text-gray-600">Créer un événement</p>
          <p className="text-xs text-gray-400 text-center">Ajoutez un nouvel événement</p>
        </div>
      </div>
    </Link>
  );
}

export default async function HomePage() {
  const events = await getEvents();
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "ADMIN";

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
              {/* Afficher la carte "Créer" uniquement si admin connecté */}
              {isAdmin && <CreateEventCard />}
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