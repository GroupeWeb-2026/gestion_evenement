"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Trash2, Plus, RotateCcw } from "lucide-react";
import { toast } from "sonner";

interface Room {
  id: string;
  name: string;
  isDeleted: boolean;
  sessions: any[];
}

export default function AdminRoomsPage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    const res = await fetch("/api/admin/rooms?all=true");
    if (res.ok) {
      const data = await res.json();
      setRooms(data);
    }
    setLoading(false);
  };

  const deleteRoom = async (id: string) => {
    if (!confirm("Supprimer cette salle ?")) return;
    const res = await fetch(`/api/admin/rooms/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Salle supprimée");
      fetchRooms();
      router.refresh();
    } else {
      toast.error("Erreur lors de la suppression");
    }
  };

  const restoreRoom = async (id: string) => {
    const res = await fetch(`/api/admin/rooms/${id}`, { method: "PUT" });
    if (res.ok) {
      toast.success("Salle restaurée");
      fetchRooms();
      router.refresh();
    } else {
      toast.error("Erreur lors de la restauration");
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-50 p-8">Chargement...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Gestion des salles</h1>
          <Link href="/admin/rooms/new" className="btn bg-brand-600 text-white">
            <Plus className="h-4 w-4" /> Nouvelle salle
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left p-4">Nom</th>
                <th className="text-left p-4">Sessions</th>
                <th className="text-left p-4">Statut</th>
                <th className="text-left p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.id} className={`border-b hover:bg-gray-50 ${room.isDeleted ? "opacity-70 bg-gray-100" : ""}`}>
                  <td className="p-4 font-medium">{room.name}</td>
                  <td className="p-4 text-gray-600">{room.sessions?.length || 0}</td>
                  <td className="p-4">
                    {room.isDeleted ? (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">Supprimée</span>
                    ) : (
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded">Active</span>
                    )}
                  </td>
                  <td className="p-4">
                    {room.isDeleted ? (
                      <button onClick={() => restoreRoom(room.id)} className="text-blue-600 hover:text-blue-800" title="Restaurer">
                        <RotateCcw className="h-4 w-4" />
                      </button>
                    ) : (
                      <button onClick={() => deleteRoom(room.id)} className="text-red-600 hover:text-red-800" title="Supprimer">
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