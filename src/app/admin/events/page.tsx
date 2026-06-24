import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Trash2, Plus } from "lucide-react";

async function deleteEvent(id: string) {
  "use server";
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return;
  await prisma.event.delete({ where: { id } });
  redirect("/admin/events");
}

// Fonction pour déterminer le statut d'un événement en fonction de ses sessions
function getEventStatus(sessions: { startTime: Date; endTime: Date }[]): { label: string; color: string } {
  const now = new Date();
  
  // Si aucune session
  if (sessions.length === 0) {
    return { label: "Aucune session", color: "bg-gray-400 text-white"};
  }
  
  // Vérifier s'il y a au moins une session en cours (LIVE)
  const hasLive = sessions.some(session => now >= session.startTime && now <= session.endTime);
  if (hasLive) {
    return { label: "LIVE", color: "bg-red-500 text-white"};
  }
  
  // Vérifier s'il y a des sessions à venir (pas encore commencées)
  const hasUpcoming = sessions.some(session => now < session.startTime);
  if (hasUpcoming) {
    return { label: "En cours", color: "bg-blue-500 text-white"};
  }
  
  // Sinon, toutes les sessions sont terminées
  return { label: "Terminé", color: "bg-gray-400 text-white"};
}

// Fonction pour formater la date
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
    include: { 
      sessions: {
        select: {
          startTime: true,
          endTime: true,
        }
      } 
    },
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
            <table className="w-full min-w-[900px]">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="text-left p-4 font-medium text-gray-600">Titre</th>
                  <th className="text-left p-4 font-medium text-gray-600">Date de début</th>
                  <th className="text-left p-4 font-medium text-gray-600">Date de fin</th>
                  <th className="text-left p-4 font-medium text-gray-600">Sessions</th>
                  <th className="text-left p-4 font-medium text-gray-600">Statut</th>
                  <th className="text-left p-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.map((event) => {
                  const status = getEventStatus(event.sessions);
                  return (
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
                        <span className={`${status.color} text-xs px-2 py-1 rounded-full inline-flex items-center gap-1 ${status.label === "LIVE" ? "animate-pulse" : ""}`}>
                          <span>{status.icon}</span> {status.label}
                        </span>
                      </td>
                      <td className="p-4">
                        <form action={deleteEvent.bind(null, event.id)}>
                          <button type="submit" className="text-red-600 hover:text-red-800">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </form>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {events.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Aucun événement pour le moment. Créez-en un !
          </div>
        )}
      </main>
    </div>
  );
}