"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

interface Event {
  id: string;
  title: string;
}

interface Room {
  id: string;
  name: string;
}

interface Speaker {
  id: string;
  fullName: string;
}

export default function NewSessionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    capacity: "",
    eventId: "",
    roomId: "",
    speakerIds: [] as string[],
  });

  useEffect(() => {
    fetch("/api/admin/events").then(res => res.json()).then(setEvents);
    fetch("/api/admin/rooms").then(res => res.json()).then(setRooms);
    fetch("/api/admin/speakers").then(res => res.json()).then(setSpeakers);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error();
      toast.success("Session créée avec succès");
      router.push("/admin/sessions");
    } catch {
      toast.error("Erreur lors de la création");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin/sessions" className="text-brand-600 hover:underline">← Retour</Link>
          <h1 className="text-2xl font-bold text-gray-900">Créer une session</h1>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Titre *</label>
            <input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full p-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full p-2 border rounded-lg" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Début *</label>
              <input type="datetime-local" required value={formData.startTime} onChange={(e) => setFormData({ ...formData, startTime: e.target.value })} className="w-full p-2 border rounded-lg" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fin *</label>
              <input type="datetime-local" required value={formData.endTime} onChange={(e) => setFormData({ ...formData, endTime: e.target.value })} className="w-full p-2 border rounded-lg" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Capacité</label>
            <input type="number" value={formData.capacity} onChange={(e) => setFormData({ ...formData, capacity: e.target.value })} className="w-full p-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Événement *</label>
            <select required value={formData.eventId} onChange={(e) => setFormData({ ...formData, eventId: e.target.value })} className="w-full p-2 border rounded-lg">
              <option value="">Sélectionner</option>
              {events.map(e => <option key={e.id} value={e.id}>{e.title}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Salle *</label>
            <select required value={formData.roomId} onChange={(e) => setFormData({ ...formData, roomId: e.target.value })} className="w-full p-2 border rounded-lg">
              <option value="">Sélectionner</option>
              {rooms.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Intervenants</label>
            <select multiple value={formData.speakerIds} onChange={(e) => setFormData({ ...formData, speakerIds: Array.from(e.target.selectedOptions, o => o.value) })} className="w-full p-2 border rounded-lg">
              {speakers.map(s => <option key={s.id} value={s.id}>{s.fullName}</option>)}
            </select>
          </div>
          <button type="submit" disabled={loading} className="w-full btn bg-brand-600 text-white">
            {loading ? "Création..." : "Créer la session"}
          </button>
        </form>
      </main>
    </div>
  );
}