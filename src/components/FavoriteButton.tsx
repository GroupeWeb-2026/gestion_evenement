"use client";

import { useState, useEffect } from "react";
import { Star } from "lucide-react";
import { toast } from "sonner";

interface FavoriteButtonProps {
  sessionId: string;
  sessionTitle: string;
}

export function FavoriteButton({ sessionId, sessionTitle }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function checkFavorite() {
      const res = await fetch("/api/favorite");
      if (res.ok) {
        const favorites = await res.json();
        setIsFavorite(favorites.some((f: any) => f.sessionId === sessionId));
      }
    }
    checkFavorite();
  }, [sessionId]);

  async function toggleFavorite() {
    setLoading(true);
    if (isFavorite) {
      const res = await fetch("/api/favorite", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      if (res.ok) {
        setIsFavorite(false);
        toast.info(`"${sessionTitle}" retiré des favoris`);
      }
    } else {
      const res = await fetch("/api/favorite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });
      if (res.status === 401) {
        toast.error("Connectez-vous pour ajouter aux favoris");
      } else if (res.ok) {
        setIsFavorite(true);
        toast.success(`"${sessionTitle}" ajouté aux favoris !`);
      }
    }
    setLoading(false);
  }

  return (
    <button
      onClick={toggleFavorite}
      disabled={loading}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
        isFavorite ? "bg-yellow-50 text-yellow-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    >
      <Star className={`h-4 w-4 ${isFavorite ? "fill-yellow-500 text-yellow-500" : ""}`} />
      <span className="text-sm">{isFavorite ? "Favori" : "Ajouter aux favoris"}</span>
    </button>
  );
}