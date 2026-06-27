import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  try {
    const { eventId, sessionId } = await request.json();

    const favorite = await prisma.favorite.create({
      data: {
        userId: session.user.id,
        eventId: eventId || null,
        sessionId: sessionId || null,
      },
    });

    return NextResponse.json(favorite, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Déjà en favori ou erreur" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  try {
    const { eventId, sessionId } = await request.json();

    if (eventId) {
      await prisma.favorite.deleteMany({
        where: { userId: session.user.id, eventId },
      });
    }

    if (sessionId) {
      await prisma.favorite.deleteMany({
        where: { userId: session.user.id, sessionId },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const favorites = await prisma.favorite.findMany({
    where: { userId: session.user.id },
    include: { event: true, session: true },
  });

  return NextResponse.json(favorites);
}