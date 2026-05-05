import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const eventSchema = z.object({
  title: z.string().min(3),
  description: z.string().optional(),
  dateStart: z.string().datetime(),
  dateEnd: z.string().datetime(),
});

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  try {
    const body = await request.json();
    const validated = eventSchema.parse(body);
    const event = await prisma.event.create({
      data: { ...validated, dateStart: new Date(validated.dateStart), dateEnd: new Date(validated.dateEnd), organizerId: session.user.id },
    });
    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}

export async function GET() {
  const events = await prisma.event.findMany({ include: { sessions: true }, orderBy: { dateStart: "asc" } });
  return NextResponse.json(events);
}