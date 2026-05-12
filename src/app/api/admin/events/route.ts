import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const DEFAULT_IMAGE = "/logo-event.svg";

const eventSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  dateStart: z.string().datetime(),
  dateEnd: z.string().datetime(),
  location: z.string().optional(),
  city: z.string().optional(),
  imageUrl: z.string().optional(),
});

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const events = await prisma.event.findMany({
    include: { sessions: true },
    orderBy: { dateStart: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      dateStart: true,
      dateEnd: true,
      location: true,
      city: true,
      imageUrl: true,
      likes: true,
      sessions: true,
    },
  });
  return NextResponse.json(events);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const validated = eventSchema.parse(body);

    const event = await prisma.event.create({
      data: {
        title: validated.title,
        description: validated.description || "",
        dateStart: new Date(validated.dateStart),
        dateEnd: new Date(validated.dateEnd),
        location: validated.location || "Ivandry",
        city: validated.city || "Antananarivo",
        imageUrl: validated.imageUrl || DEFAULT_IMAGE,
        organizerId: session.user.id,
      },
    });
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    console.error("Erreur création événement:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
