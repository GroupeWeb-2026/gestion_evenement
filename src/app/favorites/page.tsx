"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { EventCard } from "@/components/EventCard";
import { Star } from "lucide-react";

interface Event {
  id: string;
  title: string;
  imageUrl: string;
  location: string;
  city: string;
  dateLabel: string;
  category: string;
  categoryColor?: string;
  statusLabel?: string;
  statusColor?: string;
  messageCount?: number;
  likes?: number;
  speakers?: { id: string; fullName: string; photo?: string | null }[];
  dateRange?: string;
}

export default function FavoritesPage() {
  const [favoriteEvents, setFavoriteEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      // 🔥 Vérifier la clé localStorage
      const favorites = JSON.parse(localStorage.getItem("favoriteEvents") || "[]");
      console.log("Favoris trouvés:", favorites);
      
      if (favorites.length === 0) {
        setFavoriteEvents([]);
        setLoading(false);
        return;
      }
      
      try {
        const res = await fetch("/api/favorites/batch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ eventIds: favorites }), // 🔥 Doit correspondre à l'API
        });
        
        if (res.ok) {
          const data = await res.json();
          console.log("Événements reçus:", data);
          setFavoriteEvents(data);
        } else {
          console.error("Erreur API:", res.status);
        }
      } catch (error) {
        console.error("Erreur fetch:", error);
      }
      setLoading(false);
    };
    
    fetchFavorites();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <main className="max-w-7xl mx-auto px-4 py-8">
          <p className="text-gray-500">Chargement...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Mes événements favoris</h1>
        <p className="text-gray-600 mb-6">Événements que vous avez épinglés</p>

        {favoriteEvents.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <Star className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Aucun événement favori</p>
            <Link href="/events" className="text-brand-600 hover:underline text-sm mt-2 inline-block">
              Parcourir les événements →
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {favoriteEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      </main>
    </div>
  );
}