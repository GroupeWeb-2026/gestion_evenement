import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Filters } from "@/components/Filters";
import { EventCard } from "@/components/EventCard";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  let events: any[] = [];
  try {
    events = await prisma.event.findMany({ include: { category: true }, orderBy: { date: "asc" } });
  } catch {}

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900">Tous les événements</h1>
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {events.length === 0 && (
              <p className="text-sm text-gray-500">
                Aucun événement. Lancez <code>npx prisma db seed</code>.
              </p>
            )}
            {events.map((e) => (
              <EventCard
                key={e.id}
                event={{
                  id: e.id,
                  title: e.title,
                  imageUrl: e.imageUrl ?? "",
                  location: e.location,
                  city: e.city,
                  dateLabel: new Date(e.date)
                    .toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })
                    .toUpperCase(),
                  category: e.category.name,
                  price: e.price,
                }}
              />
            ))}
          </div>
          <Filters />
        </div>
      </main>
      <Footer />
    </div>
  );
}
