import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Trash2, Plus, Calendar } from "lucide-react";

async function deleteEvent(id: string) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return;
  await prisma.event.delete({ where: { id } });
  redirect("/admin/events");
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default async function AdminEventsPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  const events = await prisma.event.findMany({
    include: { sessions: true },
    orderBy: { dateStart: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Gestion des événements</h1>
          <Link href="/admin/events/new" className="btn bg-brand-600 text-white hover:bg-brand-700">
            <Plus className="h-4 w-4" /> Nouvel événement
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-600">Titre</th>
                  <th className="text-left p-4 font-medium text-gray-600">Date de début</th>
                  <th className="text-left p-4 font-medium text-gray-600">Date de fin</th>
                  <th className="text-left p-4 font-medium text-gray-600">Sessions</th>
                  <th className="text-left p-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => (
                  <tr key={event.id} className="border-b hover:bg-gray-50">
                    <td className="p-4 font-medium text-gray-900">{event.title}</td>
                    <td className="p-4 text-gray-600 whitespace-nowrap">
                      {formatDate(event.dateStart)}
                    </td>
                    <td className="p-4 text-gray-600 whitespace-nowrap">
                      {formatDate(event.dateEnd)}
                    </td>
                    <td className="p-4 text-gray-600">
                      {event.sessions.length}
                    </td>
                    <td className="p-4">
                      <form action={deleteEvent.bind(null, event.id)}>
                        <button type="submit" className="text-red-600 hover:text-red-800">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {events.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center mt-6">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Aucun événement pour le moment. Créez-en un !</p>
          </div>
        )}
      </main>
    </div>
  );
}