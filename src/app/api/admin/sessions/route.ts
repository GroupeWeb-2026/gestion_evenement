import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const sessions = await prisma.session.findMany({
    include: { room: true, event: true, speakers: { include: { speaker: true } } }
  });
  return NextResponse.json(sessions);
}

export async function POST(request: Request) {
  try {
    const { title, description, startTime, endTime, capacity, eventId, roomId, speakerIds } = await request.json();

    if (!title || !startTime || !endTime || !eventId || !roomId) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }

    const session = await prisma.session.create({
      data: {
        title,
        description: description || "",
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        capacity: capacity || null,
        eventId,
        roomId,
        speakers: speakerIds ? {
          create: speakerIds.map((speakerId: string) => ({ speakerId }))
        } : undefined,
      },
    });

    return NextResponse.json(session, { status: 201 });
  } catch (error) {
    console.error("Erreur création session:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}