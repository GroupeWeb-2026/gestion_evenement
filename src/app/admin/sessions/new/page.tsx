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
  const [loadingData, setLoadingData] = useState(true);

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
    const fetchData = async () => {
      const [eventsRes, roomsRes, speakersRes] = await Promise.all([
        fetch("/api/admin/events"),
        fetch("/api/admin/rooms"),
        fetch("/api/admin/speakers"),
      ]);
      if (eventsRes.ok) setEvents(await eventsRes.json());
      if (roomsRes.ok) setRooms(await roomsRes.json());
      if (speakersRes.ok) setSpeakers(await speakersRes.json());
      setLoadingData(false);
    };
    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
        capacity: formData.capacity ? parseInt(formData.capacity) : null,
        eventId: formData.eventId,
        roomId: formData.roomId,
        speakerIds: formData.speakerIds,
      };

      const res = await fetch("/api/admin/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error();
      toast.success("Session créée avec succès");
      router.push("/admin/sessions");
      router.refresh();
    } catch {
      toast.error("Erreur lors de la création");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-2xl mx-auto px-4 py-8">
          <p className="text-gray-500">Chargement des données...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/admin/sessions"
            className="text-brand-600 hover:underline"
          >
            ← Retour
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Créer une session
          </h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-sm p-6 space-y-4"
        >
          <div>
            <label className="block text-sm font-medium mb-1">Titre *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Titre de la session"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Description de la session"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Début *</label>
              <input
                type="datetime-local"
                required
                value={formData.startTime}
                onChange={(e) =>
                  setFormData({ ...formData, startTime: e.target.value })
                }
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Fin *</label>
              <input
                type="datetime-local"
                required
                value={formData.endTime}
                onChange={(e) =>
                  setFormData({ ...formData, endTime: e.target.value })
                }
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Capacité</label>
            <input
              type="number"
              value={formData.capacity}
              onChange={(e) =>
                setFormData({ ...formData, capacity: e.target.value })
              }
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              placeholder="Nombre de places"
            />
          </div>

          {/* Événement - sélection unique avec radios (cercles) */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Événement *
            </label>
            <div className="space-y-2 border rounded-lg p-3 max-h-48 overflow-y-auto bg-gray-50">
              {events.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Aucun événement disponible. Créez-en d'abord.
                </p>
              ) : (
                events.map((event) => (
                  <label
                    key={event.id}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors"
                  >
                    <input
                      type="radio"
                      name="eventSelection"
                      checked={formData.eventId === event.id}
                      onChange={() =>
                        setFormData({ ...formData, eventId: event.id })
                      }
                      className="custom-radio-circle"
                    />
                    <span className="text-sm text-gray-700">{event.title}</span>
                  </label>
                ))
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Sélectionnez un événement pour cette session
            </p>
          </div>

          {/* Salles - sélection unique avec radios (cercles) */}
          <div>
            <label className="block text-sm font-medium mb-2">Salle *</label>
            <div className="space-y-2 border rounded-lg p-3 max-h-48 overflow-y-auto bg-gray-50">
              {rooms.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Aucune salle disponible. Créez-en d'abord.
                </p>
              ) : (
                rooms.map((room) => (
                  <label
                    key={room.id}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors"
                  >
                    <input
                      type="radio"
                      name="roomSelection"
                      checked={formData.roomId === room.id}
                      onChange={() =>
                        setFormData({ ...formData, roomId: room.id })
                      }
                      className="custom-radio-circle"
                    />
                    <span className="text-sm text-gray-700">{room.name}</span>
                  </label>
                ))
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Sélectionnez une salle pour cette session
            </p>
          </div>

          {/* Intervenants - sélection multiple avec checkboxes (cercles) */}
          <div>
            <label className="block text-sm font-medium mb-2">
              Intervenants
            </label>
            <div className="space-y-2 border rounded-lg p-3 max-h-48 overflow-y-auto bg-gray-50">
              {speakers.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Aucun intervenant disponible. Créez-en d'abord.
                </p>
              ) : (
                speakers.map((speaker) => (
                  <label
                    key={speaker.id}
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={formData.speakerIds.includes(speaker.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            speakerIds: [...formData.speakerIds, speaker.id],
                          });
                        } else {
                          setFormData({
                            ...formData,
                            speakerIds: formData.speakerIds.filter(
                              (id) => id !== speaker.id,
                            ),
                          });
                        }
                      }}
                      className="custom-checkbox-circle"
                    />
                    <span className="text-sm text-gray-700">
                      {speaker.fullName}
                    </span>
                  </label>
                ))
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Cochez les cercles pour sélectionner plusieurs intervenants
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50 py-3"
          >
            {loading ? "Création en cours..." : "Créer la session"}
          </button>
        </form>
      </main>
    </div>
  );
}
