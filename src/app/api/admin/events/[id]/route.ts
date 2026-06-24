import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;
  
  try {
    // 1. Récupérer toutes les sessions de l'événement
    const sessions = await prisma.session.findMany({
      where: { eventId: id },
      select: { id: true },
    });
    
    const sessionIds = sessions.map(s => s.id);
    
    // 2. Supprimer les associations SessionSpeaker (liens sessions-speakers)
    await prisma.sessionSpeaker.deleteMany({
      where: { sessionId: { in: sessionIds } },
    });
    
    // 3. Supprimer les questions liées aux sessions
    await prisma.question.deleteMany({
      where: { sessionId: { in: sessionIds } },
    });
    
    // 4. Supprimer les sessions
    await prisma.session.deleteMany({
      where: { eventId: id },
    });
    
    // 5. Supprimer l'événement
    await prisma.event.delete({ where: { id } });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur suppression événement:", error);
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  
  const { id } = await params;
  const body = await request.json();
  
  try {
    const event = await prisma.event.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        dateStart: body.dateStart ? new Date(body.dateStart) : undefined,
        dateEnd: body.dateEnd ? new Date(body.dateEnd) : undefined,
      },
    });
    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json({ error: "Événement non trouvé" }, { status: 404 });
  }
}