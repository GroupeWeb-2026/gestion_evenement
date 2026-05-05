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
  
  const rooms = await prisma.room.findMany({
    where: showAll ? {} : { isDeleted: false },
    include: { sessions: true },
    orderBy: { name: "asc" },
  });
  return NextResponse.json(rooms);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const { name } = await request.json();
  const room = await prisma.room.create({ data: { name } });
  return NextResponse.json(room);
}