import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await prisma.sessionSpeaker.deleteMany({ where: { speakerId: id } });
    await prisma.speaker.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Erreur suppression" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  try {
    const speaker = await prisma.speaker.update({
      where: { id },
      data: {
        fullName: body.fullName,
        bio: body.bio || null,
        photo: body.photo || null,
        externalLinks: body.externalLinks || null,
      },
    });
    return NextResponse.json(speaker);
  } catch (error) {
    return NextResponse.json({ error: "Erreur modification" }, { status: 500 });
  }
}

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const speaker = await prisma.speaker.findUnique({ where: { id } });
  if (!speaker) return NextResponse.json({ error: "Non trouvé" }, { status: 404 });
  return NextResponse.json(speaker);
}