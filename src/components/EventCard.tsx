"use client";

import { Heart } from "lucide-react";
import { useState } from "react";

export type EventCardData = {
  id: string;
  title: string;
  imageUrl: string;
  location: string;
  city: string;
  dateLabel: string;
  category: string;
  categoryColor?: string;
  price: number;
};

export function EventCard({ event }: { event: EventCardData }) {
  const [liked, setLiked] = useState(false);
  return (
    <article className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={event.imageUrl}
          alt={event.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-md bg-black/65 px-2 py-1 text-xs font-medium text-white">
          {event.dateLabel}
        </span>
        <button
          onClick={() => setLiked((v) => !v)}
          aria-label="Favori"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow"
        >
          <Heart className={`h-4 w-4 ${liked ? "fill-brand-600 text-brand-600" : "text-gray-500"}`} />
        </button>
      </div>
      <div className="p-4">
        <h3 className="line-clamp-2 text-[15px] font-semibold text-gray-900">{event.title}</h3>
        <p className="mt-1 text-xs text-gray-500">
          {event.location}, {event.city}
        </p>
        <div className="mt-3 flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700"
          >
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ background: event.categoryColor ?? "#7c3aed" }}
            />
            {event.category}
          </span>
        </div>
        <p className="mt-3 text-sm font-semibold text-gray-900">
          {event.price.toLocaleString("fr-FR")} MGA
        </p>
      </div>
    </article>
  );
}
