"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Star, Clock, MapPin } from "lucide-react";

interface Session {
  id: string;
  title: string;
  description: string | null;
  startTime: Date;
  endTime: Date;
  room: { name: string };
  event: { title: string; id: string };
}

export default function FavoritesPage() {
  const [favoriteSessions, setFavoriteSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
      if (favorites.length === 0) {
        setFavoriteSessions([]);
        setLoading(false);
        return;
      }
      const res = await fetch("/api/favorites/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionIds: favorites }),
      });
      if (res.ok) {
        const data = await res.json();
        setFavoriteSessions(data);
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Mes sessions favorites</h1>
        <p className="text-gray-600 mb-6">Sessions que vous avez ajoutées à vos favoris</p>

        {favoriteSessions.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <Star className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Aucune session favorite</p>
            <Link href="/events" className="text-brand-600 hover:underline text-sm mt-2 inline-block">
              Parcourir les événements →
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4">
          {favoriteSessions.map((session) => (
            <Link key={session.id} href={`/sessions/${session.id}`}>
              <div className="bg-white rounded-xl shadow-sm p-5 hover:shadow-md transition border border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900">{session.title}</h2>
                <p className="text-sm text-gray-500 mt-1">{session.event.title}</p>
                <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(session.startTime).toLocaleDateString("fr-FR")} à {new Date(session.startTime).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}</div>
                  <div className="flex items-center gap-1"><MapPin className="h-3 w-3" />{session.room.name}</div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}