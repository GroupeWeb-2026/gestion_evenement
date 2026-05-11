"use client";

import { Pin, Heart, MessageCircle, Clock, User, Calendar } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export type EventCardData = {
  id: string;
  title: string;
  imageUrl: string;
  location: string;
  city: string;
  dateLabel: string;
  dateRange?: string;
  category: string;
  categoryColor?: string;
  initialLiked?: boolean;
  statusLabel?: string;
  statusColor?: string;
  messageCount?: number;
  likes?: number;
  speakers?: { id: string; fullName: string; photo?: string | null }[];
};

export function EventCard({ event }: { event: EventCardData }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(event.likes || 0);
  const [isMsgLiked, setIsMsgLiked] = useState(false);

  const displaySpeakers = event.speakers?.slice(0, 3) || [];
  const remainingCount = (event.speakers?.length || 0) - 3;

  useEffect(() => {
    const likedEvents = JSON.parse(localStorage.getItem("likedEvents") || "{}");
    setIsLiked(likedEvents[event.id] || false);
    
    const storedLikes = JSON.parse(localStorage.getItem("eventLikes") || "{}");
    if (storedLikes[event.id] !== undefined) {
      setLikesCount(storedLikes[event.id]);
    } else {
      setLikesCount(event.likes || 0);
    }
  }, [event.id, event.likes]);

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    const newLikedState = !isLiked;
    const increment = newLikedState ? 1 : -1;
    
    const newLikesCount = likesCount + increment;
    setLikesCount(newLikesCount);
    setIsLiked(newLikedState);
    
    const likedEvents = JSON.parse(localStorage.getItem("likedEvents") || "{}");
    likedEvents[event.id] = newLikedState;
    localStorage.setItem("likedEvents", JSON.stringify(likedEvents));
    
    const storedLikes = JSON.parse(localStorage.getItem("eventLikes") || "{}");
    storedLikes[event.id] = newLikesCount;
    localStorage.setItem("eventLikes", JSON.stringify(storedLikes));
    
    try {
      await fetch(`/api/events/${event.id}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ increment }),
      });
    } catch (error) {
      console.error("Erreur like API:", error);
      setLikesCount(likesCount);
      setIsLiked(!newLikedState);
    }
  };

  const handleMessage = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMsgLiked(!isMsgLiked);
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

          {/* Date range */}
          {event.dateRange && (
            <div className="mt-1 flex items-center gap-1 text-xs text-gray-400 cursor-default">
              <Calendar className="h-3 w-3" />
              <span>{event.dateRange}</span>
            </div>
          )}

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

          {/* Liste des intervenants (speakers) */}
          {displaySpeakers.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              {displaySpeakers.map((speaker) => (
                <div
                  key={speaker.id}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-gray-100 text-xs text-gray-600"
                >
                  {speaker.photo ? (
                    <img
                      src={speaker.photo}
                      alt={speaker.fullName}
                      className="w-4 h-4 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-3 w-3" />
                  )}
                  <span>{speaker.fullName.split(" ")[0]}</span>
                </div>
              ))}
              {remainingCount > 0 && (
                <div className="px-2 py-0.5 rounded-full bg-gray-100 text-xs text-gray-500">
                  +{remainingCount}
                </div>
              )}
            </div>
          )}

          {/* Ligne des boutons et badge statut */}
          <div className="mt-4 flex items-center justify-between border-t pt-3">
            <div className="flex items-center gap-3">
              <button
                onClick={handleLike}
                className="flex items-center cursor-pointer gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors group/like"
              >
                <Heart
                  className={`h-4 w-4 transition-colors ${
                    isLiked 
                      ? "fill-red-500 text-red-500" 
                      : "text-gray-500 group-hover/like:text-red-500 group-hover/like:fill-red-500"
                  }`}
                />
                <span className={`text-xs font-medium transition-colors ${
                  isLiked ? "text-red-500" : "text-gray-600 group-hover/like:text-red-500"
                }`}>
                  {likesCount}
                </span>
              </button>

              <button
                onClick={handleMessage}
                className="flex items-center cursor-pointer gap-1.5 px-3 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors group/msg"
              >
                <MessageCircle className="h-4 w-4 text-gray-500 transition-colors group-hover/msg:text-brand-600" />
                <span className="text-xs text-gray-600 font-medium transition-colors group-hover/msg:text-brand-600">
                  {event.messageCount || 0}
                </span>
              </button>
            </div>

            <div
              className={`px-2.5 py-1 rounded-full cursor-default text-xs font-medium ${event.statusColor || "bg-blue-100 text-blue-700"}`}
            >
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{event.statusLabel || "À venir"}</span>
              </div>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}