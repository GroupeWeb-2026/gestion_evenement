import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  
  const { searchParams } = new URL(request.url);
  const showAll = searchParams.get("all") === "true";
  
  const speakers = await prisma.speaker.findMany({
    where: showAll ? {} : { isDeleted: false },
    include: { sessions: true },
    orderBy: { fullName: "asc" },
  });
  return NextResponse.json(speakers);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const body = await request.json();
  const speaker = await prisma.speaker.create({ data: body });
  return NextResponse.json(speaker);
}