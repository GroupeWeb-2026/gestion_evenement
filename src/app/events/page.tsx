import Link from "next/link";
import { EventCard } from "@/components/EventCard";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Plus, Calendar } from "lucide-react";

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
  startTime?: Date;
  endTime?: Date;
  messageCount?: number;
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
      orderBy: { dateStart: "asc" },
      include: {
        sessions: {
          include: {
            questions: true,
          },
          take: 1,
          orderBy: { startTime: "asc" },
        },
      },
    });
    if (!events.length) return [];
    return events.map((e) => ({
      id: e.id,
      title: e.title,
      imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
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
      startTime: e.sessions[0]?.startTime,
      endTime: e.sessions[0]?.endTime,
      messageCount: e.sessions[0]?.questions.length || 0,
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

export default async function EventsPage() {
  const events = await getEvents();
  const session = await getServerSession(authOptions);
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6">
          <Calendar className="h-8 w-8 text-brand-600" />
          <h1 className="text-2xl font-bold text-gray-900">Tous les événements</h1>
        </div>
        
        <p className="text-gray-600 mb-8">
          Découvrez tous les événements disponibles et participez en direct
        </p>

        {events.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Aucun événement disponible</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:gap-8">
          {events.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
          {isAdmin && <CreateEventCard />}
        </div>
      </main>
    </div>
  );
}