import Link from "next/link";
import { Hero } from "@/components/Hero";
import { EventCard } from "@/components/EventCard";
import { Filters } from "@/components/Filters";
import { FeatureBar } from "@/components/FeatureBar";
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
      imageUrl:
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
      location: "Ivandry",
      city: "Antananarivo",
      dateLabel: new Date(e.dateStart)
        .toLocaleDateString("fr-FR", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
        .toUpperCase(),
      category: "Conférence",
      categoryColor: CATEGORY_COLORS["Conférence"] ?? "#7c3aed",
    }));
  } catch (error) {
    console.error("Erreur getEvents:", error);
    return [];
  }
}

function CreateEventCard() {
  return (
    <Link href="/admin/events/new">
      <div className="group overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm shadow-sm ring-1 ring-gray-200 transition hover:shadow-lg cursor-pointer h-full flex flex-col items-center justify-center min-h-[280px] hover:bg-white/90">
        <div className="flex flex-col items-center justify-center gap-3 p-6">
          <div className="rounded-full bg-brand-100 p-4 group-hover:bg-brand-200 transition">
            <Plus className="h-8 w-8 text-brand-600" />
          </div>
          <p className="text-sm font-medium text-gray-700">
            Créer un événement
          </p>
          <p className="text-xs text-gray-500 text-center">
            Ajoutez un nouvel événement
          </p>
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
      <Hero />

      <main className="mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
          <section>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Événements recommandés
              </h2>
              <Link
                href="/events"
                className="text-sm font-medium text-brand-600 hover:text-brand-700 transition-colors inline-flex items-center gap-1 group"
              >
                Voir tout
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {events.map((e) => (
                <EventCard key={e.id} event={e} />
              ))}
              {isAdmin && <CreateEventCard />}
            </div>
          </section>

          <Filters />
        </div>
      </main>

      <FeatureBar />
    </div>
  );
}
