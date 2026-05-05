"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

export default function NewRoomPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error();
      toast.success("Salle créée avec succès");
      router.push("/admin/rooms");
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
          <Link href="/admin/rooms" className="text-brand-600 hover:underline">← Retour</Link>
          <h1 className="text-2xl font-bold text-gray-900">Créer une salle</h1>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nom de la salle *</label>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded-lg" />
          </div>
          <button type="submit" disabled={loading} className="w-full btn bg-brand-600 text-white">
            {loading ? "Création..." : "Créer la salle"}
          </button>
        </form>
      </main>
    </div>
  );
}