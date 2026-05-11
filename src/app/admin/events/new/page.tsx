"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";
import { Upload, Plus, Trash2 } from "lucide-react";

interface Speaker {
  id: string;
  fullName: string;
}

interface Room {
  id: string;
  name: string;
}

interface SessionForm {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  capacity: string;
  roomId: string;
  speakerIds: string[];
}

export default function NewEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [speakers, setSpeakers] = useState<Speaker[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dateStart: "",
    dateEnd: "",
    location: "Ivandry",
    city: "Antananarivo",
    imageUrl: "",
  });

  const [sessions, setSessions] = useState<SessionForm[]>([
    {
      title: "",
      description: "",
      startTime: "",
      endTime: "",
      capacity: "",
      roomId: "",
      speakerIds: [],
    },
  ]);

  // Charger les speakers et salles
  useEffect(() => {
    const fetchData = async () => {
      const [speakersRes, roomsRes] = await Promise.all([
        fetch("/api/admin/speakers"),
        fetch("/api/admin/rooms"),
      ]);
      if (speakersRes.ok) setSpeakers(await speakersRes.json());
      if (roomsRes.ok) setRooms(await roomsRes.json());
      setLoadingData(false);
    };
    fetchData();
  }, []);

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner une image");
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 5MB");
      return false;
    }

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    setUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (res.ok) {
        const data = await res.json();
        setFormData((prev) => ({ ...prev, imageUrl: data.url }));
        toast.success("Image téléchargée avec succès");
        return true;
      } else {
        const error = await res.json();
        toast.error(error.error || "Erreur lors du téléchargement");
        setImagePreview(null);
        return false;
      }
    } catch (error) {
      toast.error("Erreur lors du téléchargement");
      setImagePreview(null);
      return false;
    } finally {
      setUploading(false);
    }
  };

  const handleIconClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFileUpload(file);
    }
  };

  const addSession = () => {
    setSessions([
      ...sessions,
      {
        title: "",
        description: "",
        startTime: "",
        endTime: "",
        capacity: "",
        roomId: "",
        speakerIds: [],
      },
    ]);
  };

  const removeSession = (index: number) => {
    if (sessions.length > 1) {
      setSessions(sessions.filter((_, i) => i !== index));
    }
  };

  const updateSession = (index: number, field: string, value: any) => {
    const updated = [...sessions];
    updated[index] = { ...updated[index], [field]: value };
    setSessions(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Vérifier qu'il y a au moins une session valide
      const validSessions = sessions.filter(
        (s) => s.title && s.startTime && s.endTime && s.roomId,
      );
      if (validSessions.length === 0) {
        toast.error("Ajoutez au moins une session complète");
        setLoading(false);
        return;
      }

      // 1. Créer l'événement
      const eventPayload = {
        title: formData.title,
        description: formData.description,
        dateStart: new Date(formData.dateStart).toISOString(),
        dateEnd: new Date(formData.dateEnd).toISOString(),
        location: formData.location,
        city: formData.city,
        imageUrl: formData.imageUrl,
      };

      const eventRes = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventPayload),
      });

      if (!eventRes.ok) throw new Error("Erreur création événement");
      const event = await eventRes.json();

      // 2. Créer les sessions
      for (const session of validSessions) {
        const sessionPayload = {
          title: session.title,
          description: session.description,
          startTime: new Date(session.startTime).toISOString(),
          endTime: new Date(session.endTime).toISOString(),
          capacity: session.capacity ? parseInt(session.capacity) : null,
          eventId: event.id,
          roomId: session.roomId,
          speakerIds: session.speakerIds,
        };

        const sessionRes = await fetch("/api/admin/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(sessionPayload),
        });

        if (!sessionRes.ok) {
          console.error("Erreur création session");
        }
      }

      toast.success("Événement et sessions créés avec succès");
      router.push("/admin/events");
      router.refresh();
    } catch (error) {
      console.error("Erreur:", error);
      toast.error("Erreur lors de la création");
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-4xl mx-auto px-4 py-8">
          <p className="text-gray-500">Chargement des données...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin/events" className="text-brand-600 hover:underline">
            ← Retour
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            Créer un événement
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Informations générales */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <h2 className="text-lg font-semibold border-b pb-2">
              Informations générales
            </h2>

            {/* Image */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Image de l'événement
              </label>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />

              {imagePreview && (
                <div className="mt-2 mb-3">
                  <img
                    src={imagePreview}
                    alt="Aperçu"
                    className="w-32 h-32 rounded-lg object-cover border"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview(null);
                      setFormData({ ...formData, imageUrl: "" });
                    }}
                    className="mt-2 text-sm text-red-600 hover:text-red-800"
                  >
                    Supprimer l'image
                  </button>
                </div>
              )}

              <div className="relative">
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) => {
                    setFormData({ ...formData, imageUrl: e.target.value });
                    if (e.target.value) setImagePreview(e.target.value);
                  }}
                  placeholder="URL de l'image ou cliquez sur l'icône pour télécharger"
                  className="w-full p-2 pr-12 border rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleIconClick}
                  disabled={uploading}
                  className="absolute right-1 top-1/2 -translate-y-1/2 p-2 rounded-full text-gray-400 hover:text-brand-600 hover:bg-brand-50 transition-all duration-300 group"
                >
                  <Upload className="h-4 w-4 transition-transform duration-300 group-hover:scale-110" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Entrez une URL d'image ou cliquez sur l'icône pour télécharger
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Titre *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full p-2 border rounded-lg"
                placeholder="Nom de l'événement"
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
                className="w-full p-2 border rounded-lg"
                placeholder="Description de l'événement"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Date de début *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.dateStart}
                  onChange={(e) =>
                    setFormData({ ...formData, dateStart: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Date de fin *
                </label>
                <input
                  type="datetime-local"
                  required
                  value={formData.dateEnd}
                  onChange={(e) =>
                    setFormData({ ...formData, dateEnd: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Lieu</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg"
                  placeholder="Ivandry"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ville</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) =>
                    setFormData({ ...formData, city: e.target.value })
                  }
                  className="w-full p-2 border rounded-lg"
                  placeholder="Antananarivo"
                />
              </div>
            </div>
          </div>

          {/* Sessions */}
          <div className="bg-white rounded-xl shadow-sm p-6 space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <h2 className="text-lg font-semibold">Sessions</h2>
              <button
                type="button"
                onClick={addSession}
                className="flex items-center gap-1 text-sm text-brand-600 hover:text-brand-700"
              >
                <Plus className="h-4 w-4" /> Ajouter une session
              </button>
            </div>

            {sessions.map((session, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 space-y-3 relative"
              >
                <div className="flex justify-between items-start">
                  <h3 className="font-medium">Session {index + 1}</h3>
                  {sessions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSession(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Titre de la session *
                  </label>
                  <input
                    type="text"
                    required
                    value={session.title}
                    onChange={(e) =>
                      updateSession(index, "title", e.target.value)
                    }
                    className="w-full p-2 border rounded-lg"
                    placeholder="Titre de la session"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={session.description}
                    onChange={(e) =>
                      updateSession(index, "description", e.target.value)
                    }
                    className="w-full p-2 border rounded-lg"
                    placeholder="Description de la session"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Début *
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={session.startTime}
                      onChange={(e) =>
                        updateSession(index, "startTime", e.target.value)
                      }
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Fin *
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={session.endTime}
                      onChange={(e) =>
                        updateSession(index, "endTime", e.target.value)
                      }
                      className="w-full p-2 border rounded-lg"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Salle *
                  </label>
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
                            name={`session-${index}-room`}
                            checked={session.roomId === room.id}
                            onChange={() =>
                              updateSession(index, "roomId", room.id)
                            }
                            className="custom-radio-circle"
                          />
                          <span className="text-sm text-gray-700">
                            {room.name}
                          </span>
                        </label>
                      ))
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Sélectionnez une salle pour cette session
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">
                    Capacité
                  </label>
                  <input
                    type="number"
                    value={session.capacity}
                    onChange={(e) =>
                      updateSession(index, "capacity", e.target.value)
                    }
                    className="w-full p-2 border rounded-lg"
                    placeholder="Nombre de places"
                  />
                </div>

                {/* Intervenants - sélection multiple avec apparence de cercles */}
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
                            checked={session.speakerIds.includes(speaker.id)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                updateSession(index, "speakerIds", [
                                  ...session.speakerIds,
                                  speaker.id,
                                ]);
                              } else {
                                updateSession(
                                  index,
                                  "speakerIds",
                                  session.speakerIds.filter(
                                    (id) => id !== speaker.id,
                                  ),
                                );
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
              </div>
            ))}

            {sessions.length === 0 && (
              <p className="text-center text-gray-500 py-4">
                Aucune session. Cliquez sur "Ajouter une session"
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || uploading}
            className="w-full btn bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50 py-3"
          >
            {loading
              ? "Création en cours..."
              : "Créer l'événement avec ses sessions"}
          </button>
        </form>
      </main>
    </div>
  );
}
