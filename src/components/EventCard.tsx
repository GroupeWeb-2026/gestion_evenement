"use client";

import { CalendarPlus } from "lucide-react";
import { FavoriteEventButton } from "./FavoriteEventButton";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export type EventCardData = {
  id: string;
  title: string;
  imageUrl: string;
  location: string;
  city: string;
  dateLabel: string;
  category: string;
  categoryColor?: string;
  initialLiked?: boolean;
};

export function EventCard({ event }: { event: EventCardData }) {
  const [loading, setLoading] = useState(false);
  const [inscrit, setInscrit] = useState(false);

  async function handleInscription(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    const res = await fetch("/api/registration", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventId: event.id }),
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
    <article className="group relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:shadow-lg">
      <Link href={`/events/${event.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
          <span className="absolute left-3 top-3 rounded-md bg-black/65 px-2 py-1 text-xs font-medium text-white">
            {event.dateLabel}
          </span>
          <div className="absolute right-3 top-3 z-50">
            <FavoriteEventButton eventId={event.id} />
          </div>
        </div>
        <div className="p-4">
          <h3 className="line-clamp-2 text-[15px] font-semibold text-gray-900">{event.title}</h3>
          <p className="mt-1 text-xs text-gray-500">
            {event.location}, {event.city}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: event.categoryColor ?? "#7c3aed" }}
              />
              {event.category}
            </span>
          </div>
        </div>
      </Link>

      <div className="px-4 pb-4">
        <button
          onClick={handleInscription}
          disabled={loading || inscrit}
          className={`w-full flex items-center justify-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
            inscrit
              ? "bg-green-100 text-green-700"
              : "bg-brand-600 text-white hover:bg-brand-700"
          }`}
        >
          <CalendarPlus className="h-3 w-3" />
          {loading ? "..." : inscrit ? "Inscrit ✓" : "S'inscrire"}
        </button>
      </div>
    </article>
  );
}