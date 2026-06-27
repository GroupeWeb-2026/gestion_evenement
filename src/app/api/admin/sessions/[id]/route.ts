import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    await prisma.sessionSpeaker.deleteMany({
      where: { sessionId: id },
    });
    
    await prisma.question.deleteMany({
      where: { sessionId: id },
    });
    
    await prisma.session.delete({ where: { id } });
    
    return NextResponse.json({ success: true });
  } catch (error) {
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
    const result = await prisma.session.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        startTime: body.startTime ? new Date(body.startTime) : undefined,
        endTime: body.endTime ? new Date(body.endTime) : undefined,
        capacity: body.capacity || null,
        eventId: body.eventId,
        roomId: body.roomId,
      },
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Erreur modification" }, { status: 500 });
  }
}

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = await prisma.session.findUnique({
    where: { id },
    include: { room: true, event: true },
  });
  if (!result) return NextResponse.json({ error: "Non trouvé" }, { status: 404 });
  return NextResponse.json(result);
}