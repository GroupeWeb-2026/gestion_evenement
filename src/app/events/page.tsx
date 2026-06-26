import { prisma } from "@/lib/prisma";
import { EventCard } from "@/components/EventCard";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

async function getAllEvents(search?: string) {
  const events = await prisma.event.findMany({
    where: search ? {
      title: {
        contains: search,
        mode: "insensitive",
      },
    } : {},
    orderBy: { dateStart: "asc" },
  });
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
    categoryColor: "#7c3aed",
  }));
}

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const { search } = await searchParams;
  const events = await getAllEvents(search);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {search ? `Résultats pour "${search}"` : "Tous les événements"}
          </h1>
          <p className="text-sm text-gray-500">{events.length} événement(s)</p>
        </div>
        {events.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500">Aucun événement trouvé pour "{search}"</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {events.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}