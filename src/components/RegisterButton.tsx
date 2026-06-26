"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CalendarPlus } from "lucide-react";

export function RegisterButton({ eventId }: { eventId: string }) {
  const [loading, setLoading] = useState(false);
  const [inscrit, setInscrit] = useState(false);

  async function handleInscription() {
    setLoading(true);
    const res = await fetch("/api/registration", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId }),
    });
    setLoading(false);
    if (res.status === 401) {
      toast.error("Connectez-vous pour vous inscrire");
      return;
    }
    if (res.status === 400) {
      toast.error("Vous êtes déjà inscrit");
      return;
    }
    if (res.ok) {
      setInscrit(true);
      toast.success("Inscription réussie !");
    }
  }

  return (
    <button
      onClick={handleInscription}
      disabled={loading || inscrit}
      className={`flex items-center gap-2 rounded-xl px-6 py-3 font-medium transition ${
        inscrit
          ? "bg-green-100 text-green-700"
          : "bg-brand-600 text-white hover:bg-brand-700"
      }`}
    >
      <CalendarPlus className="h-5 w-5" />
      {loading ? "..." : inscrit ? "Inscrit ✓" : "S'inscrire à cet événement"}
    </button>
  );
}