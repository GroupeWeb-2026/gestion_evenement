"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

export default function NewSpeakerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    photo: "",
    bio: "",
    externalLinks: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/speakers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error();
      toast.success("Speaker créé avec succès");
      router.push("/admin/speakers");
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
          <Link href="/admin/speakers" className="text-brand-600 hover:underline">← Retour</Link>
          <h1 className="text-2xl font-bold text-gray-900">Créer un speaker</h1>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nom complet *</label>
            <input type="text" required value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className="w-full p-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Photo (URL)</label>
            <input type="url" value={formData.photo} onChange={(e) => setFormData({ ...formData, photo: e.target.value })} className="w-full p-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Bio</label>
            <textarea rows={4} value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} className="w-full p-2 border rounded-lg" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Liens externes</label>
            <input type="url" value={formData.externalLinks} onChange={(e) => setFormData({ ...formData, externalLinks: e.target.value })} className="w-full p-2 border rounded-lg" />
          </div>
          <button type="submit" disabled={loading} className="w-full btn bg-brand-600 text-white">
            {loading ? "Création..." : "Créer le speaker"}
          </button>
        </form>
      </main>
    </div>
  );
}