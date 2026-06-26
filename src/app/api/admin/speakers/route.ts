import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const speakers = await prisma.speaker.findMany({
    where: { isDeleted: false },
    orderBy: { fullName: "asc" },
  });
  return NextResponse.json(speakers);
}

export async function POST(request: Request) {
  try {
    const { fullName, bio, photo, externalLinks } = await request.json();

    if (!fullName) {
      return NextResponse.json({ error: "Nom manquant" }, { status: 400 });
    }

    const speaker = await prisma.speaker.create({
      data: {
        fullName,
        bio: bio || null,
        photo: photo || null,
        externalLinks: externalLinks || null,
      },
    });

    return NextResponse.json(speaker, { status: 201 });
  } catch (error) {
    console.error("Erreur création speaker:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}