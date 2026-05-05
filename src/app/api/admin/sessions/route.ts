import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  
  const sessions = await prisma.session.findMany({
    include: { 
      event: { select: { title: true } },
      room: { select: { name: true } }
    },
    orderBy: { startTime: "desc" },
  });
  
  return NextResponse.json(sessions);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  
  const { title, description, startTime, endTime, capacity, eventId, roomId, speakerIds } = await request.json();
  
  const newSession = await prisma.session.create({
    data: {
      title,
      description,
      startTime: new Date(startTime),
      endTime: new Date(endTime),
      capacity: capacity ? parseInt(capacity) : null,
      eventId,
      roomId,
      speakers: {
        create: speakerIds?.map((speakerId: string) => ({ speakerId })) || [],
      },
    },
  });
  
  return NextResponse.json(newSession);
}