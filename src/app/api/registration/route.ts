import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  try {
    const { eventId } = await request.json();

    if (!eventId) {
      return NextResponse.json({ error: "eventId manquant" }, { status: 400 });
    }

    // Vérifier si déjà inscrit
    const existing = await prisma.registration.findUnique({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId,
        },
      },
    });

    if (existing) {
      return NextResponse.json({ error: "Déjà inscrit" }, { status: 400 });
    }

    const registration = await prisma.registration.create({
      data: {
        userId: session.user.id,
        eventId,
      },
    });

    return NextResponse.json(registration, { status: 201 });
  } catch (error) {
    console.error("Erreur inscription:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  try {
    const { eventId } = await request.json();

    await prisma.registration.delete({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId,
        },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur désinscription:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}