import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Calendar, Users } from "lucide-react";

export default async function HomePage() {
  const events = await prisma.event.findMany({
    include: { sessions: true },
    orderBy: { dateStart: "asc" },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">EventSync</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Plateforme de gestion d'événements et questions en direct</p>
        </div>

        {events.length === 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800 text-center">
            Aucun événement trouvé. Exécutez <code className="bg-yellow-100 px-2 py-1 rounded">npx prisma db seed</code>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Link key={event.id} href={`/events/${event.id}`}>
              <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-5 border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">{event.title}</h2>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{event.description}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(event.dateStart).toLocaleDateString("fr-FR")} - {new Date(event.dateEnd).toLocaleDateString("fr-FR")}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Users className="h-4 w-4" />
                  <span>{event.sessions.length} sessions</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}