"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Star, Clock, MapPin, Calendar } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFavorites() {
      const res = await fetch("/api/favorite");
      if (res.ok) {
        const data = await res.json();
        setFavorites(data);
      }
      setLoading(false);
    }
    fetchFavorites();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-4xl mx-auto px-4 py-8">
          <p className="text-gray-500">Chargement...</p>
        </main>
      </div>
    );
  }

  const favoriteEvents = favorites.filter((f) => f.event);
  const favoriteSessions = favorites.filter((f) => f.session);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Star className="h-6 w-6 text-yellow-500" />
          Mes favoris ({favorites.length})
        </h1>

        {favorites.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <Star className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Aucun favori pour le moment.</p>
            <Link href="/events" className="text-brand-600 hover:underline text-sm mt-2 inline-block">
              Parcourir les événements →
            </Link>
          </div>
        )}

        {/* Événements favoris */}
        {favoriteEvents.length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-brand-600" />
              Événements ({favoriteEvents.length})
            </h2>
            <div className="space-y-3">
              {favoriteEvents.map((fav) => (
                <Link key={fav.id} href={`/events/${fav.event.id}`}>
                  <div className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition border border-gray-100">
                    <h3 className="font-semibold text-gray-900">{fav.event.title}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      📅 {new Date(fav.event.dateStart).toLocaleDateString("fr-FR")} - {new Date(fav.event.dateEnd).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Sessions favorites */}
        {favoriteSessions.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-brand-600" />
              Sessions ({favoriteSessions.length})
            </h2>
            <div className="space-y-3">
              {favoriteSessions.map((fav) => (
                <Link key={fav.id} href={`/sessions/${fav.session.id}`}>
                  <div className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition border border-gray-100">
                    <h3 className="font-semibold text-gray-900">{fav.session.title}</h3>
                    <div className="flex gap-4 mt-2 text-xs text-gray-500">
                      <span><Clock className="h-3 w-3 inline mr-1" />{new Date(fav.session.startTime).toLocaleDateString("fr-FR")}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </main>
      <Footer />
    </div>
  );
}