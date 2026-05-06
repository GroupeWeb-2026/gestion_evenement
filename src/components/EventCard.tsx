"use client";

import { Pin, Heart, MessageCircle, Clock } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

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
  startTime?: Date;
  endTime?: Date;
  messageCount?: number;
};

// Fonction pour déterminer le statut d'une session
function getSessionStatus(
  startTime?: Date,
  endTime?: Date,
): { label: string; color: string } {
  if (!startTime || !endTime)
    return { label: "À venir", color: "bg-blue-100 text-blue-700" };

  const now = new Date();
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (now >= start && now <= end) {
    return { label: "LIVE", color: "bg-red-500 text-white animate-pulse" };
  } else if (now < start) {
    return { label: "À venir", color: "bg-blue-100 text-blue-700" };
  } else {
    return {
      label: "Terminée",
      color: "bg-gray-100 text-gray-500 cursor-default",
    };
  }
}

export function EventCard({ event }: { event: EventCardData }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const status = getSessionStatus(event.startTime, event.endTime);

  useEffect(() => {
    let hash = 0;
    for (let i = 0; i < event.id.length; i++) {
      hash = (hash << 5) - hash + event.id.charCodeAt(i);
      hash = hash & hash;
    }
    const likes = Math.abs(hash % 50) + 15;
    setLikesCount(likes);
  }, [event.id]);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isLiked) {
      setLikesCount(likesCount - 1);
    } else {
      setLikesCount(likesCount + 1);
    }
    setIsLiked(!isLiked);
  };

  const handleMessage = (e: React.MouseEvent) => {
    e.preventDefault();
    alert("Fonctionnalité de messagerie à venir");
  };

  return (
    <Link href={`/events/${event.id}`}>
      <article className="group overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100 transition hover:shadow-lg cursor-pointer h-full flex flex-col w-full min-w-[280px] max-w-[350px] mx-auto">
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105 cursor-default"
          />
          <span className="absolute left-3 top-3 rounded-md bg-black/65 px-2 py-1 text-xs font-medium text-white cursor-default">
            {event.dateLabel}
          </span>
          <button
            onClick={(e) => {
              e.preventDefault();
              alert("Fonctionnalité à venir");
            }}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow"
          >
            <Pin className="h-4 w-4 text-gray-500 rotate-45 cursor-pointer" />
          </button>
        </div>

        <div className="p-5 flex-1 flex flex-col">
          <h3 className="line-clamp-2 text-[16px] font-semibold text-gray-900 cursor-default">
            {event.title}
          </h3>
          <p className="mt-1 text-xs text-gray-500 cursor-default">
            {event.location}, {event.city}
          </p>

          {/* Badge catégorie */}
          <div className="mt-3 flex items-center gap-2 cursor-default">
            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-700">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ background: event.categoryColor ?? "#7c3aed" }}
              />
              {event.category}
            </span>
          </div>

          {/* Ligne des boutons et badge statut */}
          <div className="mt-5 flex items-center justify-between border-t pt-4">
            <div className="flex items-center gap-3">
              {/* Bouton Coeur avec fond */}
              <button
                onClick={handleLike}
                className="flex items-center cursor-pointer gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <Heart
                  className={`h-4 w-4 transition-colors ${
                    isLiked
                      ? "fill-red-500 text-red-500"
                      : "text-gray-500 hover:text-red-500"
                  }`}
                />
                <span className="text-xs text-gray-600 font-medium">
                  {likesCount}
                </span>
              </button>

              {/* Bouton Message avec fond - affiche le vrai nombre de questions */}
              <button
                onClick={handleMessage}
                className="flex items-center cursor-pointer gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <MessageCircle className="h-4 w-4 text-gray-500 hover:text-brand-600 transition-colors" />
                <span className="text-xs text-gray-600 font-medium">
                  {event.messageCount || 0}
                </span>
              </button>
            </div>

            {/* Badge Statut */}
            <div
              className={`px-2.5 py-1 rounded-full cursor-default text-xs font-medium ${status.color}`}
            >
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{status.label}</span>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
