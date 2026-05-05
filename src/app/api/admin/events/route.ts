import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }
  
  if (session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  try {
    const { title, description, dateStart, dateEnd } = await request.json();
    
    // Validation simple
    if (!title || !dateStart || !dateEnd) {
      return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
    }
    
    const event = await prisma.event.create({
      data: {
        title,
        description: description || "",
        dateStart: new Date(dateStart),
        dateEnd: new Date(dateEnd),
        organizerId: session.user.id,
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