"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dateStart: "",
    dateEnd: "",
    location: "",
    city: "",
  });

  useEffect(() => {
    const fetchEvent = async () => {
      const res = await fetch(`/api/admin/events/${eventId}`);
      if (res.ok) {
        const data = await res.json();
        setFormData({
          title: data.title,
          description: data.description || "",
          dateStart: data.dateStart ? data.dateStart.slice(0, 16) : "",
          dateEnd: data.dateEnd ? data.dateEnd.slice(0, 16) : "",
          location: data.location || "Ivandry",
          city: data.city || "Antananarivo",
        });
      }
      setInitialLoading(false);
    };
    fetchEvent();
  }, [eventId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        dateStart: new Date(formData.dateStart).toISOString(),
        dateEnd: new Date(formData.dateEnd).toISOString(),
        location: formData.location,
        city: formData.city,
      };
      const res = await fetch(`/api/admin/events/${eventId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      toast.success("Événement modifié avec succès");
      router.push("/admin/events");
      router.refresh();
    } catch {
      toast.error("Erreur lors de la modification");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-2xl mx-auto px-4 py-8">
          <p className="text-gray-500">Chargement...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/admin/events" className="text-brand-600 hover:underline">
            ← Retour
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Modifier l'événement</h1>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de début *</label>
              <input
                type="datetime-local"
                required
                value={formData.dateStart}
                onChange={(e) => setFormData({ ...formData, dateStart: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin *</label>
              <input
                type="datetime-local"
                required
                value={formData.dateEnd}
                onChange={(e) => setFormData({ ...formData, dateEnd: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lieu</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full p-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full btn bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-50"
          >
            {loading ? "Modification..." : "Modifier l'événement"}
          </button>
        </form>
      </main>
    </div>
  );
}