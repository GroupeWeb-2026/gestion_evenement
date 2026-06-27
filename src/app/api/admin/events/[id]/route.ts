import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const sessions = await prisma.session.findMany({
      where: { eventId: id },
      select: { id: true },
    });
    
    const sessionIds = sessions.map(s => s.id);
    
    await prisma.sessionSpeaker.deleteMany({
      where: { sessionId: { in: sessionIds } },
    });
    
    await prisma.question.deleteMany({
      where: { sessionId: { in: sessionIds } },
    });

    await prisma.registration.deleteMany({
      where: { eventId: id },
    });
    
    await prisma.session.deleteMany({
      where: { eventId: id },
    });
    
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
        location: body.location || null,
        city: body.city || null,
        imageUrl: body.imageUrl || null,
        category: body.category || null,
      },
    });
    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json({ error: "Événement non trouvé" }, { status: 404 });
  }
}

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const event = await prisma.event.findUnique({
    where: { id },
    include: { sessions: true },
  });
  if (!event) return NextResponse.json({ error: "Non trouvé" }, { status: 404 });
  return NextResponse.json(event);
}