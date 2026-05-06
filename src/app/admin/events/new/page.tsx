"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

export default function NewEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dateStart: "",
    dateEnd: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error();
      toast.success("Évenement crée avec succès");
      router.push("/admin/events");
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
          <Link href="/admin/events" className="text-brand-600 hover:underline">
            ← Retour
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Créer un évenement</h1>
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
          <button
            type="submit"
            disabled={loading}
            className="w-full btn bg-brand-600 text-white hover:bg-brand-700"
          >
            {loading ? "Création..." : "Créer l'évenement"}
          </button>
        </form>
      </main>
    </div>
  );
}