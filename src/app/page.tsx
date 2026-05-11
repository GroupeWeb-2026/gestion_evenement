import Link from "next/link";
import { Hero } from "@/components/Hero";
import { EventCard } from "@/components/EventCard";
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
  statusLabel?: string;
  statusColor?: string;
  messageCount?: number;
  likes?: number;
};

const CATEGORY_COLORS: Record<string, string> = {
  Conférence: "#7c3aed",
  Concert: "#ef4444",
  Atelier: "#10b981",
  Festival: "#f59e0b",
};

// Fonction pour déterminer le statut global d'un événement (basé sur toutes ses sessions)
function getGlobalEventStatus(sessions: { startTime: Date; endTime: Date }[]): {
  label: string;
  color: string;
} {
  if (!sessions.length)
    return { label: "À venir", color: "bg-blue-100 text-blue-700" };

  const now = new Date();

  // 1. Y a-t-il une session en cours (LIVE) ?
  const hasLive = sessions.some((s) => now >= s.startTime && now <= s.endTime);
  if (hasLive)
    return { label: "LIVE", color: "bg-red-500 text-white animate-pulse" };

  // 2. Y a-t-il des sessions à venir ?
  const hasUpcoming = sessions.some((s) => now < s.startTime);
  if (hasUpcoming)
    return { label: "En cours", color: "bg-blue-100 text-blue-700" };

  // 3. Toutes les sessions sont terminées
  return { label: "Terminée", color: "bg-gray-100 text-gray-500" };
}

async function getEvents(): Promise<EventCardData[]> {
  try {
    const events = await prisma.event.findMany({
      take: 4,
      orderBy: { dateStart: "asc" },
      include: {
        sessions: {
          include: {
            questions: true,
            speakers: {
              include: {
                speaker: true,
              },
            },
          },
          orderBy: { startTime: "asc" },
        },
      },
    });
    if (!events.length) return [];

    return events.map((e) => {
      const globalStatus = getGlobalEventStatus(e.sessions);
      const allSpeakers = new Map();
      e.sessions.forEach((session) => {
        session.speakers.forEach(({ speaker }) => {
          if (!allSpeakers.has(speaker.id)) {
            allSpeakers.set(speaker.id, {
              id: speaker.id,
              fullName: speaker.fullName,
              photo: speaker.photo,
            });
          }
        });
      });

      // Formatage de la plage de dates
      const startDate = new Date(e.dateStart);
      const endDate = new Date(e.dateEnd);
      const dateRange = `${startDate.toLocaleDateString("fr-FR")} - ${endDate.toLocaleDateString("fr-FR")}`;

      return {
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
        dateRange: dateRange,
        category: "Conférence",
        categoryColor: CATEGORY_COLORS["Conférence"] ?? "#7c3aed",
        statusLabel: globalStatus.label,
        statusColor: globalStatus.color,
        messageCount: e.sessions.reduce(
          (total, session) => total + session.questions.length,
          0,
        ),
        likes: e.likes,
        speakers: Array.from(allSpeakers.values()),
      };
    });
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
        <section className="w-full">
          <div className="flex items-center justify-between w-full">
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

          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:gap-8">
            {events.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
            {isAdmin && <CreateEventCard />}
          </div>
        </section>
      </main>

      <FeatureBar />
    </div>
  );
}
