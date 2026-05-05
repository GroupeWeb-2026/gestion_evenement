"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2, Plus, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface Speaker {
  id: string;
  fullName: string;
  bio: string | null;
  isDeleted: boolean;
  sessions: any[];
}

export default function AdminSpeakersPage() {
  const router = useRouter();
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSpeakers();
  }, []);

  const fetchSpeakers = async () => {
    const res = await fetch("/api/admin/speakers?all=true");
    if (res.ok) {
      const data = await res.json();
      setSpeakers(data);
    }
    setLoading(false);
  };

  const deleteSpeaker = async (id: string) => {
    if (!confirm("Retirer ce speaker ? (les sessions existantes garderont son nom)")) return;
    const res = await fetch(`/api/admin/speakers/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Speaker retiré");
      fetchSpeakers();
      router.refresh();
    } else {
      toast.error("Erreur lors du retrait");
    }
  };

  const restoreSpeaker = async (id: string) => {
    if (!confirm("Restaurer ce speaker ? Il réapparaîtra dans les options des sessions")) return;
    const res = await fetch(`/api/admin/speakers/${id}`, { method: "PUT" });
    if (res.ok) {
      toast.success("Speaker restauré");
      fetchSpeakers();
      router.refresh();
    } else {
      toast.error("Erreur lors de la restauration");
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-50 p-8">Chargement...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Gestion des speakers</h1>
          <Link href="/admin/speakers/new" className="btn bg-brand-600 text-white">
            <Plus className="h-4 w-4" /> Nouveau speaker
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4">Nom</th>
                <th className="text-left p-4">Bio</th>
                <th className="text-left p-4">Sessions</th>
                <th className="text-left p-4">Statut</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {speakers.map((speaker) => (
                <tr key={speaker.id} className={`border-b hover:bg-gray-50 ${speaker.isDeleted ? "opacity-70 bg-gray-100" : ""}`}>
                  <td className="p-4 font-medium">{speaker.fullName}</td>
                  <td className="p-4 text-sm text-gray-600 max-w-md truncate">{speaker.bio || "-"}</td>
                  <td className="p-4 text-gray-600">{speaker.sessions?.length || 0}</td>
                  <td className="p-4">
                    {speaker.isDeleted ? (
                      <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded">Retiré</span>
                    ) : (
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">Actif</span>
                    )}
                  </td>
                  <td className="p-4">
                    {speaker.isDeleted ? (
                      <button onClick={() => restoreSpeaker(speaker.id)} className="text-blue-600 hover:text-blue-800" title="Restaurer">
                        <RotateCcw className="h-4 w-4" />
                      </button>
                    ) : (
                      <button onClick={() => deleteSpeaker(speaker.id)} className="text-red-600 hover:text-red-800" title="Retirer">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    )}
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