import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { sessionIds } = await request.json();
    const sessions = await prisma.session.findMany({
      where: { id: { in: sessionIds } },
      include: { room: true, event: true },
    });
    return NextResponse.json(sessions);
  } catch (error) {
    return NextResponse.json({ error: "Erreur" }, { status: 500 });
  }
}