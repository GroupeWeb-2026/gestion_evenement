"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { toast } from "sonner";

export function FavoriteEventButton({ eventId }: { eventId: string }) {
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function checkFavorite() {
      const res = await fetch("/api/favorite");
      if (res.ok) {
        const favorites = await res.json();
        setLiked(favorites.some((f: any) => f.eventId === eventId));
      }
    }
    checkFavorite();
  }, [eventId]);

  async function handleFavorite(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    if (liked) {
      const res = await fetch("/api/favorite", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });
      if (res.ok) {
        setLiked(false);
        toast.info("Retiré des favoris");
      }
    } else {
      const res = await fetch("/api/favorite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });
      if (res.status === 401) {
        toast.error("Connectez-vous pour ajouter aux favoris");
      } else if (res.ok) {
        setLiked(true);
        toast.success("Ajouté aux favoris !");
      }
    }
    setLoading(false);
  }

  return (
    <button
      onClick={handleFavorite}
      disabled={loading}
      className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow"
    >
      <Heart className={`h-4 w-4 ${liked ? "fill-red-500 text-red-500" : "text-gray-500"}`} />
    </button>
  );
}