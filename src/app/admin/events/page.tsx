"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

interface Event {
  id: string;
  title: string;
  dateStart: string;
  sessions: any[];
}

export default function AdminEventsPage() {
  const router = useRouter();
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const res = await fetch("/api/admin/events");
    if (res.ok) {
      const data = await res.json();
      setEvents(data);
    }
    setLoading(false);
  };

  const deleteEvent = async (id: string) => {
    if (!confirm("Supprimer cet événement ?")) return;
    const res = await fetch(`/api/admin/events/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Événement supprimé");
      fetchEvents();
      router.refresh();
    } else {
      toast.error("Erreur lors de la suppression");
    }
  };

  if (loading) return <div className="p-8">Chargement...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Gestion des événements</h1>
          <Link href="/admin/events/new" className="btn bg-brand-600 text-white">
            <Plus className="h-4 w-4" /> Nouvel événement
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4">Titre</th>
                <th className="text-left p-4">Dates</th>
                <th className="text-left p-4">Sessions</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id} className="border-b">
                  <td className="p-4">{event.title}</td>
                  <td className="p-4">{new Date(event.dateStart).toLocaleDateString("fr-FR")}</td>
                  <td className="p-4">{event.sessions?.length || 0}</td>
                  <td className="p-4">
                    <button onClick={() => deleteEvent(event.id)} className="text-red-600">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}