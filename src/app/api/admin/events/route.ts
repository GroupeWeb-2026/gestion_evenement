import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { title, description, dateStart, dateEnd, organizerId } = await request.json();
    
    if (!title || !dateStart || !dateEnd) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }
    
    const event = await prisma.event.create({
      data: {
        title,
        description: description || "",
        dateStart: new Date(dateStart),
        dateEnd: new Date(dateEnd),
        organizerId: organizerId || "cmqsgjtiv0000s8kokddmnn3f",
      },
    });
    
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}

export async function GET() {
  const events = await prisma.event.findMany({
    include: { sessions: true },
    orderBy: { dateStart: "desc" },
  });
  return NextResponse.json(events);
}