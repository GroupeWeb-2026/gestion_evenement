import { prisma } from "@/lib/prisma";
import { EventCard } from "@/components/EventCard";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

async function getAllEvents() {
  const events = await prisma.event.findMany({
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

export default async function EventsPage() {
  const events = await getAllEvents();

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Tous les événements</h1>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {events.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}