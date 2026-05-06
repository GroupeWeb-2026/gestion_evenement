import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Calendar, Users, DoorOpen, Mic, Plus } from "lucide-react";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") redirect("/login");

  // Compte uniquement les événements
  const eventsCount = await prisma.event.count();
  
  // Compte toutes les sessions
  const sessionsCount = await prisma.session.count();
  
  // Compte uniquement les speakers actifs (non retirés)
  const speakersCount = await prisma.speaker.count({
    where: { isDeleted: false }
  });
  
  // Compter uniquement les salles actives (non supprimées)
  const roomsCount = await prisma.room.count({
    where: { isDeleted: false }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Administration EventSync</h1>
          <div className="text-sm text-gray-500">Connecté en tant qu'admin</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Événements</p>
                <p className="text-2xl font-bold text-gray-900">{eventsCount}</p>
              </div>
              <Calendar className="h-8 w-8 text-brand-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Sessions</p>
                <p className="text-2xl font-bold text-gray-900">{sessionsCount}</p>
              </div>
              <Users className="h-8 w-8 text-brand-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Speakers</p>
                <p className="text-2xl font-bold text-gray-900">{speakersCount}</p>
                <p className="text-xs text-gray-400">Actifs uniquement</p>
              </div>
              <Mic className="h-8 w-8 text-brand-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Salles</p>
                <p className="text-2xl font-bold text-gray-900">{roomsCount}</p>
                <p className="text-xs text-gray-400">Actives uniquement</p>
              </div>
              <DoorOpen className="h-8 w-8 text-brand-500" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Gestion des événements</h2>
            <Link href="/admin/events/new" className="btn btn-sm bg-brand-600 text-white mb-3 inline-flex items-center gap-1">
              <Plus className="h-4 w-4" /> Créer un événement
            </Link>
            <Link href="/admin/events" className="block text-brand-600 hover:underline mt-2">
              Gérer les événements existants →
            </Link>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Gestion des sessions</h2>
            <Link href="/admin/sessions/new" className="btn btn-sm bg-brand-600 text-white mb-3 inline-flex items-center gap-1">
              <Plus className="h-4 w-4" /> Créer une session
            </Link>
            <Link href="/admin/sessions" className="block text-brand-600 hover:underline mt-2">
              Gérer les sessions existantes →
            </Link>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Gestion des speakers</h2>
            <Link href="/admin/speakers/new" className="btn btn-sm bg-brand-600 text-white mb-3 inline-flex items-center gap-1">
              <Plus className="h-4 w-4" /> Créer un speaker
            </Link>
            <Link href="/admin/speakers" className="block text-brand-600 hover:underline mt-2">
              Gérer les speakers existants →
            </Link>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-lg font-semibold mb-4">Gestion des salles</h2>
            <Link href="/admin/rooms/new" className="btn btn-sm bg-brand-600 text-white mb-3 inline-flex items-center gap-1">
              <Plus className="h-4 w-4" /> Créer une salle
            </Link>
            <Link href="/admin/rooms" className="block text-brand-600 hover:underline mt-2">
              Gérer les salles existantes →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}