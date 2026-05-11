import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { eventIds } = await request.json();
    
    if (!eventIds || eventIds.length === 0) {
      return NextResponse.json([]);
    }
    
    // 🔥 Récupérer les ÉVÉNEMENTS (pas les sessions)
    const events = await prisma.event.findMany({
      where: { id: { in: eventIds } },
      include: {
        sessions: {
          include: {
            questions: true,
            speakers: {
              include: {
                speaker: true,
              },
            },
          },
          orderBy: { startTime: "asc" },
        },
      },
    });
    
    // Formater les événements comme dans page.tsx
    const formattedEvents = events.map((e) => {
      const sessionStartDate = e.sessions[0]?.startTime;
      const sessionEndDate = e.sessions[e.sessions.length - 1]?.endTime;
      
      const dateLabel = sessionStartDate
        ? new Date(sessionStartDate).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }).toUpperCase()
        : new Date(e.dateStart).toLocaleDateString("fr-FR", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }).toUpperCase();
      
      const dateRange = sessionStartDate && sessionEndDate
        ? `${new Date(sessionStartDate).toLocaleDateString("fr-FR")} - ${new Date(sessionEndDate).toLocaleDateString("fr-FR")}`
        : `${new Date(e.dateStart).toLocaleDateString("fr-FR")} - ${new Date(e.dateEnd).toLocaleDateString("fr-FR")}`;
      
      const allSpeakers = new Map();
      e.sessions.forEach(session => {
        session.speakers.forEach(({ speaker }) => {
          if (!allSpeakers.has(speaker.id)) {
            allSpeakers.set(speaker.id, {
              id: speaker.id,
              fullName: speaker.fullName,
              photo: speaker.photo,
            });
          }
        });
      });
      
      return {
        id: e.id,
        title: e.title,
        imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
        location: "Ivandry",
        city: "Antananarivo",
        dateLabel: dateLabel,
        dateRange: dateRange,
        category: "Conférence",
        categoryColor: "#7c3aed",
        statusLabel: "En cours",
        statusColor: "bg-blue-100 text-blue-700",
        messageCount: e.sessions.reduce((total, session) => total + session.questions.length, 0),
        likes: e.likes,
        speakers: Array.from(allSpeakers.values()),
      };
    });
    
    return NextResponse.json(formattedEvents);
  } catch (error) {
    console.error("Erreur batch favorites:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}