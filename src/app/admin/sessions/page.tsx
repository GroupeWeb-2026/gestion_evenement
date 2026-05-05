"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

interface Session {
  id: string;
  title: string;
  startTime: string;
  event: { title: string };
  room: { name: string };
}

export default function AdminSessionsPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    const res = await fetch("/api/admin/sessions");
    if (res.ok) {
      const data = await res.json();
      setSessions(data);
    }
    setLoading(false);
  };

  const deleteSession = async (id: string) => {
    if (!confirm("Supprimer cette session ?")) return;
    const res = await fetch(`/api/admin/sessions/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Session supprimée");
      fetchSessions();
      router.refresh();
    } else {
      toast.error("Erreur lors de la suppression");
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-50 p-8">Chargement...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Gestion des sessions</h1>
          <Link href="/admin/sessions/new" className="btn bg-brand-600 text-white">
            <Plus className="h-4 w-4" /> Nouvelle session
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4">Titre</th>
                <th className="text-left p-4">Événement</th>
                <th className="text-left p-4">Salle</th>
                <th className="text-left p-4">Date</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sessions.map((session) => (
                <tr key={session.id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">{session.title}</td>
                  <td className="p-4 text-gray-600">{session.event?.title || "-"}</td>
                  <td className="p-4 text-gray-600">{session.room?.name || "-"}</td>
                  <td className="p-4 text-gray-600">
                    {new Date(session.startTime).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="p-4">
                    <button onClick={() => deleteSession(session.id)} className="text-red-600 hover:text-red-800">
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