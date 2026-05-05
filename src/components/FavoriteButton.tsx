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

  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setIsFavorite(favorites.includes(sessionId));
  }, [sessionId]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    let newFavorites;
    if (isFavorite) {
      newFavorites = favorites.filter((id: string) => id !== sessionId);
      toast.info(`"${sessionTitle}" retiré des favoris`);
    } else {
      newFavorites = [...favorites, sessionId];
      toast.success(`"${sessionTitle}" ajouté aux favoris`);
    }
    localStorage.setItem("favorites", JSON.stringify(newFavorites));
    setIsFavorite(!isFavorite);
  };

  return (
    <button
      onClick={toggleFavorite}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg transition ${
        isFavorite ? "bg-yellow-50 text-yellow-600" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
      }`}
    >
      <Star className={`h-4 w-4 ${isFavorite ? "fill-yellow-500 text-yellow-500" : ""}`} />
      <span className="text-sm">{isFavorite ? "Favori" : "Ajouter aux favoris"}</span>
    </button>
  );
}